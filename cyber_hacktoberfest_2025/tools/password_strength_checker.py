import re

def check_password_strength(password):
    score = 0
    if len(password) >= 8: score += 1
    if re.search(r'[a-z]', password): score += 1
    if re.search(r'[A-Z]', password): score += 1
    if re.search(r'\d', password): score += 1
    if re.search(r'[@$!%*?&]', password): score += 1
    if score <= 2:
        return "Weak"
    elif score == 3:
        return "Medium"
    else:
        return "Strong"

if __name__ == '__main__':
    pwd = input("Enter password to evaluate: ")
    print("Password strength:", check_password_strength(pwd))
