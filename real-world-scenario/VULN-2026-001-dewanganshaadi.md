# VULN-2026-001 — dewanganshaadi.com security issues

Site: https://www.dewanganshaadi.com
Backend: https://api.dewanganshaadi.com (prod), https://dev-api.dewanganshaadi.com (dev, also exposed to the public somehow)
Stack: Next.js frontend behind Cloudflare, Node/Express + nginx on the backend
Built by: Software Unicorn (www.softwareunicorn.com) — info@softwareunicorn.com, credit is in the site footer
Reported by: amandewatnitrr
Date: 2026-10-24
Status: Open, needs a fix from the dev side

Everything below was tested against the live site but only with read-only requests — no login bypass attempts, no writes, nothing destructive. Just curl and some basic timing.

---

## Finding 1 — we're leaking a bcrypt hash to anyone who loads the homepage

Open the site in an incognito window, no login, nothing. Check the cookies. There's an `ANONYMOUS_TOKEN` cookie and it's a JWT. People forget JWTs aren't encrypted, they're just signed — so the payload is just sitting there in plain base64, readable by anyone who bothers to decode it.

Reproduce it:

```bash
curl -sI https://www.dewanganshaadi.com | grep -i set-cookie
```

grab the middle segment of the JWT (the payload part) and run:

```bash
echo '<payload-segment>' | base64 -d
```

Here's what came back for me:

```json
{"payload":"{\"key\":\"$2b$10$xYXjlkyhIcS1rV1B0uJihueAiLxwP5SfOb4bii7.l0rY57p.prVOK\"}","iat":1792786156,"exp":1792872556}
```

That `key` value is a bcrypt hash. Cost factor 10. Sent to a visitor who hasn't even logged in.

Doesn't matter what that hash is actually "for" internally — a password, some internal secret, whatever — it has no business being on the client side at all. If it's tied to a real credential anywhere, someone can throw it at hashcat (`-m 3200`) against a common wordlist and see what falls out. Even if it's just an internal secret and not a real password, we're handing out details about how our own auth works for free.

---

## Finding 2 — that same hash gets regenerated on every single request, and nothing stops you from hammering it

This is the one that actually worries me more than finding 1.

I pulled the cookie a few times in a row, fresh requests each time:

```bash
for i in 1 2 3; do
  curl -sI https://www.dewanganshaadi.com | grep -i set-cookie | \
    grep -oE 'ANONYMOUS_TOKEN=[^;]+' | cut -d= -f2 | cut -d. -f2 | tr '_-' '/+' | base64 -d
  echo
done
```

Three separate requests, three completely different hashes:

```
Request 1: $2b$10$OKKZvw1BxSEv0rO60dDtZ.HsgDVn4xM4ROwMbhOSW5AsKxD9H4rF2
Request 2: $2b$10$ZDmUXKtH0j.NIhoVyWpHM.wamXHd4qmyBdII4X178jJXtd4Rgans2
Request 3: $2b$10$mkKukXSMbZwt9jqXG4S3FuBeEvVPb6uN/3kqSULKvzsaqZw6L7V7W
```

So we're not caching this or generating it once per session — the server is running a fresh bcrypt hash, cost 10, on every anonymous page load. Bcrypt is slow on purpose, that's the entire design of it, which is exactly the problem when you're doing it on an endpoint anyone can hit without logging in.

I timed it against a static asset to get a baseline:

```bash
# homepage, triggers the bcrypt call
for i in 1 2 3 4 5; do
  curl -s -o /dev/null -w "request $i: %{time_total}s\n" https://www.dewanganshaadi.com
done

# static JS chunk, no bcrypt involved
for i in 1 2 3 4 5; do
  curl -s -o /dev/null -w "request $i: %{time_total}s\n" \
    https://www.dewanganshaadi.com/_next/static/chunks/webpack-6e9e9d83a30a962d.js
done
```

Homepage: 0.6s–1.3s per request.
Static asset: 0.03s–0.06s.

That's a 15-30x gap, which lines up with there being a real synchronous crypto op sitting in the request path.

Then I checked if there's any rate limiting at all:

```bash
time (for i in $(seq 1 15); do
  curl -s -o /dev/null -w "req $i: %{http_code} %{time_total}s\n" https://www.dewanganshaadi.com &
done; wait)
```

All 15 came back 200. No throttling, nothing. And latency climbed to 2.1s-3.2s per request under that light load — worse than 2x the single-request baseline.

I stopped at 15 concurrent requests on purpose. This is our live site with real users on it right now, and I wasn't going to push further just to prove a point I'd already proven. But the math is obvious: attacker sends a cheap GET, we do expensive bcrypt work, no auth needed, no rate limit in the way. Scale that up with something like `hey` or `wrk` from a couple of cheap boxes and you've got a free way to chew through our CPU and slow the site down for everyone, not just the attacker.

---

## Finding 3 — the API leaks stack traces with real file paths, on every route

Found this one almost by accident while testing CORS behavior. Sent a request with a bogus `Origin` header to see how the API reacts:

```bash
curl -s -H 'Origin: https://evil-example.com' https://api.dewanganshaadi.com/public/data
```

It correctly rejects the origin (good, CORS itself is working), but the error response is a full Node stack trace:

```
Error: Not allowed by CORS
    at origin (/app/server.js:98:18)
    at /app/node_modules/cors/lib/index.js:219:13
    at optionsCallback (/app/node_modules/cors/lib/index.js:199:9)
    at corsMiddleware (/app/node_modules/cors/lib/index.js:204:7)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
    ...
    at cookieParser (/app/node_modules/cookie-parser/index.js:57:14)
```

That's a lot handed over for free: confirms Node/Express on the backend, the `cors` and `cookie-parser` middleware we're using, and the actual deployment path (`/app/server.js`). None of that should ever reach a client response.

Checked if it was a one-off on that one route, it's not — tried it against a bunch of other endpoints and got the identical trace every time:

```bash
for p in /wallet/consume /auth/verify /static-data/get-all-static-data /admin/blog/get-all-blog-by-website; do
  curl -s -H 'Origin: https://evil-example.com' "https://api.dewanganshaadi.com$p"
done
```

Same `Error: Not allowed by CORS` trace, same file paths, every route. So this isn't route-specific error handling gone wrong, it's the global error handler — probably `NODE_ENV` isn't actually set to `production` on the API box, or there's a custom error handler somewhere just dumping `err.stack` straight into the response regardless of environment.

The CORS rejection logic itself is fine. It's purely that whatever handles the resulting error is way too chatty. And if it's this loose for a CORS error, I'd bet it leaks just as much on other error types (bad DB queries, etc.) — this was just the cheapest trigger I had on hand to prove it.

---

## How bad is this, actually

Nothing here is a remote code execution bug by itself. But all three together paint a picture of an API that trusts anonymous input more than it should and leaks too much when things go wrong:

- No auth and no user interaction needed for any of this — a single curl command gets you finding 1, a basic shell loop gets you findings 2 and 3.
- Finding 2 is the one I'd prioritize. It's a real, unauthenticated path to degrading the site for actual users, and it costs the attacker almost nothing.
- Finding 3 isn't exploitable on its own but it's free recon for anyone — hands over our stack, our middleware, and our file layout in one request.
- Finding 1 sits in between — depends what that hash actually gets used for downstream, but it should never have left the server regardless.

## What I think the fix looks like

1. Stop putting the bcrypt hash in the anonymous token. If we need to track anonymous visitors, use a plain random opaque session ID, nothing hash-shaped, nothing secret-shaped. JWT payloads aren't private, so nothing sensitive goes in them, period.
2. Pull the bcrypt call out of the anonymous request path entirely. Bcrypt should only run during actual login/registration against real submitted input, not on every page load. If we genuinely need a per-session secret, generate it once, keep it server-side, don't recompute it per request.
3. Add rate limiting on the homepage / anonymous-session-issuing path — Cloudflare rate limiting rules would do it, or app-level middleware. Either way, nobody should be able to force repeated expensive work for free.
4. Set `NODE_ENV=production` on the API and add a real global error handler — log the actual error server-side, return a generic `{"error": "Internal Server Error"}` to the client, never `err.stack`.
5. Worth a broader look too — check if any other unauthenticated endpoints do expensive work per request, and actually verify auth on the backend routes from inside a real session rather than assuming robots.txt is doing any access control (it isn't, it's just a crawler hint).