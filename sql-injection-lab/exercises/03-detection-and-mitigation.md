# 03 — Detection & Mitigation (Conceptual)

**Detection tips**
- Audit code for string-concatenated SQL patterns.
- Watch logs for unusual input patterns or DB errors.
- Use WAFs and runtime protections for additional defense.

**Mitigation**
- Use parameterized queries / prepared statements.
- Apply strict input validation and output encoding.
- Use least-privilege DB accounts and avoid admin-level DB connections.
- Keep detailed, immutable logs of DB queries (sanitized).

**Small task**
Compare `/vulnerable/` (illustrative pattern) and `/safe/search` (parameterized query). Note the differences in how user input is handled.

**Further reading**
- OWASP SQLi cheat sheet (search OWASP SQL injection cheat sheet)
- PortSwigger learning material
