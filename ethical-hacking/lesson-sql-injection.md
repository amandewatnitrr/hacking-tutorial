# Ethical Hacking for Beginners: SQL Injection Fundamentals
## Lesson Overview

* Level: Beginner
* Prerequisites: Basic understanding of web applications and databases
* For more hands on practice, check out the lab folder titled sql-injection-lab in the root folder.

## **1. What is SQL Injection?**
### The Attack Vector Explained
**SQL Injection (SQLi)** is a web security vulnerability that allows attackers to:

* Interfere with database queries

* Access, modify, or delete sensitive data

* Bypass authentication mechanisms

* Execute administrative operations on the database

Real-World Impact:

* Data breaches (user credentials, personal information)

* Website defacement

* Complete system compromise

* Financial losses and reputational damage

### The Role of Databases in Web Applications
```
sql
-- Typical database structure
Users Table:
+----+----------+------------------+
| id | username | password_hash    |
+----+----------+------------------+
| 1  | admin    | hashed_password  |
| 2  | john     | another_hash     |
+----+----------+------------------+
```
Web applications use databases to store and retrieve dynamic content. Common databases include:

1. MySQL

2. PostgreSQL

3. Microsoft SQL Server

4. Oracle Database

## **2. Types of SQL Injection**
### **In-Band SQLi (Classic SQLi)**
**Error-Based SQLi**
* Exploits database error messages to  gather information

* Useful for understanding database structure

**Union-Based SQLi**
* Uses UNION SQL operator to combine results from multiple tables

* Example payload: ' UNION SELECT username, password FROM users--

**Inferential (Blind) SQLi**
1. **Boolean-Based Blind SQLi**
* No direct data transfer

* Infer information based on TRUE/FALSE responses

* Example: ' AND substring(database(),1,1)='a'--

2. **Time-Based Blind SQLi**
* Uses database delay functions to infer information

* Example: '; IF (1=1) WAITFOR DELAY '0:0:5'--

**Out-of-Band SQLi**
* Uses alternative channels to retrieve data (DNS, HTTP requests)

* Less common but can be effective when other methods fail

## **3. Practical Demonstration**
### **Vulnerable Code Examples**
### VULNERABLE CODE - DO NOT USE IN PRODUCTION
PHP Vulnerable Login

```
php
<?php
// VULNERABLE CODE - DO NOT USE IN PRODUCTION
$username = $_POST['username'];
$password = $_POST['password'];

$query = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$result = mysqli_query($connection, $query);

if (mysqli_num_rows($result) > 0) {
    echo "Login successful!";
} else {
    echo "Invalid credentials!";
}
?>
```
Python Vulnerable Login
```
python
// VULNERABLE CODE - DO NOT USE IN PRODUCTION

import sqlite3

def vulnerable_login(username, password):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # This is vulnerable to SQL injection!
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    cursor.execute(query)
    
    return cursor.fetchone() is not None
```
## **Authentication Bypass Demonstration**
Normal Login Query:
```
sql
SELECT * FROM users WHERE username = 'john' AND password = 'secret123'
```
SQL Injection Attack:
```
sql
Username: admin' OR '1'='1
Password: anything

Resulting Query:
SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'anything'
```
Explanation:

* '1'='1' always evaluates to TRUE

* The OR condition makes the entire WHERE clause true

* Returns all users, typically logging in as the first user
---
---

## **Advanced Tool: sqlmap (Introduction)**
#### **What is sqlmap?**

* Open-source penetration testing tool

* Automates detection and exploitation of SQL injection flaws

Basic Usage:
```
bash

# Test a URL for SQL injection
sqlmap -u "http://example.com/login.php" --data="username=admin&password=pass"

# Enumerate databases
sqlmap -u "http://example.com/login.php" --dbs

# Get database users
sqlmap -u "http://example.com/login.php" --users
```
⚠️ Ethical Note: Only use on systems you own or have explicit permission to test

## **4. Defense and Prevention**
## Primary Defense: Parameterized Queries
### PHP Secure Implementation
```
php
<?php
// SECURE CODE - USING PREPARED STATEMENTS
$username = $_POST['username'];
$password = $_POST['password'];

$stmt = $connection->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo "Login successful!";
} else {
    echo "Invalid credentials!";
}
?>
```
### Python Secure Implementation
```
python
import sqlite3

def secure_login(username, password):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Using parameterized queries
    query = "SELECT * FROM users WHERE username = ? AND password = ?"
    cursor.execute(query, (username, password))
    
    return cursor.fetchone() is not None
```
## Input Validation and Escaping
```
php
<?php
// Input validation example
function validate_input($input) {
    // Remove whitespace
    $input = trim($input);
    // Remove backslashes
    $input = stripslashes($input);
    // Convert special characters to HTML entities
    $input = htmlspecialchars($input);
    return $input;
}

$username = validate_input($_POST['username']);
$password = validate_input($_POST['password']);
?>
```
---
## **Principle of Least Privilege**
**Database Account Security:**
```
sql
-- DON'T use root/admin accounts for web applications
CREATE USER 'webapp'@'localhost' IDENTIFIED BY 'strong_password';

-- Grant minimal permissions
GRANT SELECT, INSERT ON database.users TO 'webapp'@'localhost';
GRANT SELECT ON database.products TO 'webapp'@'localhost';

-- Explicitly deny dangerous operations
REVOKE DROP, CREATE, ALTER ON *.* FROM 'webapp'@'localhost';
```
## Additional Security Measures
#### *Web Application Firewalls (WAF)*

#### *Regular security audits*

#### *Input sanitization libraries*

#### *ORM (Object-Relational Mapping) frameworks*

## **5. Hands-On Exercise (Safe Environment)**
### **Setting Up a Test Lab**
1. Download DVWA (Damn Vulnerable Web Application)
```
bash
git clone https://github.com/digininja/DVWA.git
```
2. Set up on localhost only

3. Configure database with limited privileges

### **Practice Tasks**
1. Identify SQL injection points in DVWA

2. Practice authentication bypass

3. Test UNION-based extraction

4. Implement secure fixes in the code

5. Test with sqlmap (on your local DVWA instance)

## **6. Ethical Considerations**
### **Legal and Responsible Testing**
* Only test systems you own or have explicit written permission to test

* Follow bug bounty program rules if applicable

* Responsible disclosure when finding vulnerabilities

* Never access or modify data without authorization

### **Professional Ethics**
```
As an ethical hacker:
✓ Seek permission before testing
✓ Respect scope and boundaries  
✓ Report findings responsibly
✓ Help improve security, not exploit it
✓ Maintain confidentiality of findings
```
## **7. Key Takeaways**
### **Critical Points to Remember:**
1. SQL Injection is preventable with proper coding practices

2. Parameterized queries are your best defense

3. Input validation provides additional security layers

4. Least privilege limits potential damage

5. Ethical hacking aims to improve security, not compromise it

## **Next Steps for Learning:**
* Practice in controlled environments like DVWA or Web Security Dojo

* Learn about other OWASP Top 10 vulnerabilities

* Explore web application firewalls (WAFs)

* Study database security fundamentals

* Participate in Capture The Flag (CTF) competitions
---
---

## **Quiz: Check Your Understanding**
1. What is the primary defense against SQL injection?

2. Why should database accounts have limited privileges?

3. What makes ' OR '1'='1 effective for authentication bypass?

4. When is it ethical to test for SQL injection vulnerabilities?

5. Name two types of blind SQL injection.

For more questions and hands on practice, refer the lab on this topic.

### Answers:

1. Parameterized queries/prepared statements

2. To limit damage if a breach occurs (Principle of Least Privilege)

3. It creates a condition that always evaluates to TRUE

4. Only when you have explicit permission from the system owner

5. Boolean-based and Time-based SQLi

## **Additional Resources**
### Recommended Tools for Practice:
* DVWA (Damn Vulnerable Web Application)

* bWAPP (Buggy Web Application)

* SQLMap (For authorized testing only)

* Burp Suite (Web vulnerability scanner)

### Further Reading:
* OWASP SQL Injection Prevention Cheat Sheet

* SQL Injection Wiki: https://owasp.org/www-community/attacks/SQL_Injection

* Database Security Best Practices
* For more hands on practice, refer the sql-injection -lab folder in the root directory.

**Remember: Use these skills to make the digital world safer! 🔒**

***This lesson is for educational purposes only. Always practice ethical hacking principles.***