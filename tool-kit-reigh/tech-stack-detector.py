import requests
import re

def tech_detector(url):
    print(f"\n[+] Detecting technologies on {url}")
    if not url.startswith("http"):
        url = "http://" + url
    try:
        response = requests.get(url)
        headers = response.headers
        content = response.text.lower()

        # 1. Check Server Header
        print("\n--- Headers ---")
        server = headers.get("Server", "Not found")
        x_powered_by = headers.get("X-Powered-By", "Not found")
        print(f"Server: {server}")
        print(f"X-Powered-By: {x_powered_by}")

        # 2. Check page content
        print("\n--- Page Clues ---")
        if "wp-content" in content or "wordpress" in content:
            print("✔️ WordPress detected")
        if "jquery" in content:
            print("✔️ jQuery detected")
        if "bootstrap" in content:
            print("✔️ Bootstrap detected")
        if "php" in content:
            print("✔️ PHP detected in code")
        if re.search(r"/wp-admin", content):
            print("✔️ WordPress Admin found")

    except Exception as e:
        print(f"[-] Error: {e}")

# Example usage
target_url = input("Enter URL to analyze: ")
tech_detector(target_url)
