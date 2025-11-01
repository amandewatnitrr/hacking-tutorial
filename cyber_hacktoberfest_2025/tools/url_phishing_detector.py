# Very simple heuristic-based URL phishing detector (educational only)
import re

suspicious_patterns = [
    r'\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}',  # raw IP in URL
    r'@',  # @ in URL
    r'//.*\\.//'  # double dots etc (simple)
]

def is_suspicious(url):
    score = 0
    if 'https' not in url.lower():
        score += 1
    for p in suspicious_patterns:
        if re.search(p, url):
            score += 1
    if len(url) > 75:
        score += 1
    return score >= 2

if __name__ == '__main__':
    url = input("Enter a URL to check: ").strip()
    print("Suspicious?" , is_suspicious(url))
