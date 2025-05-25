import whois

def whois_lookup(domain):
    try:
        w = whois.whois(domain)
        print(f"\n[+] WHOIS Info for {domain}")
        print(f"Domain Name: {w.domain_name}")
        print(f"Registrar: {w.registrar}")
        print(f"Creation Date: {w.creation_date}")
        print(f"Expiration Date: {w.expiration_date}")
        print(f"Name Servers: {w.name_servers}")
        print(f"Status: {w.status}")
    except Exception as e:
        print(f"[-] Error: {e}")

# Example usage
domain = input("Enter domain for WHOIS lookup: ")
whois_lookup(domain)
