import urllib.request
from bs4 import BeautifulSoup
import re

url = 'https://agile-labs.com/the-team/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
    soup = BeautifulSoup(html, 'html.parser')
    for elem in soup.find_all(True):
        text = elem.get_text()
        if 'Jeyram' in text or 'JEYRAM' in text:
            # Check img tags inside or near
            parent = elem.parent
            imgs = parent.find_all('img') if parent else []
            for img in imgs:
                print("FOUND IMG FOR JEYRAM:", img.get('src') or img.get('data-src'))
            
            # Check style attrs
            styles = parent.find_all(attrs={"style": re.compile(r'background-image')}) if parent else []
            for s in styles:
                print("FOUND BG FOR JEYRAM:", s.get('style'))
except Exception as e:
    print("Error:", e)
