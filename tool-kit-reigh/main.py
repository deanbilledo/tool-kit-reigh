import whois
import dns.resolver
import requests
import socket
import re
import os
import sys
import time

# Clear screen function (cross-platform)
def clear():
    os.system('cls' if os.name == 'nt' else 'clear')

# Colors
class Colors:
    CYAN = '\033[96m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    PURPLE = '\033[95m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

def banner():
    clear()
    print(f"{Colors.CYAN}╔{'═' * 78}╗{Colors.END}")
    print(f"{Colors.CYAN}║{' ' * 78}║{Colors.END}")
    print(f"{Colors.CYAN}║{Colors.PURPLE}{Colors.BOLD}{'    ████████  ████████  ████████   ████████   ':^78}{Colors.CYAN}║{Colors.END}")
    print(f"{Colors.CYAN}║{Colors.PURPLE}{Colors.BOLD}{'    ██    ██  ██        ██     ██  ██    ██  ':^78}{Colors.CYAN}║{Colors.END}")
    print(f"{Colors.CYAN}║{Colors.BLUE}{Colors.BOLD}{'    ████████  ████████  ██     ██  ████████  ':^78}{Colors.CYAN}║{Colors.END}")
    print(f"{Colors.CYAN}║{Colors.BLUE}{Colors.BOLD}{'    ██   ██   ██        ██     ██  ██    ██  ':^78}{Colors.CYAN}║{Colors.END}")
    print(f"{Colors.CYAN}║{Colors.GREEN}{Colors.BOLD}{'    ██    ██  ████████  ████████   ██    ██  ':^78}{Colors.CYAN}║{Colors.END}")
    print(f"{Colors.CYAN}║{' ' * 78}║{Colors.END}")
    print(f"{Colors.CYAN}║{Colors.YELLOW}{Colors.BOLD}{'The Ultimate Information Gathering Tool':^78}{Colors.CYAN}║{Colors.END}")
    print(f"{Colors.CYAN}║{' ' * 78}║{Colors.END}")
    print(f"{Colors.CYAN}║{Colors.GREEN}{'                 Version: '}{Colors.YELLOW}1.0    "
          f"{Colors.GREEN}Modules: {Colors.YELLOW}7    "
          f"{Colors.GREEN}Created by: {Colors.PURPLE}reigh{' ':14}{Colors.CYAN}║{Colors.END}")
    print(f"{Colors.CYAN}║{' ' * 78}║{Colors.END}")
    print(f"{Colors.CYAN}╚{'═' * 78}╝{Colors.END}")
    print()


def display_modules():
    print(f"{Colors.WHITE}{Colors.UNDERLINE}Network & Infrastructure{Colors.END}" + " "*20 + f"{Colors.WHITE}{Colors.UNDERLINE}Web Application Analysis{Colors.END}")
    print("─" * 80)
    
    modules = [
        ("1. WHOIS Lookup", "5. Subdomain Finder"),
        ("2. DNS Lookup", "6. Directory Brute Forcer"),
        ("3. IP Geolocation", "7. Technology Detector"),
        ("4. Port Scanner", ""),
    ]
    
    for left, right in modules:
        left_colored = f"{Colors.CYAN}{left}{Colors.END}"
        right_colored = f"{Colors.GREEN}{right}{Colors.END}" if right else ""
        print(f"{left_colored:<50} {right_colored}")
    
    print("─" * 80)
    print(f"{Colors.RED}0. Exit{Colors.END}")
    print()

def whois_lookup(domain):
    try:
        print(f"\n{Colors.BLUE}[WHOIS Lookup]{Colors.END}")
        print("─" * 40)
        info = whois.whois(domain)
        
        # Format and display key information
        if hasattr(info, 'domain_name'):
            print(f"{Colors.GREEN}Domain:{Colors.END} {info.domain_name}")
        if hasattr(info, 'registrar'):
            print(f"{Colors.GREEN}Registrar:{Colors.END} {info.registrar}")
        if hasattr(info, 'creation_date'):
            print(f"{Colors.GREEN}Created:{Colors.END} {info.creation_date}")
        if hasattr(info, 'expiration_date'):
            print(f"{Colors.GREEN}Expires:{Colors.END} {info.expiration_date}")
        if hasattr(info, 'name_servers'):
            print(f"{Colors.GREEN}Name Servers:{Colors.END} {', '.join(info.name_servers) if info.name_servers else 'N/A'}")
            
    except Exception as e:
        print(f"{Colors.RED}[-] Error: {e}{Colors.END}")

def dns_lookup(domain):
    try:
        print(f"\n{Colors.BLUE}[DNS Lookup]{Colors.END}")
        print("─" * 40)
        
        # A Records
        try:
            result = dns.resolver.resolve(domain, 'A')
            print(f"{Colors.GREEN}A Records:{Colors.END}")
            for ip in result:
                print(f"  → {ip}")
        except:
            print(f"{Colors.YELLOW}No A records found{Colors.END}")
        
        # CNAME Records
        try:
            result = dns.resolver.resolve(domain, 'CNAME')
            print(f"{Colors.GREEN}CNAME Records:{Colors.END}")
            for cname in result:
                print(f"  → {cname}")
        except:
            pass
            
        # MX Records
        try:
            result = dns.resolver.resolve(domain, 'MX')
            print(f"{Colors.GREEN}MX Records:{Colors.END}")
            for mx in result:
                print(f"  → {mx}")
        except:
            pass
            
    except Exception as e:
        print(f"{Colors.RED}[-] Error: {e}{Colors.END}")

def ip_geolocation(ip):
    try:
        print(f"\n{Colors.BLUE}[IP Geolocation]{Colors.END}")
        print("─" * 40)
        url = f"http://ip-api.com/json/{ip}"
        response = requests.get(url, timeout=10)
        data = response.json()
        
        if data["status"] == "success":
            print(f"{Colors.GREEN}IP Address:{Colors.END} {data.get('query', 'N/A')}")
            print(f"{Colors.GREEN}Country:{Colors.END} {data.get('country', 'N/A')}")
            print(f"{Colors.GREEN}Region:{Colors.END} {data.get('regionName', 'N/A')}")
            print(f"{Colors.GREEN}City:{Colors.END} {data.get('city', 'N/A')}")
            print(f"{Colors.GREEN}ISP:{Colors.END} {data.get('isp', 'N/A')}")
            print(f"{Colors.GREEN}Organization:{Colors.END} {data.get('org', 'N/A')}")
            print(f"{Colors.GREEN}Timezone:{Colors.END} {data.get('timezone', 'N/A')}")
        else:
            print(f"{Colors.RED}[-] Failed to locate IP{Colors.END}")
            
    except Exception as e:
        print(f"{Colors.RED}[-] Error: {e}{Colors.END}")

def port_scanner(ip):
    print(f"\n{Colors.BLUE}[Port Scanner]{Colors.END}")
    print("─" * 40)
    common_ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 5432, 8080, 8443]
    open_ports = []
    
    print(f"{Colors.YELLOW}Scanning {ip}...{Colors.END}")
    
    for port in common_ports:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(1)
            result = s.connect_ex((ip, port))
            
            if result == 0:
                service = get_service_name(port)
                print(f"{Colors.GREEN}[OPEN]{Colors.END} Port {port}/tcp - {service}")
                open_ports.append(port)
            s.close()
        except:
            pass
    
    if not open_ports:
        print(f"{Colors.YELLOW}No open ports found{Colors.END}")
    else:
        print(f"\n{Colors.GREEN}Found {len(open_ports)} open ports{Colors.END}")

def get_service_name(port):
    services = {
        21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
        80: "HTTP", 110: "POP3", 143: "IMAP", 443: "HTTPS", 993: "IMAPS",
        995: "POP3S", 3306: "MySQL", 5432: "PostgreSQL", 8080: "HTTP-Alt", 8443: "HTTPS-Alt"
    }
    return services.get(port, "Unknown")

def subdomain_finder(domain):
    print(f"\n{Colors.BLUE}[Subdomain Finder]{Colors.END}")
    print("─" * 40)
    
    wordlist = [
        "www", "mail", "ftp", "admin", "test", "dev", "staging", "api", 
        "app", "blog", "shop", "store", "news", "support", "help", "cdn",
        "assets", "static", "media", "images", "files", "docs", "portal"
    ]
    
    found_subdomains = []
    print(f"{Colors.YELLOW}Scanning subdomains for {domain}...{Colors.END}")
    
    for word in wordlist:
        subdomain = f"{word}.{domain}"
        try:
            ip = socket.gethostbyname(subdomain)
            print(f"{Colors.GREEN}[FOUND]{Colors.END} {subdomain} → {ip}")
            found_subdomains.append(subdomain)
        except:
            pass
    
    if not found_subdomains:
        print(f"{Colors.YELLOW}No subdomains found{Colors.END}")
    else:
        print(f"\n{Colors.GREEN}Found {len(found_subdomains)} subdomains{Colors.END}")

def dir_brute_force(url):
    print(f"\n{Colors.BLUE}[Directory Brute Forcer]{Colors.END}")
    print("─" * 40)
    
    if not url.startswith("http"):
        url = "http://" + url
    
    wordlist = [
        "admin", "login", "dashboard", "panel", "uploads", "images", "files",
        "backup", "config", "api", "test", "dev", "staging", "temp", "old",
        "new", "archive", "download", "public", "private", "secure", "data"
    ]
    
    found_dirs = []
    print(f"{Colors.YELLOW}Scanning directories for {url}...{Colors.END}")
    
    for word in wordlist:
        path = f"{url.rstrip('/')}/{word}"
        try:
            res = requests.get(path, timeout=5, allow_redirects=False)
            if res.status_code == 200:
                print(f"{Colors.GREEN}[FOUND]{Colors.END} {path} (200 OK)")
                found_dirs.append(path)
            elif res.status_code == 403:
                print(f"{Colors.YELLOW}[FORBIDDEN]{Colors.END} {path} (403 Forbidden)")
                found_dirs.append(path)
        except:
            pass
    
    if not found_dirs:
        print(f"{Colors.YELLOW}No accessible directories found{Colors.END}")
    else:
        print(f"\n{Colors.GREEN}Found {len(found_dirs)} directories{Colors.END}")

def tech_detector(url):
    print(f"\n{Colors.BLUE}[Technology Detector]{Colors.END}")
    print("─" * 40)
    
    if not url.startswith("http"):
        url = "http://" + url
    
    try:
        res = requests.get(url, timeout=10)
        headers = res.headers
        html = res.text.lower()
        
        print(f"{Colors.GREEN}Server Information:{Colors.END}")
        print(f"  Server: {headers.get('Server', 'Unknown')}")
        print(f"  X-Powered-By: {headers.get('X-Powered-By', 'Unknown')}")
        print(f"  Content-Type: {headers.get('Content-Type', 'Unknown')}")
        
        print(f"\n{Colors.GREEN}Technologies Detected:{Colors.END}")
        
        technologies = {
            "WordPress": ["wp-content", "wp-includes", "/wp-"],
            "jQuery": ["jquery", "jquery.min.js"],
            "Bootstrap": ["bootstrap", "bootstrap.min.css"],
            "React": ["react", "_react", "react-dom"],
            "Angular": ["angular", "ng-", "angular.min.js"],
            "Vue.js": ["vue", "vue.min.js", "__vue__"],
            "PHP": ["<?php", ".php", "x-powered-by: php"],
            "ASP.NET": ["aspnet", "__viewstate", "asp.net"],
            "Django": ["djangoproject", "django", "csrfmiddlewaretoken"],
            "Laravel": ["laravel", "laravel_session"],
        }
        
        found_tech = []
        for tech, indicators in technologies.items():
            if any(indicator in html or indicator in str(headers) for indicator in indicators):
                print(f"  {Colors.GREEN}✓{Colors.END} {tech}")
                found_tech.append(tech)
        
        if not found_tech:
            print(f"  {Colors.YELLOW}No specific technologies detected{Colors.END}")
            
    except Exception as e:
        print(f"{Colors.RED}[-] Error: {e}{Colors.END}")

def main():
    while True:
        banner()
        display_modules()
        
        try:
            choice = input(f"{Colors.YELLOW}ReDa{Colors.END}> ").strip()
            
            if choice == "1":
                domain = input(f"{Colors.CYAN}Enter domain: {Colors.END}")
                if domain:
                    whois_lookup(domain)
            
            elif choice == "2":
                domain = input(f"{Colors.CYAN}Enter domain: {Colors.END}")
                if domain:
                    dns_lookup(domain)
            
            elif choice == "3":
                ip = input(f"{Colors.CYAN}Enter IP address: {Colors.END}")
                if ip:
                    ip_geolocation(ip)
            
            elif choice == "4":
                ip = input(f"{Colors.CYAN}Enter IP address: {Colors.END}")
                if ip:
                    port_scanner(ip)
            
            elif choice == "5":
                domain = input(f"{Colors.CYAN}Enter domain: {Colors.END}")
                if domain:
                    subdomain_finder(domain)
            
            elif choice == "6":
                url = input(f"{Colors.CYAN}Enter target URL: {Colors.END}")
                if url:
                    dir_brute_force(url)
            
            elif choice == "7":
                url = input(f"{Colors.CYAN}Enter website URL: {Colors.END}")
                if url:
                    tech_detector(url)
            
            elif choice == "0":
                print(f"\n{Colors.GREEN}Exiting ReDa Toolkit. Stay safe! 👋{Colors.END}\n")
                break
            
            else:
                print(f"{Colors.RED}Invalid choice. Please try again.{Colors.END}")
            
            if choice != "0":
                input(f"\n{Colors.YELLOW}Press Enter to continue...{Colors.END}")
                
        except KeyboardInterrupt:
            print(f"\n\n{Colors.GREEN}Exiting ReDa Toolkit. Stay safe! 👋{Colors.END}\n")
            break
        except Exception as e:
            print(f"{Colors.RED}An error occurred: {e}{Colors.END}")
            input(f"\n{Colors.YELLOW}Press Enter to continue...{Colors.END}")

if __name__ == "__main__":
    main()