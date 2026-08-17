import urllib.request
import re
import os

url = 'https://agile-labs.com/the-team/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    # Find all image URLs and Elementor background image URLs
    img_urls = re.findall(r'(https?://agile-labs\.com/wp-content/uploads/[^\s\"\'\)\>]+)', html)
    print("Found image URLs count:", len(img_urls))
    unique_urls = list(set(img_urls))
    for u in sorted(unique_urls):
        print(u)
except Exception as e:
    print("Error fetching page:", e)
