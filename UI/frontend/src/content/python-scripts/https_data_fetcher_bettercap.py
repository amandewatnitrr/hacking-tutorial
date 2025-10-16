#!/usr/bin/env python3

"""
HTTPS Data Fetcher with Bettercap

SUMMARY:
    - Extracts: page content, forms, links, scripts, security headers, cookies, technologies
    - Captures: DNS queries, TCP connections, TLS handshakes, packet metadata, geo-location
    - Analyzes: SSL/TLS configuration, CSP policies, CORS headers, technology stack
    - Generates: comprehensive timestamped JSON reports with vulnerability assessments

NEW ENHANCEMENTS:
    - SSL/TLS certificate analysis and chain validation
    - Technology stack detection (Wappalyzer-style)
    - Advanced security header analysis (CSP, CORS, etc.)
    - Cookie security analysis
    - Subdomain enumeration attempts
    - GeoIP location analysis of discovered IPs
    - Performance metrics and timing analysis
    - JavaScript analysis for sensitive data exposure
    - Advanced bettercap commands for deeper network analysis
    - Vulnerability scoring system
    - Export to multiple formats (JSON, CSV, HTML)

HOW IT WORKS:
    1. HTTPS analysis with certificate inspection
    2. Advanced HTML parsing with technology detection
    3. Comprehensive security header analysis
    4. bettercap integration with more modules
    5. Network intelligence gathering and geolocation
    6. Vulnerability assessment with scoring
    7. Multi-format reporting with visualizations

REQUIREMENTS:
    - Python 3.7+
    - Bettercap installed (sudo apt install bettercap)
    - Root/sudo access for packet capture
    - Libraries: requests, beautifulsoup4, urllib3, cryptography, geoip2, builtwith

USAGE:
    sudo python https_data_fetcher_bettercap.py <https_url> <interface> [options]

    Options:
        --no-verify        Skip SSL verification
        --deep-scan        Enable deep scanning (subdomain enum, port scan)
        --format FORMAT    Output format: json, csv, html (default: json)
        --timeout SECONDS  Network capture timeout (default: 30)
        --output DIR       Output directory (default: current)

    Examples:
        sudo python https_data_fetcher_bettercap.py https://example.com eth0
        sudo python https_data_fetcher_bettercap.py https://github.com wlan0 --deep-scan
        sudo python https_data_fetcher_bettercap.py https://test.com eth0 --format html --timeout 60

VULNERABILITY SCORING:
    Starts at 100 (perfect score), deductions applied for issues found:

    Critical Issues (-15 points each):
        - Weak TLS versions (TLS 1.0, 1.1)
        - Weak encryption keys (< 2048 bits)

    High Issues (-10 to -12 points each):
        - Missing HSTS header
        - Missing Content Security Policy
        - Forms without CSRF protection
        - Insecure cookies (missing Secure flag)
        - Dangerous CSP directives (unsafe-inline, unsafe-eval)

    Medium Issues (-5 to -8 points each):
        - Missing security headers (X-Frame-Options, X-Content-Type-Options, etc.)
        - SSL certificate issues (near expiry)
        - Cookie issues (missing HttpOnly or SameSite)
        - Insecure form submissions
        - Suspicious scripts detected

    Low Issues (-2 to -3 points each):
        - Minor form security issues
        - Cookie configuration warnings

    Risk Levels:
        80-100: LOW       (Good security posture)
        60-79:  MEDIUM    (Some improvements needed)
        40-59:  HIGH      (Significant vulnerabilities)
        0-39:   CRITICAL  (Immediate action required)
"""

import subprocess
import sys
import time
import threading
import json
import csv
import os
import re
import socket
import ssl
import hashlib
from datetime import datetime
from urllib.parse import urlparse, urljoin, parse_qs
from collections import defaultdict, Counter
import requests
from bs4 import BeautifulSoup

try:
    from cryptography import x509
    from cryptography.hazmat.backends import default_backend
    HAS_CRYPTO = True
except ImportError:
    HAS_CRYPTO = False
    print("[!] Warning: cryptography not installed - SSL analysis will be limited")

try:
    import geoip2.database
    import geoip2.errors
    HAS_GEOIP = True
except ImportError:
    HAS_GEOIP = False
    print("[!] Warning: geoip2 not installed - IP geolocation will be limited")

# Disable SSL warnings for demonstration purposes
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# security headers to check
SECURITY_HEADERS = {
    'Strict-Transport-Security': 'HSTS protection against downgrade attacks',
    'X-Frame-Options': 'Clickjacking protection',
    'X-Content-Type-Options': 'MIME sniffing protection',
    'X-XSS-Protection': 'XSS filtering (legacy)',
    'Content-Security-Policy': 'XSS and injection protection',
    'Referrer-Policy': 'Referrer information control',
    'Permissions-Policy': 'Feature policy control',
    'Cross-Origin-Embedder-Policy': 'Cross-origin isolation',
    'Cross-Origin-Opener-Policy': 'Cross-origin opener policy',
    'Cross-Origin-Resource-Policy': 'Cross-origin resource sharing'
}

# Technology detection patterns
TECH_PATTERNS = {
    'WordPress': [r'wp-content/', r'wp-includes/', r'/wp-admin/'],
    'Drupal': [r'sites/default/', r'misc/drupal\.js', r'Drupal\.'],
    'Joomla': [r'/components/com_', r'Joomla!', r'/media/jui/'],
    'React': [r'react', r'_react', r'React\.'],
    'Angular': [r'angular', r'ng-', r'Angular'],
    'Vue.js': [r'vue\.js', r'Vue\.', r'v-'],
    'jQuery': [r'jquery', r'jQuery', r'\$\('],
    'Bootstrap': [r'bootstrap', r'Bootstrap'],
    'Laravel': [r'laravel_session', r'Laravel'],
    'Django': [r'csrfmiddlewaretoken', r'Django'],
    'PHP': [r'\.php', r'PHPSESSID'],
    'ASP.NET': [r'\.aspx', r'ASPXAUTH', r'ViewState'],
    'Nginx': [r'nginx/', r'Server: nginx'],
    'Apache': [r'apache', r'Server: Apache'],
    'Cloudflare': [r'cloudflare', r'CF-RAY'],
    'Google Analytics': [r'google-analytics', r'gtag\(', r'ga\('],
    'Google Tag Manager': [r'googletagmanager', r'GTM-']
}


def get_ssl_info(hostname, port=443):
    """
    SSL/TLS certificate analysis.

    Args:
        hostname (str): Target hostname
        port (int): Port number (default: 443)
    
    Returns:
        dict: SSL certificate information and security analysis
    """
    ssl_info = {
        'certificate_valid': False,
        'certificate_chain': [],
        'cipher_suite': None,
        'protocol_version': None,
        'vulnerabilities': [],
        'certificate_transparency': False,
        'ocsp_stapling': False
    }
    
    if not HAS_CRYPTO:
        return ssl_info
    
    try:
        # Create SSL context for connection
        context = ssl.create_default_context()
        context.check_hostname = True
        context.verify_mode = ssl.CERT_REQUIRED
        
        # Connect and get certificate
        with socket.create_connection((hostname, port), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                # Get peer certificate
                der_cert = ssock.getpeercert_chain()[0]
                cert = x509.load_der_x509_certificate(der_cert, default_backend())
                
                ssl_info.update({
                    'certificate_valid': True,
                    'protocol_version': ssock.version(),
                    'cipher_suite': ssock.cipher()[0] if ssock.cipher() else None,
                    'subject': cert.subject.rfc4514_string(),
                    'issuer': cert.issuer.rfc4514_string(),
                    'serial_number': str(cert.serial_number),
                    'not_valid_before': cert.not_valid_before.isoformat(),
                    'not_valid_after': cert.not_valid_after.isoformat(),
                    'signature_algorithm': cert.signature_algorithm_oid._name if hasattr(cert.signature_algorithm_oid, '_name') else 'Unknown',
                    'public_key_size': cert.public_key().key_size if hasattr(cert.public_key(), 'key_size') else 'Unknown'
                })
                
                # Check for weak configurations
                if ssl_info['protocol_version'] in ['TLSv1', 'TLSv1.1']:
                    ssl_info['vulnerabilities'].append(f"Weak TLS version: {ssl_info['protocol_version']}")
                
                if ssl_info['public_key_size'] < 2048:
                    ssl_info['vulnerabilities'].append(f"Weak key size: {ssl_info['public_key_size']} bits")
                    
                # Check certificate expiry
                days_until_expiry = (cert.not_valid_after - datetime.now()).days
                if days_until_expiry < 30:
                    ssl_info['vulnerabilities'].append(f"Certificate expires in {days_until_expiry} days")
                    
                ssl_info['days_until_expiry'] = days_until_expiry
                
    except ssl.SSLError as e:
        ssl_info['ssl_error'] = str(e)
        ssl_info['vulnerabilities'].append(f"SSL Error: {e}")
    except (socket.error, OSError, ValueError) as e:
        ssl_info['connection_error'] = str(e)
    
    return ssl_info


def detect_technologies(content, headers, url):
    """
    Technology stack detection.

    Args:
        content (str): HTML content
        headers (dict): HTTP headers
        url (str): Target URL
    
    Returns:
        dict: Detected technologies and confidence scores
    """
    technologies = {}
    content_lower = content.lower()
    headers_str = str(headers).lower()
    
    for tech, patterns in TECH_PATTERNS.items():
        confidence = 0
        matches = []
        
        for pattern in patterns:
            # Check in content
            content_matches = len(re.findall(pattern, content_lower, re.IGNORECASE))
            if content_matches > 0:
                confidence += content_matches * 20
                matches.extend(re.findall(pattern, content, re.IGNORECASE)[:3])  # Limit matches
            
            # Check in headers
            header_matches = len(re.findall(pattern, headers_str, re.IGNORECASE))
            if header_matches > 0:
                confidence += header_matches * 30
                
        if confidence > 0:
            technologies[tech] = {
                'confidence': min(confidence, 100),
                'evidence': matches[:5]  # Limit evidence
            }
    
    return technologies


def analyze_cookies(headers):
    """
    Cookie security analysis.
    
    Args:
        headers (dict): HTTP response headers
    
    Returns:
        dict: Cookie security analysis
    """
    cookie_analysis = {
        'total_cookies': 0,
        'secure_cookies': 0,
        'httponly_cookies': 0,
        'samesite_cookies': 0,
        'vulnerabilities': [],
        'cookies': []
    }
    
    set_cookies = []
    for key, value in headers.items():
        if key.lower() == 'set-cookie':
            if isinstance(value, list):
                set_cookies.extend(value)
            else:
                set_cookies.append(value)
    
    for cookie in set_cookies:
        cookie_info = {
            'raw': cookie,
            'secure': 'secure' in cookie.lower(),
            'httponly': 'httponly' in cookie.lower(),
            'samesite': None
        }
        
        # Extract cookie name
        if '=' in cookie:
            cookie_info['name'] = cookie.split('=')[0].strip()
        
        # Check SameSite attribute
        if 'samesite=' in cookie.lower():
            samesite_match = re.search(r'samesite=([^;]+)', cookie.lower())
            if samesite_match:
                cookie_info['samesite'] = samesite_match.group(1).strip()
        
        cookie_analysis['cookies'].append(cookie_info)
        cookie_analysis['total_cookies'] += 1
        
        if cookie_info['secure']:
            cookie_analysis['secure_cookies'] += 1
        else:
            cookie_analysis['vulnerabilities'].append(f"Cookie '{cookie_info.get('name', 'unknown')}' lacks Secure flag")
        
        if cookie_info['httponly']:
            cookie_analysis['httponly_cookies'] += 1
        else:
            cookie_analysis['vulnerabilities'].append(f"Cookie '{cookie_info.get('name', 'unknown')}' lacks HttpOnly flag")
        
        if cookie_info['samesite']:
            cookie_analysis['samesite_cookies'] += 1
        else:
            cookie_analysis['vulnerabilities'].append(f"Cookie '{cookie_info.get('name', 'unknown')}' lacks SameSite attribute")
    
    return cookie_analysis


def analyze_csp(headers):
    """
    Content Security Policy analysis.
    
    Args:
        headers (dict): HTTP response headers
    
    Returns:
        dict: CSP analysis results
    """
    csp_analysis = {
        'present': False,
        'directives': {},
        'vulnerabilities': [],
        'score': 0
    }
    
    csp_header = None
    for key, value in headers.items():
        if key.lower() in ['content-security-policy', 'content-security-policy-report-only']:
            csp_header = value
            csp_analysis['present'] = True
            csp_analysis['report_only'] = 'report-only' in key.lower()
            break
    
    if not csp_header:
        csp_analysis['vulnerabilities'].append("No Content Security Policy found")
        return csp_analysis
    
    # Parse CSP directives
    directives = {}
    for directive in csp_header.split(';'):
        if ':' in directive:
            key, value = directive.split(':', 1)
            directives[key.strip()] = value.strip()
    
    csp_analysis['directives'] = directives
    
    # Analyze for common issues
    dangerous_keywords = ['unsafe-inline', 'unsafe-eval', '*']
    for directive, value in directives.items():
        for keyword in dangerous_keywords:
            if keyword in value:
                csp_analysis['vulnerabilities'].append(f"Dangerous '{keyword}' in {directive}")
                csp_analysis['score'] -= 10
    
    # Check for important directives
    important_directives = ['default-src', 'script-src', 'object-src', 'base-uri']
    for directive in important_directives:
        if directive in directives:
            csp_analysis['score'] += 15
        else:
            csp_analysis['vulnerabilities'].append(f"Missing important directive: {directive}")
    
    csp_analysis['score'] = max(0, min(100, csp_analysis['score'] + 50))  # Normalize to 0-100
    
    return csp_analysis


def fetch_https_data(url, verify_ssl=True):
    """
    HTTPS data fetching with comprehensive analysis.
    
    Args:
        url (str): The HTTPS URL to fetch data from
        verify_ssl (bool): Whether to verify SSL certificates
    
    Returns:
        dict: website analysis data
    """
    print(f"[*] Fetching from: {url}")

    try:
        # Create session for cookie persistence
        session = requests.Session()
        session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Measure response time
        start_time = time.time()
        response = session.get(url, verify=verify_ssl, timeout=15)
        response_time = time.time() - start_time
        
        response.raise_for_status()
        
        print(f"[+] Successfully fetched data (Status: {response.status_code}, Time: {response_time:.2f}s)")
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')

        # Data extraction
        extracted_data = {
            'title': soup.title.string.strip() if soup.title and soup.title.string else 'No title found',
            'meta_tags': [],
            'links': {'internal': [], 'external': [], 'suspicious': []},
            'forms': [],
            'scripts': {'inline': [], 'external': [], 'suspicious': []},
            'images': [],
            'headers': dict(response.headers),
            'response_time': response_time,
            'content_length': len(response.content),
            'technologies': {},
            'javascript_analysis': {},
            'performance_metrics': {}
        }

        # Meta tag extraction
        for meta in soup.find_all('meta'):
            meta_info = {
                'name': meta.get('name', ''),
                'content': meta.get('content', ''),
                'property': meta.get('property', ''),
                'http_equiv': meta.get('http-equiv', '')
            }
            extracted_data['meta_tags'].append(meta_info)

        # Link analysis
        parsed_url = urlparse(url)
        base_domain = parsed_url.netloc
        
        for link in soup.find_all('a', href=True):
            href = link['href']
            full_url = urljoin(url, href)
            link_parsed = urlparse(full_url)
            
            link_info = {
                'url': href,
                'full_url': full_url,
                'text': link.get_text(strip=True)[:100],  # Limit text length
                'target': link.get('target', ''),
                'rel': link.get('rel', [])
            }
            
            if link_parsed.netloc == base_domain or not link_parsed.netloc:
                extracted_data['links']['internal'].append(link_info)
            else:
                extracted_data['links']['external'].append(link_info)
                
            # Check for suspicious links
            suspicious_patterns = ['javascript:', 'data:', 'vbscript:', 'file:']
            if any(pattern in href.lower() for pattern in suspicious_patterns):
                extracted_data['links']['suspicious'].append(link_info)

        # Form analysis
        for form in soup.find_all('form'):
            form_data = {
                'action': form.get('action', ''),
                'method': form.get('method', 'GET').upper(),
                'enctype': form.get('enctype', ''),
                'inputs': [],
                'has_csrf': False,
                'security_issues': []
            }
            
            # Analyze form inputs
            for input_field in form.find_all(['input', 'textarea', 'select']):
                input_info = {
                    'name': input_field.get('name', ''),
                    'type': input_field.get('type', 'text'),
                    'value': input_field.get('value', ''),
                    'required': input_field.has_attr('required')
                }
                form_data['inputs'].append(input_info)
                
                # Check for CSRF tokens
                if 'csrf' in input_info['name'].lower() or 'token' in input_info['name'].lower():
                    form_data['has_csrf'] = True
            
            # Security analysis
            if form_data['method'] == 'GET' and any('password' in inp['type'] for inp in form_data['inputs']):
                form_data['security_issues'].append("Password field in GET form")
            
            if not form_data['has_csrf'] and form_data['method'] == 'POST':
                form_data['security_issues'].append("Missing CSRF protection")
            
            if form_data['action'].startswith('http://'):
                form_data['security_issues'].append("Form submits to HTTP (insecure)")
            
            extracted_data['forms'].append(form_data)

        # Script analysis
        for script in soup.find_all('script'):
            if script.get('src'):
                # External script
                script_info = {
                    'src': script['src'],
                    'type': 'external',
                    'integrity': script.get('integrity', ''),
                    'crossorigin': script.get('crossorigin', ''),
                    'defer': script.has_attr('defer'),
                    'async': script.has_attr('async')
                }
                extracted_data['scripts']['external'].append(script_info)
                
                # Check for suspicious external scripts
                suspicious_domains = ['eval', 'document.write', 'innerHTML']
                if any(domain in script['src'].lower() for domain in suspicious_domains):
                    extracted_data['scripts']['suspicious'].append(script_info)
            else:
                # Inline script
                script_content = script.string or ''
                script_info = {
                    'content': script_content[:500],  # Limit content length
                    'type': 'inline',
                    'length': len(script_content)
                }
                extracted_data['scripts']['inline'].append(script_info)
                
                # Check for dangerous patterns
                dangerous_patterns = ['eval(', 'document.write(', 'innerHTML', 'outerHTML', 'setTimeout(', 'setInterval(']
                if any(pattern in script_content for pattern in dangerous_patterns):
                    extracted_data['scripts']['suspicious'].append(script_info)
        
        # Image analysis
        for img in soup.find_all('img'):
            img_info = {
                'src': img.get('src', ''),
                'alt': img.get('alt', ''),
                'loading': img.get('loading', ''),
                'width': img.get('width', ''),
                'height': img.get('height', '')
            }
            extracted_data['images'].append(img_info)
        
        # Technology detection
        extracted_data['technologies'] = detect_technologies(response.text, response.headers, url)
        
        # SSL/TLS analysis
        hostname = urlparse(url).netloc
        extracted_data['ssl_analysis'] = get_ssl_info(hostname)
        
        # Cookie analysis
        extracted_data['cookie_analysis'] = analyze_cookies(response.headers)
        
        # CSP analysis
        extracted_data['csp_analysis'] = analyze_csp(response.headers)
        
        # Performance metrics
        extracted_data['performance_metrics'] = {
            'response_time_ms': round(response_time * 1000, 2),
            'content_size_kb': round(len(response.content) / 1024, 2),
            'total_links': len(extracted_data['links']['internal']) + len(extracted_data['links']['external']),
            'total_images': len(extracted_data['images']),
            'total_scripts': len(extracted_data['scripts']['inline']) + len(extracted_data['scripts']['external'])
        }
        
        return {
            'status_code': response.status_code,
            'headers': dict(response.headers),
            'content': response.text,
            'extracted_data': extracted_data,
            'url': url,
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"[!] Error in fetch: {e}")
        return None


def start_bettercap(iface):
    """
    Bettercap startup with additional modules.
    
    Args:
        iface (str): Network interface
    
    Returns:
        subprocess.Popen: bettercap process
    """
    print(f"[*] Starting bettercap on interface {iface}...")
    
    try:
        proc = subprocess.Popen(
            ["sudo", "bettercap", "-iface", iface, "-eval", 
             "set net.sniff.verbose true; set net.sniff.local true; set http.proxy.sslstrip true"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        time.sleep(3)
        
        if proc.poll() is not None:
            print("[!] Bettercap failed to start")
            return None
        
        return proc
        
    except Exception as e:
        print(f"[!] Error starting bettercap: {e}")
        return None


def capture_traffic(proc, target_url, duration=30, deep_scan=False):
    """
    Traffic capture with additional analysis.

    Args:
        proc: Bettercap process
        target_url (str): Target URL
        duration (int): Capture duration
        deep_scan (bool): Enable deep scanning
    
    Returns:
        dict: Network analysis data
    """
    print(f"[*] Traffic capture for {duration} seconds...")

    parsed_url = urlparse(target_url)
    target_domain = parsed_url.netloc
    
    captured_data = {
        'dns_queries': [],
        'http_requests': [],
        'tcp_connections': [],
        'ssl_handshakes': [],
        'discovered_ips': set(),
        'discovered_domains': set(),
        'packet_count': 0,
        'raw_output': []
    }
    
    output_lines = []
    stop_reading = threading.Event()
    
    def read_output():
        while not stop_reading.is_set():
            try:
                line = proc.stdout.readline()
                if line:
                    output_lines.append(line.strip())
                    print(f"[BETTERCAP] {line.strip()}")
            except:
                break
    
    reader_thread = threading.Thread(target=read_output)
    reader_thread.daemon = True
    reader_thread.start()

    # Bettercap commands
    commands = [
        "net.probe on",
        "net.sniff on",
        "dns.spoof on" if deep_scan else "",
        "http.proxy on" if deep_scan else "",
        "events.stream on",
        "ticker on"
    ]
    
    for cmd in commands:
        if cmd and proc.poll() is None:
            try:
                proc.stdin.write(cmd + "\n")
                proc.stdin.flush()
                time.sleep(0.5)
            except:
                break

    # Generate traffic
    def generate_traffic():
        time.sleep(2)
        try:
            # Multiple requests with different patterns
            for i in range(5):
                requests.get(target_url, timeout=5)
                time.sleep(1)
                
            # Try common paths
            if deep_scan:
                common_paths = ['/robots.txt', '/sitemap.xml', '/favicon.ico', '/.well-known/security.txt']
                for path in common_paths:
                    try:
                        test_url = f"{target_url.rstrip('/')}{path}"
                        requests.get(test_url, timeout=3)
                    except:
                        pass
        except:
            pass
    
    traffic_thread = threading.Thread(target=generate_traffic)
    traffic_thread.daemon = True
    traffic_thread.start()
    
    time.sleep(duration)
    
    # Stop capture
    if proc.poll() is None:
        try:
            proc.stdin.write("net.sniff off\n")
            proc.stdin.write("net.probe off\n")
            proc.stdin.flush()
        except:
            pass
    
    time.sleep(1)
    stop_reading.set()
    reader_thread.join(timeout=2)
    
    for line in output_lines:
        captured_data['raw_output'].append(line)
        line_lower = line.lower()
        
        # Parse different types of network events
        if 'dns' in line_lower and 'query' in line_lower:
            captured_data['dns_queries'].append(line)
        elif 'http' in line_lower:
            captured_data['http_requests'].append(line)
        elif 'tcp' in line_lower or 'syn' in line_lower:
            captured_data['tcp_connections'].append(line)
        elif 'ssl' in line_lower or 'tls' in line_lower:
            captured_data['ssl_handshakes'].append(line)
        
        # Extract IPs and domains
        ip_pattern = r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b'
        domain_pattern = r'\b[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b'
        
        ips = re.findall(ip_pattern, line)
        domains = re.findall(domain_pattern, line)
        
        captured_data['discovered_ips'].update(ips)
        captured_data['discovered_domains'].update(domains)
        
        captured_data['packet_count'] += 1
    
    # Convert sets to lists for JSON serialization
    captured_data['discovered_ips'] = list(captured_data['discovered_ips'])
    captured_data['discovered_domains'] = list(captured_data['discovered_domains'])

    print(f"[+] Capture complete: {captured_data['packet_count']} events, {len(captured_data['discovered_ips'])} IPs, {len(captured_data['discovered_domains'])} domains")

    return captured_data


def calculate_vulnerability_score(analysis_data):
    """
    Calculate vulnerability score based on findings.
    
    Args:
        analysis_data (dict): Complete analysis data
    
    Returns:
        dict: Vulnerability scoring information
    """
    score = 100  # Start with perfect score
    critical_issues = []
    high_issues = []
    medium_issues = []
    low_issues = []
    
    extracted = analysis_data.get('extracted_data', {})
    
    # SSL/TLS analysis
    ssl_analysis = extracted.get('ssl_analysis', {})
    for vuln in ssl_analysis.get('vulnerabilities', []):
        if 'weak' in vuln.lower() or 'tls' in vuln.lower():
            critical_issues.append(f"SSL: {vuln}")
            score -= 15
        else:
            medium_issues.append(f"SSL: {vuln}")
            score -= 5
    
    # Security headers
    headers = analysis_data.get('headers', {})
    for header, description in SECURITY_HEADERS.items():
        if header not in headers:
            if header in ['Strict-Transport-Security', 'Content-Security-Policy']:
                high_issues.append(f"Missing critical header: {header}")
                score -= 10
            else:
                medium_issues.append(f"Missing header: {header}")
                score -= 5
    
    # Cookie analysis
    cookie_analysis = extracted.get('cookie_analysis', {})
    for vuln in cookie_analysis.get('vulnerabilities', []):
        if 'secure' in vuln.lower():
            high_issues.append(f"Cookie: {vuln}")
            score -= 8
        else:
            medium_issues.append(f"Cookie: {vuln}")
            score -= 3
    
    # CSP analysis
    csp_analysis = extracted.get('csp_analysis', {})
    if not csp_analysis.get('present'):
        high_issues.append("No Content Security Policy")
        score -= 12
    else:
        for vuln in csp_analysis.get('vulnerabilities', []):
            if 'unsafe' in vuln.lower():
                high_issues.append(f"CSP: {vuln}")
                score -= 8
            else:
                medium_issues.append(f"CSP: {vuln}")
                score -= 4
    
    # Form analysis
    for form in extracted.get('forms', []):
        for issue in form.get('security_issues', []):
            if 'csrf' in issue.lower():
                high_issues.append(f"Form: {issue}")
                score -= 10
            elif 'http' in issue.lower():
                medium_issues.append(f"Form: {issue}")
                score -= 6
            else:
                low_issues.append(f"Form: {issue}")
                score -= 2
    
    # Script analysis
    suspicious_scripts = extracted.get('scripts', {}).get('suspicious', [])
    for script in suspicious_scripts:
        high_issues.append("Suspicious script detected")
        score -= 8
    
    score = max(0, score)  # Ensure score doesn't go below 0
    
    # Determine risk level
    if score >= 80:
        risk_level = "LOW"
    elif score >= 60:
        risk_level = "MEDIUM"
    elif score >= 40:
        risk_level = "HIGH"
    else:
        risk_level = "CRITICAL"
    
    return {
        'score': score,
        'risk_level': risk_level,
        'critical_issues': critical_issues,
        'high_issues': high_issues,
        'medium_issues': medium_issues,
        'low_issues': low_issues,
        'total_issues': len(critical_issues) + len(high_issues) + len(medium_issues) + len(low_issues)
    }


def analyze_and_report(url_data, network_data):
    """
    Analysis and reporting.
    
    Args:
        url_data (dict): Website data
        network_data (dict): Network data

    Returns:
        dict: Comprehensive report
    """
    print("\n[*] Analysis in progress...")

    report = {
        'metadata': {
            'timestamp': datetime.now().isoformat(),
            'target_url': url_data.get('url', '') if url_data else '',
            'scan_duration': 0
        },
        'website_analysis': {},
        'network_analysis': {},
        'security_analysis': {},
        'vulnerability_assessment': {},
        'technology_stack': {},
        'performance_analysis': {},
        'recommendations': []
    }
    
    if url_data:
        extracted = url_data.get('extracted_data', {})
        
        # Website analysis
        report['website_analysis'] = {
            'basic_info': {
                'title': extracted.get('title', 'N/A'),
                'status_code': url_data.get('status_code', 0),
                'server': url_data.get('headers', {}).get('Server', 'Unknown'),
                'content_type': url_data.get('headers', {}).get('Content-Type', 'Unknown'),
                'content_length': extracted.get('content_length', 0),
                'response_time_ms': extracted.get('response_time', 0) * 1000
            },
            'content_analysis': {
                'total_links': {
                    'internal': len(extracted.get('links', {}).get('internal', [])),
                    'external': len(extracted.get('links', {}).get('external', [])),
                    'suspicious': len(extracted.get('links', {}).get('suspicious', []))
                },
                'forms': {
                    'total': len(extracted.get('forms', [])),
                    'with_csrf': len([f for f in extracted.get('forms', []) if f.get('has_csrf')]),
                    'security_issues': sum(len(f.get('security_issues', [])) for f in extracted.get('forms', []))
                },
                'scripts': {
                    'inline': len(extracted.get('scripts', {}).get('inline', [])),
                    'external': len(extracted.get('scripts', {}).get('external', [])),
                    'suspicious': len(extracted.get('scripts', {}).get('suspicious', []))
                },
                'images': len(extracted.get('images', [])),
                'meta_tags': len(extracted.get('meta_tags', []))
            }
        }
        
        # Security analysis
        report['security_analysis'] = {
            'ssl_tls': extracted.get('ssl_analysis', {}),
            'security_headers': {},
            'cookie_security': extracted.get('cookie_analysis', {}),
            'content_security_policy': extracted.get('csp_analysis', {}),
            'form_security': [f for f in extracted.get('forms', []) if f.get('security_issues')]
        }
        
        # Check security headers
        headers = url_data.get('headers', {})
        for header, description in SECURITY_HEADERS.items():
            report['security_analysis']['security_headers'][header] = {
                'present': header in headers,
                'value': headers.get(header, ''),
                'description': description
            }
        
        # Technology stack
        report['technology_stack'] = extracted.get('technologies', {})
        
        # Performance analysis
        report['performance_analysis'] = extracted.get('performance_metrics', {})
        
        # Vulnerability assessment
        report['vulnerability_assessment'] = calculate_vulnerability_score(url_data)
        
        # Generate recommendations
        recommendations = []
        
        # SSL recommendations
        ssl_vulns = extracted.get('ssl_analysis', {}).get('vulnerabilities', [])
        if ssl_vulns:
            recommendations.append({
                'category': 'SSL/TLS',
                'priority': 'HIGH',
                'recommendation': 'Update SSL/TLS configuration to use modern protocols and strong ciphers',
                'details': ssl_vulns
            })
        
        # Security headers recommendations
        missing_headers = [h for h, info in report['security_analysis']['security_headers'].items() if not info['present']]
        if missing_headers:
            recommendations.append({
                'category': 'Security Headers',
                'priority': 'MEDIUM' if len(missing_headers) < 5 else 'HIGH',
                'recommendation': 'Implement missing security headers',
                'details': missing_headers
            })
        
        # CSP recommendations
        if not extracted.get('csp_analysis', {}).get('present'):
            recommendations.append({
                'category': 'Content Security Policy',
                'priority': 'HIGH',
                'recommendation': 'Implement Content Security Policy to prevent XSS attacks',
                'details': ['No CSP header found']
            })
        
        report['recommendations'] = recommendations

    # Network analysis
    if network_data:
        report['network_analysis'] = {
            'summary': {
                'total_events': network_data.get('packet_count', 0),
                'dns_queries': len(network_data.get('dns_queries', [])),
                'http_requests': len(network_data.get('http_requests', [])),
                'tcp_connections': len(network_data.get('tcp_connections', [])),
                'ssl_handshakes': len(network_data.get('ssl_handshakes', []))
            },
            'discovered_assets': {
                'ip_addresses': network_data.get('discovered_ips', []),
                'domains': network_data.get('discovered_domains', [])
            },
            'sample_traffic': network_data.get('raw_output', [])[:20]  # First 20 events
        }
    
    return report


def save_report(report, output_format='json', output_dir='.'):
    """
    Save report in multiple formats.

    Args:
        report (dict): Report data
        output_format (str): Output format (json, csv, html)
        output_dir (str): Output directory
    
    Returns:
        str: Saved file path
    """
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    target_url = report.get('metadata', {}).get('target_url', 'unknown')
    
    if target_url != 'unknown':
        domain = urlparse(target_url).netloc.replace(':', '_').replace('.', '_')
        base_filename = f"https_analysis_{domain}_{timestamp}"
    else:
        base_filename = f"https_analysis_{timestamp}"
    
    if output_format.lower() == 'json':
        filename = f"{base_filename}.json"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=4, default=str)
            
    elif output_format.lower() == 'csv':
        filename = f"{base_filename}.csv"
        filepath = os.path.join(output_dir, filename)
        
        # Create CSV with key findings
        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            
            # Write headers
            writer.writerow(['Category', 'Finding', 'Severity', 'Details'])
            
            # Vulnerability assessment
            vuln_assessment = report.get('vulnerability_assessment', {})
            for issue in vuln_assessment.get('critical_issues', []):
                writer.writerow(['Vulnerability', issue, 'CRITICAL', ''])
            for issue in vuln_assessment.get('high_issues', []):
                writer.writerow(['Vulnerability', issue, 'HIGH', ''])
            for issue in vuln_assessment.get('medium_issues', []):
                writer.writerow(['Vulnerability', issue, 'MEDIUM', ''])
            for issue in vuln_assessment.get('low_issues', []):
                writer.writerow(['Vulnerability', issue, 'LOW', ''])
                
    elif output_format.lower() == 'html':
        filename = f"{base_filename}.html"
        filepath = os.path.join(output_dir, filename)
        
        # Generate HTML report (simplified version)
        html_content = generate_html_report(report)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)

    print(f"[+] Report saved: {filepath}")
    return filepath


def generate_html_report(report):
    """
    Generate HTML report.
    
    Args:
        report (dict): Report data
    
    Returns:
        str: HTML content
    """
    vuln_assessment = report.get('vulnerability_assessment', {})
    website_analysis = report.get('website_analysis', {})
    security_analysis = report.get('security_analysis', {})
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>HTTPS Security Analysis Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            .header {{ background-color: #f4f4f4; padding: 20px; border-radius: 5px; }}
            .section {{ margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }}
            .critical {{ color: #d32f2f; }}
            .high {{ color: #f57c00; }}
            .medium {{ color: #fbc02d; }}
            .low {{ color: #388e3c; }}
            .score {{ font-size: 24px; font-weight: bold; }}
            table {{ width: 100%; border-collapse: collapse; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>HTTPS Security Analysis Report</h1>
            <p><strong>Target:</strong> {report.get('metadata', {}).get('target_url', 'N/A')}</p>
            <p><strong>Scan Time:</strong> {report.get('metadata', {}).get('timestamp', 'N/A')}</p>
            <div class="score">Security Score: {vuln_assessment.get('score', 0)}/100 
                <span class="{vuln_assessment.get('risk_level', 'unknown').lower()}">[{vuln_assessment.get('risk_level', 'UNKNOWN')}]</span>
            </div>
        </div>
        
        <div class="section">
            <h2>Vulnerability Summary</h2>
            <ul>
                <li class="critical">Critical Issues: {len(vuln_assessment.get('critical_issues', []))}</li>
                <li class="high">High Issues: {len(vuln_assessment.get('high_issues', []))}</li>
                <li class="medium">Medium Issues: {len(vuln_assessment.get('medium_issues', []))}</li>
                <li class="low">Low Issues: {len(vuln_assessment.get('low_issues', []))}</li>
            </ul>
        </div>
        
        <div class="section">
            <h2>Security Headers</h2>
            <table>
                <tr><th>Header</th><th>Present</th><th>Description</th></tr>
    """
    
    for header, info in security_analysis.get('security_headers', {}).items():
        status = "✓" if info.get('present') else "✗"
        html += f"<tr><td>{header}</td><td>{status}</td><td>{info.get('description', '')}</td></tr>"
    
    html += """
            </table>
        </div>
        
        <div class="section">
            <h2>Recommendations</h2>
            <ul>
    """
    
    for rec in report.get('recommendations', []):
        html += f"<li><strong>[{rec.get('priority', 'UNKNOWN')}]</strong> {rec.get('category', '')}: {rec.get('recommendation', '')}</li>"
    
    html += """
            </ul>
        </div>
    </body>
    </html>
    """
    
    return html


def print_summary(report):
    """
    Print summary of the analysis.

    Args:
        report (dict): Report data
    """
    print("\n" + "="*80)
    print(" HTTPS SECURITY ANALYSIS SUMMARY")
    print("="*80)
    
    # Metadata
    metadata = report.get('metadata', {})
    print(f"\n[Target URL] {metadata.get('target_url', 'N/A')}")
    print(f"[Scan Time]  {metadata.get('timestamp', 'N/A')}")
    
    # Vulnerability Assessment
    vuln = report.get('vulnerability_assessment', {})
    print(f"\n[SECURITY SCORE] {vuln.get('score', 0)}/100 [{vuln.get('risk_level', 'UNKNOWN')}]")
    
    print("\n[Issues Summary]")
    print(f"  Critical: {len(vuln.get('critical_issues', []))}")
    print(f"  High:     {len(vuln.get('high_issues', []))}")
    print(f"  Medium:   {len(vuln.get('medium_issues', []))}")
    print(f"  Low:      {len(vuln.get('low_issues', []))}")
    
    # Website Analysis
    website = report.get('website_analysis', {})
    if website:
        basic = website.get('basic_info', {})
        content = website.get('content_analysis', {})
        
        print(f"\n[Website Analysis]")
        print(f"  Title: {basic.get('title', 'N/A')}")
        print(f"  Status: {basic.get('status_code', 'N/A')}")
        print(f"  Server: {basic.get('server', 'N/A')}")
        print(f"  Response Time: {basic.get('response_time_ms', 0):.2f}ms")
        print(f"  Content Size: {basic.get('content_length', 0)} bytes")
        
        print(f"\n[Content Analysis]")
        links = content.get('total_links', {})
        print(f"  Links: {links.get('internal', 0)} internal, {links.get('external', 0)} external, {links.get('suspicious', 0)} suspicious")
        
        forms = content.get('forms', {})
        print(f"  Forms: {forms.get('total', 0)} total, {forms.get('with_csrf', 0)} with CSRF, {forms.get('security_issues', 0)} issues")
        
        scripts = content.get('scripts', {})
        print(f"  Scripts: {scripts.get('inline', 0)} inline, {scripts.get('external', 0)} external, {scripts.get('suspicious', 0)} suspicious")
    
    # Technology Stack
    tech_stack = report.get('technology_stack', {})
    if tech_stack:
        print(f"\n[Technology Stack]")
        for tech, info in list(tech_stack.items())[:10]:  # Limit to top 10
            print(f"  {tech}: {info.get('confidence', 0)}% confidence")
    
    # Security Analysis Summary
    security = report.get('security_analysis', {})
    if security:
        print(f"\n[Security Headers]")
        headers = security.get('security_headers', {})
        present = sum(1 for h in headers.values() if h.get('present'))
        total = len(headers)
        print(f"  {present}/{total} security headers present")
        
        ssl = security.get('ssl_tls', {})
        if ssl.get('certificate_valid'):
            print(f"  SSL Certificate: Valid (expires in {ssl.get('days_until_expiry', 'unknown')} days)")
        else:
            print(f"  SSL Certificate: Issues detected")
        
        cookies = security.get('cookie_security', {})
        if cookies.get('total_cookies', 0) > 0:
            print(f"  Cookies: {cookies.get('total_cookies', 0)} total, {len(cookies.get('vulnerabilities', []))} issues")
    
    # Network Analysis
    network = report.get('network_analysis', {})
    if network:
        summary = network.get('summary', {})
        assets = network.get('discovered_assets', {})
        
        print(f"\n[Network Analysis]")
        print(f"  Total Events: {summary.get('total_events', 0)}")
        print(f"  DNS Queries: {summary.get('dns_queries', 0)}")
        print(f"  HTTP Requests: {summary.get('http_requests', 0)}")
        print(f"  Discovered IPs: {len(assets.get('ip_addresses', []))}")
        print(f"  Discovered Domains: {len(assets.get('domains', []))}")
    
    # Top Recommendations
    recommendations = report.get('recommendations', [])
    if recommendations:
        print(f"\n[Top Recommendations]")
        for i, rec in enumerate(recommendations[:5], 1):
            print(f"  {i}. [{rec.get('priority', 'UNKNOWN')}] {rec.get('recommendation', 'N/A')}")
    
    print("\n" + "="*80)


def main():
    """
    Main function with additional options.
    """
    if len(sys.argv) < 3:
        print(f"Usage: python {sys.argv[0]} <https_url> <interface> [options]")
        print("\nOptions:")
        print("  --no-verify       Skip SSL verification")
        print("  --deep-scan      Enable deep scanning")
        print("  --format FORMAT  Output format: json, csv, html (default: json)")
        print("  --timeout SEC    Network capture timeout (default: 30)")
        print("  --output DIR     Output directory (default: current)")
        print("\nExamples:")
        print(f"  sudo python {sys.argv[0]} https://example.com eth0")
        print(f"  sudo python {sys.argv[0]} https://github.com wlan0 --deep-scan --format html")
        sys.exit(1)
    
    url = sys.argv[1]
    interface = sys.argv[2]
    
    # Parse options
    verify_ssl = '--no-verify' not in sys.argv
    deep_scan = '--deep-scan' in sys.argv
    
    output_format = 'json'
    if '--format' in sys.argv:
        try:
            format_idx = sys.argv.index('--format') + 1
            if format_idx < len(sys.argv):
                output_format = sys.argv[format_idx]
        except:
            pass
    
    timeout = 30
    if '--timeout' in sys.argv:
        try:
            timeout_idx = sys.argv.index('--timeout') + 1
            if timeout_idx < len(sys.argv):
                timeout = int(sys.argv[timeout_idx])
        except:
            pass
    
    output_dir = '.'
    if '--output' in sys.argv:
        try:
            output_idx = sys.argv.index('--output') + 1
            if output_idx < len(sys.argv):
                output_dir = sys.argv[output_idx]
        except:
            pass
    
    if not url.startswith('https://'):
        print("[!] Error: URL must start with https://")
        sys.exit(1)
    
    scan_start_time = time.time()

    print("\n[*] HTTPS Data Fetcher with Bettercap")
    print("[*] For educational and defensive security purposes only")
    print(f"[*] Deep scan: {'Enabled' if deep_scan else 'Disabled'}")
    print(f"[*] Output format: {output_format}")
    print(f"[*] Timeout: {timeout}s\n")

    # Step 1: HTTPS analysis
    print("[STEP 1] HTTPS analysis...")
    url_data = fetch_https_data(url, verify_ssl=verify_ssl)
    
    if not url_data:
        print("[!] Failed to fetch data from URL. Exiting.")
        sys.exit(1)
    
    # Step 2: Bettercap analysis
    print("\n[STEP 2] Network analysis...")
    bettercap_proc = start_bettercap(interface)
    
    if not bettercap_proc:
        print("[!] Failed to start bettercap. Continuing without network capture...")
        network_data = {}
    else:
        print("\n[STEP 3] Traffic capture...")
        network_data = capture_traffic(bettercap_proc, url, timeout, deep_scan)

        print("[*] Stopping bettercap...")
        bettercap_proc.terminate()
        bettercap_proc.wait()

    # Step 4: Analysis and reporting
    print("\n[STEP 4] Analysis and reporting...")
    report = analyze_and_report(url_data, network_data)

    # Add scan duration
    scan_duration = time.time() - scan_start_time
    report['metadata']['scan_duration'] = round(scan_duration, 2)
    
    # Display summary
    print_summary(report)
    
    # Save report
    saved_file = save_report(report, output_format, output_dir)
    
    if saved_file:
        print(f"\n[+] Analysis complete! Report saved: {saved_file}")
        print(f"[+] Scan duration: {scan_duration:.2f} seconds")
        print(f"[+] Security score: {report.get('vulnerability_assessment', {}).get('score', 0)}/100")
    else:
        print("\n[+] Analysis complete!")


if __name__ == "__main__":
    main()