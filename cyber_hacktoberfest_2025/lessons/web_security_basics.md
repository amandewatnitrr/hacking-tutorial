# Web Security Basics

## Overview
This lesson explains common web vulnerabilities (OWASP Top 10) with simple examples and mitigations.

### SQL Injection (SQLi)
**Vulnerable example (do NOT use in production):**
```python
query = "SELECT * FROM users WHERE username = '" + user_input + "';"
```
**Fix:** Use parameterized queries / prepared statements.
```python
cursor.execute("SELECT * FROM users WHERE username = %s", (user_input,))
```

### Cross-Site Scripting (XSS)
**Description:** Injection of malicious scripts into web pages served to other users.
**Mitigations:** Output-escape user input, use strict Content Security Policy (CSP), and validate input.

### Cross-Site Request Forgery (CSRF)
**Mitigation:** Use CSRF tokens, SameSite cookies, and require re-authentication for sensitive actions.

### Additional Best Practices
- Validate and sanitize input server-side.
- Use HTTPS everywhere.
- Keep dependencies up to date and apply security patches.
- Implement proper authentication and authorization checks.

### Practice Exercises
1. Identify where inputs are used in a sample app and add parameterized queries.
2. Add output escaping and CSP headers to a simple page.
