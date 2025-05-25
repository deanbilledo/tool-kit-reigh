import socket

def subdomain_finder(domain, wordlist):
    print(f"\n[+] Finding subdomains for {domain}")
    found = []
    for word in wordlist:
        subdomain = f"{word}.{domain}"
        try:
            ip = socket.gethostbyname(subdomain)
            print(f"[FOUND] {subdomain} -> {ip}")
            found.append((subdomain, ip))
        except socket.gaierror:
            pass  # Subdomain not found
    if not found:
        print("[-] No subdomains found.")
    return found

# Example usage
domain = input("Enter domain: ")
# You can use a file too, here’s a small sample list
wordlist = ["www", "mail", "ftp", "admin", "test", "webmail", "blog"]
subdomain_finder(domain, wordlist)
