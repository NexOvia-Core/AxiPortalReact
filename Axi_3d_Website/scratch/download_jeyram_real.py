import urllib.request
import os

url = "https://agile-labs.com/wp-content/uploads/2023/01/Ja-1.jpg"
dest = r"c:\Users\Anish\Downloads\axi-platform\client\public\team\jeyram.png"

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp, open(dest, 'wb') as f:
    f.write(resp.read())

print("Downloaded Ja-1.jpg successfully, size:", os.path.getsize(dest))
