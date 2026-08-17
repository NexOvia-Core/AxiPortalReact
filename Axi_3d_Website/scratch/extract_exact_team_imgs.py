import urllib.request
from bs4 import BeautifulSoup
import re

url = 'https://agile-labs.com/the-team/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    soup = BeautifulSoup(html, 'html.parser')
    for img in soup.find_all('img'):
        src = img.get('src') or img.get('data-src') or ''
        alt = img.get('alt') or ''
        print(f"ALT: {alt} | SRC: {src}")
    
    # Also find background-images
    for div in soup.find_all(attrs={"style": re.compile(r'background-image')}):
        style = div.get('style', '')
        print("BG STYLE:", style)
except Exception as e:
    print("Error:", e)
