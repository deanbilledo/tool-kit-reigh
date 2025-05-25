import requests

def dir_brute_force(url, wordlist):
    print(f"\n[+] Brute-forcing directories on {url}")
    if not url.startswith("http"):
        url = "http://" + url
    found = []
    for word in wordlist:
        full_url = f"{url.rstrip('/')}/{word}"
        try:
            response = requests.get(full_url)
            if response.status_code == 200:
                print(f"[FOUND] {full_url}")
                found.append(full_url)
            elif response.status_code == 403:
                print(f"[FORBIDDEN] {full_url}")
        except requests.RequestException:
            pass
    if not found:
        print("[-] No directories found.")
    return found

# Example usage
target_url = input("Enter target domain (without path): ")
wordlist = ["admin", "login", "dashboard", "uploads", "images", "backup"]
dir_brute_force(target_url, wordlist)
