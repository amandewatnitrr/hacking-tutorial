# 02 — Types of SQL Injection (High level)

This file describes SQLi types at a high-level. This is conceptual only.

- **Error-based**: Bad user input causes DB errors revealing info.
- **Union-based**: Combining results via UNION to retrieve extra data.
- **Boolean-based / Blind**: Attackers infer data by differences in true/false responses.
- **Time-based**: Attackers infer data by timing responses.

**Exercise**
Read the types above and then:
1. Open `/vulnerable/` to see the illustrative string pattern that should not be used.
2. Open `/safe/search?q=alice` and review how it uses parameterized queries.

**Further reading**
- https://owasp.org/www-community/attacks/SQL_Injection
- https://portswigger.net/web-security/sql-injection
