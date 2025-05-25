import requests

def ip_geolocation(ip):
    try:
        url = f"http://ip-api.com/json/{ip}"
        response = requests.get(url)
        data = response.json()

        if data["status"] == "success":
            print(f"\n[+] IP Geolocation for {ip}")
            print(f"Country: {data['country']}")
            print(f"Region: {data['regionName']}")
            print(f"City: {data['city']}")
            print(f"ISP: {data['isp']}")
            print(f"Org: {data['org']}")
            print(f"Latitude: {data['lat']}")
            print(f"Longitude: {data['lon']}")
        else:
            print("[-] Failed to get location.")
    except Exception as e:
        print(f"[-] Error: {e}")

# Example usage
ip = input("Enter IP for Geolocation: ")
ip_geolocation(ip)
