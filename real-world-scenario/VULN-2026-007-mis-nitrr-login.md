# VULN-2026-007 — NIT Raipur MIS Login Page Security Assessment

**Target:** `https://mis.nitrr.ac.in/`  
**Login URL:** `https://mis.nitrr.ac.in/iitmsv4eGq0RuNHb0G5WbhLmTKLmTO7YBcJ4RHuXxCNPvuIw=`  
**Assessment Date:** 2026-10-28  
**Type:** Passive / Grey-box (login page only)  
**Authorization:** Institutional researcher — amandewatnitrr@gmail.com  

---

## Summary

| ID | Title | Severity | Status |
|----|-------|----------|--------|
| F1 | Base64 credential fallback — not encryption | **High** | Open |
| F2 | Broken CSP — `script-src *` + `unsafe-inline` + `unsafe-eval` | **High** | Open |
| F3 | Client-side-only SQL injection filter | **Medium** | Open |
| F4 | Sensitive `Security_Config.js` publicly accessible with clear-text auth logic | **Medium** | Open |
| F5 | Third-party ad/tracker networks on login page | **Medium** | Open |
| F6 | `debugger;` statements in production credential-handling JS | **Low** | Open |
| F7 | ASP.NET version disclosed via response header | **Low** | Open |
| F8 | AjaxControlToolkit version disclosed via ScriptResource URL | **Low** | Open |
| F9 | Captcha validation code commented out | **Medium** | Open |
| F10 | jQuery 2.2.0 — outdated with known CVEs | **Low** | Open |

---

## F1 — Base64 Credential Fallback

**Severity:** High  
**CWE:** CWE-261 (Weak Encoding for Password)  
**OWASP:** A02 — Cryptographic Failures  

### Description

`Security_Config.js` implements a three-tier credential "encryption" chain:

1. RSA-2048 encryption (primary) — correct
2. Server-side AES via `ValidateString` ASMX endpoint (fallback)
3. **`btoa(value)` — Base64 encoding (last resort)**

Base64 is trivially reversible and provides zero confidentiality. If the RSA key fetch or jsrsasign library load fails (network timeout, CDN outage), credentials are submitted as `btoa(username)` / `btoa(password)`.

### Evidence

```javascript
// From Scripts/ADMINISTRATION/Security_Config.js
error: function () {
    // Last resort: use base64 encoding for username
    $('#hdnusername').val(btoa(username));
    console.log('AES username encryption failed, using base64');
}
// ...
error: function () {
    // Last resort: use base64 encoding for password
    $('#hdnpassword').val(btoa(password));
    $('#txt_password').val('');
    console.log('AES password encryption failed, using base64');
}
```

The `catch` block also falls back to base64:
```javascript
catch (error) {
    console.error('AES encryption failed:', error);
    $('#hdnusername').val(btoa(username));
    $('#hdnpassword').val(btoa(password));
}
```

### Impact

Under degraded network conditions or CDN unavailability, user credentials (username + password) are transmitted base64-encoded, decodable in milliseconds: `atob("encodedValue")`.

### Remediation

Remove all base64 fallback paths. If RSA encryption fails, abort form submission and display an error:

```javascript
catch (error) {
    console.error('Encryption failed — aborting login');
    alert('Security error: unable to encrypt credentials. Please try again.');
    return false; // DO NOT submit
}
```

---

## F2 — Broken CSP: `script-src *` + `unsafe-inline` + `unsafe-eval`

**Severity:** High  
**CWE:** CWE-1021 / CWE-79  
**OWASP:** A05 — Security Misconfiguration  

### Description

The Content-Security-Policy header's `script-src` directive uses both a wildcard (`*`) and `'unsafe-inline'` + `'unsafe-eval'`, which completely negates XSS protection:

```
script-src * 'unsafe-inline' 'unsafe-eval' pythonapp.mastersofterp.in
```

- `*` allows scripts from any origin
- `'unsafe-inline'` allows inline `<script>` blocks and `onclick=` attributes
- `'unsafe-eval'` allows `eval()`, `setTimeout(string)`, `new Function()`

This means any XSS payload that injects an inline script tag, event handler, or `eval()` call will execute without CSP blocking it.

### Evidence

```
curl -sI https://mis.nitrr.ac.in/... | grep -i csp
content-security-policy: default-src 'self'; ... script-src * 'unsafe-inline' 'unsafe-eval' pythonapp.mastersofterp.in; ...
```

### Remediation

Replace wildcard with explicit allowlist. Remove `unsafe-inline` by using CSP nonces or hashes:

```
script-src 'nonce-{random}' 'strict-dynamic' https://cdnjs.cloudflare.com https://mis.nitrr.ac.in;
```

---

## F3 — Client-Side-Only SQL Injection Filter

**Severity:** Medium  
**CWE:** CWE-20 (Improper Input Validation)  
**OWASP:** A03 — Injection  

### Description

`Security_Config.js` implements `containsSqlInjection()` which checks for SQL keywords, `--`, `;`, `/*` etc. — but only in the browser. An attacker can bypass this entirely by:

- Disabling JavaScript
- Intercepting and modifying the form POST after encryption (Burp Suite)
- Crafting a request directly with `curl`

### Evidence

```javascript
function containsSqlInjection(input) {
    var sqlPatterns = [
        /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|UNION|WHERE)\b/i,
        /--/,
        /;/,
        /\/\*/,
        /\*\//
    ];
    // ...
}
// Called in validateLoginForm() — browser-side only
```

The filter also uses keyword matching which is incomplete (e.g., `SELEC%54`, hex encoding, comments splitting keywords bypass it).

### Remediation

- Parameterized queries / prepared statements on the server — the only real protection
- Client-side check is acceptable as UX feedback only, not security control
- Ensure server validates and sanitizes independently of client

---

## F4 — `Security_Config.js` Publicly Accessible

**Severity:** Medium  
**CWE:** CWE-540 (Inclusion of Sensitive Information in Source Code)  
**OWASP:** A05 — Security Misconfiguration  

### Description

`https://mis.nitrr.ac.in/Scripts/ADMINISTRATION/Security_Config.js` is publicly accessible without authentication. It exposes:

- Full RSA encryption/decryption logic for credentials
- The AES encryption service endpoint: `WebServices/ADMINISTRATION/DefaultPage_Config.asmx/ValidateString`
- RSA public key fetch endpoint: `WebServices/ADMINISTRATION/DefaultPage_Config.asmx/GetRSAPublicKey`
- Internal path logic (`/PresentationLayer` for localhost)
- The fallback credential transmission strategy (base64)
- VAPT ticket reference and implementation comments

The path `Scripts/ADMINISTRATION/` is guessable and the filename clearly signals security-sensitive content.

### Evidence

```
curl -s https://mis.nitrr.ac.in/Scripts/ADMINISTRATION/Security_Config.js
# Returns 3KB of authentication and encryption logic
```

### Remediation

- Minify and obfuscate production JavaScript
- Move sensitive paths to non-predictable URLs or bundle them
- Strip all comments (especially VAPT ticket references) before deployment

---

## F5 — Third-Party Ad/Tracker Networks on MIS Login Page

**Severity:** Medium  
**CWE:** CWE-359 (Exposure of Private Personal Information)  
**OWASP:** A04 — Insecure Design  

### Description

The CSP `img-src` directive allows tracking pixels from advertising and analytics networks to load on the MIS login page:

```
img-src 'self' i.ytimg.com data: cdnjs.cloudflare.com 
  i.liadm.com           ← LinkedIn Insight Tag
  px.ads.linkedin.com   ← LinkedIn ad pixel
  um.simpli.fi          ← Simpli.fi DSP
  bidberry.net          ← Ad network
  t.dtscout.com         ← DT Scout (ad analytics)
  spl.zeotap.com        ← Zeotap data platform
  match.adsrvr.org      ← The Trade Desk
  bcp.crwdcntrl.net     ← Lotame DMP
  pixel.onaudience.com  ← OnAudience
```

These third parties receive the visitor's IP address, browser fingerprint, and the fact they accessed the NIT Raipur MIS login page. This is a government institution handling student/faculty PII.

### Remediation

Remove all advertising/tracking network domains from MIS CSP. If analytics are required, use self-hosted analytics (Matomo/Plausible) with no data sharing.

---

## F6 — `debugger;` Statements in Production Credential JS

**Severity:** Low  
**CWE:** CWE-489 (Active Debug Code)  

### Evidence

```javascript
function validateLoginForm() {
    debugger;                    // ← pauses execution in DevTools
    var username = $('#txt_username').val();
    ...
}

function encryptData() {
    debugger;                    // ← in the credential encryption function
    ...
}
```

### Impact

- Pauses execution for any user with browser DevTools open
- Exposes plaintext credentials at pause point before encryption
- Confirms production deployment of development-phase code

### Remediation

Remove all `debugger;` statements. Use a build pipeline (webpack/uglify) that strips them automatically.

---

## F7 — ASP.NET Version Disclosed

**Severity:** Low  
**CWE:** CWE-200  

```
x-aspnet-version: 4.0.30319
```

ASP.NET 4.0.30319 = .NET Framework 4.0. Exact version aids attacker in targeting known CVEs for that runtime.

**Fix:** Add `<httpRuntime enableVersionHeader="false" />` in `web.config`.

---

## F8 — AjaxControlToolkit Version Disclosed

**Severity:** Low  
**CWE:** CWE-200  

ScriptResource.axd URL contains:
```
AjaxControlToolkit%2c+Version%3d3.0.20229.20843
```

Exact version `3.0.20229.20843` is disclosed in every page load. Check known CVEs for this release.

**Fix:** Enable script bundling/minification to eliminate version-stamped URLs.

---

## F9 — Captcha Validation Commented Out

**Severity:** Medium  
**CWE:** CWE-307 (Improper Restriction of Excessive Authentication Attempts)  
**OWASP:** A07 — Identification and Authentication Failures  

### Evidence

Multiple captcha validation blocks are commented out in `Security_Config.js`:

```javascript
//if (captchaValue.trim() === '') {
//    errorMessage += "Captcha Required !\n";
//}
//if (captchaCanvas && captchaValue.trim() !== '') {
//    var captchaText = captchaCanvas.getAttribute('data-captcha');
//    if (captchaText && captchaValue.toUpperCase() !== captchaText.toUpperCase()) {
//        errorMessage += "Captcha does not match. Please try again.\n";
```

The `txt_captcha` input field exists in the HTML but is not validated before form submission.

### Impact

If server-side captcha validation is also absent or bypassable, the login form has no brute force protection.

### Remediation

- Re-enable and test captcha validation end-to-end
- Implement server-side rate limiting (e.g., 5 attempts per 15 minutes per IP)
- Add account lockout after N failed attempts

---

## F10 — jQuery 2.2.0

**Severity:** Low  
**CWE:** CWE-1035  

jQuery 2.2.0 (2016) has multiple known CVEs:
- **CVE-2019-11358** — Prototype pollution via `$.extend`
- **CVE-2015-9251** — XSS via `$.ajax()` with cross-domain responses

Current stable: jQuery 3.7.x.

**Fix:** Upgrade to jQuery 3.7.1.

---

## Positive Controls Observed

- HSTS: `max-age=31536000; includeSubDomains` ✓
- Session cookie: `Secure; HttpOnly; SameSite=Lax` ✓
- `X-Content-Type-Options: nosniff` ✓
- `X-Frame-Options: SAMEORIGIN` ✓
- `Permissions-Policy` restricts camera, mic, payment ✓
- RSA-2048 primary credential encryption is correct ✓
- HTTPS enforced ✓

---

## References

- VAPT ticket referenced in source: `RFC NON-CC - MISNITRRTEST` (added 2025-12-16)
- OWASP Top 10 2021: https://owasp.org/www-project-top-ten/
- CWE-261: https://cwe.mitre.org/data/definitions/261.html
- jQuery CVE-2019-11358: https://nvd.nist.gov/vuln/detail/CVE-2019-11358
