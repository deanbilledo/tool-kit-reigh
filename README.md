ReDa Toolkit

The Ultimate Information Gathering Tool
Version: 1.0 | Modules: 7 | Created by: reigh
📋 Description
ReDa is a comprehensive reconnaissance and information gathering toolkit designed for security professionals, penetration testers, and network administrators. It provides a user-friendly terminal interface for various network analysis and web application reconnaissance tasks.
✨ Features
Network & Infrastructure Analysis

WHOIS Lookup - Retrieve domain registration information
DNS Lookup - Comprehensive DNS record analysis (A, CNAME, MX records)
IP Geolocation - Geographic location and ISP information for IP addresses
Port Scanner - Scan for open ports and identify running services

Web Application Analysis

Subdomain Finder - Discover subdomains using wordlist enumeration
Directory Brute Forcer - Find hidden directories and files
Technology Detector - Identify web technologies, frameworks, and CMS platforms

🚀 Installation
Prerequisites
bashpip install whois dnspython requests
Clone and Run
bashgit clone https://github.com/yourusername/reda-toolkit.git
cd reda-toolkit
python reda.py
📖 Usage
Basic Usage
Simply run the script and follow the interactive menu:
bashpython reda.py
Module Examples
1. WHOIS Lookup
Enter domain: example.com
Retrieves registration details, registrar information, creation/expiration dates, and name servers.
2. DNS Lookup
Enter domain: example.com
Performs comprehensive DNS analysis including A, CNAME, and MX records.
3. IP Geolocation
Enter IP address: 8.8.8.8
Provides geographic location, ISP information, organization details, and timezone.
4. Port Scanner
Enter IP address: 192.168.1.1
Scans common ports (21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 5432, 8080, 8443) and identifies services.
5. Subdomain Finder
Enter domain: example.com
Discovers subdomains using a built-in wordlist including common patterns like www, mail, admin, api, etc.
6. Directory Brute Forcer
Enter target URL: http://example.com
Searches for hidden directories and files using common directory names.
7. Technology Detector
Enter website URL: http://example.com
Identifies web technologies including:

Server information
Content Management Systems (WordPress, Drupal)
JavaScript frameworks (React, Angular, Vue.js)
CSS frameworks (Bootstrap)
Backend technologies (PHP, ASP.NET, Django, Laravel)

🎨 Interface Features

Colorful Terminal Interface - Easy-to-read color-coded output
Professional ASCII Art - Stylized ReDa logo with gradient colors
Organized Module Layout - Clean categorization of tools
Status Indicators - Color-coded success/error/warning messages
User-Friendly Navigation - Simple menu-driven interface

🔧 Technical Details
Dependencies

whois - Domain registration information
dnspython - DNS resolution and queries
requests - HTTP requests for web analysis
socket - Network connectivity testing

Color Scheme

🟦 Cyan - Borders and structure
🟪 Purple - Logo top section and branding
🔵 Blue - Logo middle section and headers
🟢 Green - Logo bottom section and success messages
🟡 Yellow - Warnings and highlights
🔴 Red - Error messages

⚠️ Legal Disclaimer
IMPORTANT: This tool is intended for educational purposes and authorized security testing only. Users are responsible for ensuring they have proper authorization before scanning or testing any networks, domains, or systems they do not own.
Ethical Usage Guidelines:

Only use on systems you own or have explicit permission to test
Respect rate limits and avoid overwhelming target systems
Comply with local laws and regulations regarding network scanning
Use responsibly and ethically in accordance with your organization's policies

🔒 Security Considerations

All network requests include appropriate timeouts to prevent hanging
The tool uses read-only reconnaissance techniques
No intrusive or destructive actions are performed
Scanning is limited to common ports and standard wordlists

🛠️ Customization
Adding Custom Wordlists
You can expand the wordlists in the following functions:

subdomain_finder() - Add more subdomain patterns
dir_brute_force() - Include additional directory names
port_scanner() - Modify the port range

Extending Functionality
The modular design makes it easy to add new reconnaissance modules by following the existing function patterns.
📝 Version History
Version 1.0

Initial release with 7 core modules
Terminal-based interface with color support
Comprehensive error handling
Cross-platform compatibility

🤝 Contributing
Contributions are welcome! Please ensure any new features maintain the tool's ethical standards and include appropriate error handling.
📧 Contact
Created by: reigh

Remember: Always use this tool responsibly and in accordance with applicable laws and regulations. Happy reconnaissance! 🔍
