import socket

def port_scanner(target_ip, ports):
    print(f"\n[+] Scanning ports on {target_ip}")
    for port in ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)  # Timeout in 1 second
            result = sock.connect_ex((target_ip, port))
            if result == 0:
                print(f"[OPEN] Port {port}")
            else:
                print(f"[CLOSED] Port {port}")
            sock.close()
        except Exception as e:
            print(f"[-] Error on port {port}: {e}")

# Example usage
target_ip = input("Enter target IP: ")
# Common ports list, you can add more if you like
common_ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 8080]
port_scanner(target_ip, common_ports)
