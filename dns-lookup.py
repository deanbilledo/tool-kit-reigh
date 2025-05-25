import dns.resolver

def dns_lookup(domain):
    try:
        print(f"\n[+] DNS Records for {domain}")
        for record_type in ["A", "AAAA", "MX", "NS", "TXT", "CNAME"]:
            try:
                answers = dns.resolver.resolve(domain, record_type)
                print(f"\n{record_type} Records:")
                for rdata in answers:
                    print(rdata.to_text())
            except:
                print(f"{record_type} record not found.")
    except Exception as e:
        print(f"[-] Error: {e}")

# Example usage
domain = input("Enter domain for DNS lookup: ")
dns_lookup(domain)
