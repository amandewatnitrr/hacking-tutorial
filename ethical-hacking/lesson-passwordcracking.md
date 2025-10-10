# Password Cracking 🔐

## 🔐 Password Cracking with John the Ripper

Welcome to the **John the Ripper** tutorial! This guide walks you through using one of the most powerful open-source tools for password auditing and security testing. Whether you're a cybersecurity student or an ethical hacker, this project will help you understand how password hashes are cracked using different modes in Kali Linux.

---

## 📘 What is John the Ripper?

**John the Ripper (JtR)** is a free, open-source password cracking tool primarily used for security testing and password auditing. It works by analyzing password hashes—encrypted versions of passwords stored in operating systems, applications, and databases—and attempting to reveal the original password using various cracking techniques.

---

## 🧠 Cracking Modes Explained

John the Ripper supports multiple modes of attack:

### 1. Dictionary Attack

Uses a predefined wordlist to test each word against the hash until a match is found.

### 2. Brute Force Attack

Generates every possible combination of characters until the correct password is discovered.

### 3. Incremental Mode

Starts with simple passwords and gradually increases complexity based on defined rules.

![Cracking Modes Explained](https://media.geeksforgeeks.org/wp-content/uploads/20250823161107889355/core_operations_patterns.webp)

---

## 🛠️ Getting Started in Kali Linux

### Step 1: In Kali Linux, the John the Ripper tool is pre-installed, but if you are facing any issues, then you can install it again using the following command

```bash
sudo apt install john
```

![Step1](https://media.geeksforgeeks.org/wp-content/uploads/20240608112608/0InstallUpdateJohn.jpg)

### Step 2: Now using following command we can check the john the ripper version and other related information

```bash
john
```

![Step2](https://media.geeksforgeeks.org/wp-content/uploads/20240608113054/1John.jpg)

### Step 3: For our testing and demo purpose we have hash file which consists hash password in diffirent diffirent format and also we have custom wordlist for dictionary attack using john the ripper. For listing everything and seeing we can use following command

```bash
ls
```

![Step3](https://media.geeksforgeeks.org/wp-content/uploads/20240608113227/11Ls.jpg)

### Step 4: Now for findig password using dictionary attack we can use following command where rockyou.txt file is wordlist which exists by default in kali linux and alpha.txt is our hash stored file which contains our real password in MD5 hash format. Using following command we can see we cracked the password which is abcd

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt  alpha.txt  --format=raw-md5
```

![Step4](https://media.geeksforgeeks.org/wp-content/uploads/20240608113554/2John.jpg)

### Step 5: In another file num.txt we have MD5 hash format . We can also use incremental mode for cracking this password file where our john the ripper tool increment its value one by one and tries to match password one by one and when it matches it give us result that password has been found out

```bash
john --format=raw-md5 num.txt --incremental
```

![Step5](https://media.geeksforgeeks.org/wp-content/uploads/20240608114130/3Incremental.jpg)

### Step 6: Now in this step we will use our custom dictionary file instead of pre saved file in kali linux. This method can be very useful when we have list of passwords in which one is correct

```bash
john --wordlist=customwc.txt hash1.txt --format=raw-md5
```

![Step6](https://media.geeksforgeeks.org/wp-content/uploads/20240608114430/4Cusotom.jpg)

### Step 7: In john the ripper we can use multiple type of hash format for cracking the passwords. Following is example for cracking the password of SHA1 type hash using john the ripper in kali linux

```bash
john --wordlist=customwc.txt hashsha.txt --format=raw-sha1
```

![Step7](https://media.geeksforgeeks.org/wp-content/uploads/20240608115020/5CustomSha.jpg)

---

## 🔐 Password Cracking with HashCat

**Hashcat** is famous as the fastest password cracker and password recovery utility. Hashcat is designed to break or crack even the most complex passwords in a very short amount of time.

---

## 😍 Working Of Hashcat

Usually Hashcat tool comes pre-installed with Kali Linux, but if we need to install it, write down the given command in the terminal.

```bash
sudo apt-get install hashcat
```

![Install-HashCat-Tool](https://media.geeksforgeeks.org/wp-content/uploads/20201221131252/hashcat.png)

Now, you can find the hashcat Tool in Password Cracking Tools :

![HashCat](https://media.geeksforgeeks.org/wp-content/uploads/20210121170747/Picture1.png)

---

## Dictionary Attack using HashCat

### Step 1: Creating Hash Entries

```bash
-n: This option removes the new line added to the end of entries as we don’t want the newline characters to be hashed with our entries.
```

```bash
tr -d: This option removes any characters that are a space or hyphen from the output.
```

### Step 2: Checking the stored Hashes

```bash
cat Dictionary_hashes.txt
```

### Step 3: Choose the wordlists

For Example : rockyou.txt

```bash
locate rockyou.txt
```

### Step 4: Cracking the Hashes

Now we can crack the hashes that we stored in Dictionary_hashes.txt and we will store the result in the Done.txt file.

```bash
hashcat -m 500 -a 0 Done.txt Dictionary_hashes.txt /usr/share/wordlists/rockyou.txt
```

### Step 5: Results

```bash
cat Done.txt
```

---

## Features of hashcat

- The 90+ Algorithm can be implemented with performance and optimization in mind.
- The number of threads can be configured.
- Hashcat is a multi-algorithm based ( MD5, MD4, MySQL, SHA1, NTLM, DCC, etc.).
- All attacks can be extended by specialized rules.
- It is multi-hash and multi-OS-based (Windows and Linux).
- It supports both hex-charset and hex-salt files.

---
