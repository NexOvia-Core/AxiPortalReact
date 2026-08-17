import urllib.request
import os

team_images = {
    "sabarish.png": "https://agile-labs.com/wp-content/uploads/2023/01/Sa-1.jpg",
    "jayavanth.png": "https://agile-labs.com/wp-content/uploads/2023/09/jayavanth-sir_1.png",
    "chandrashekar.png": "https://agile-labs.com/wp-content/uploads/2023/01/chandra-sekar.jpg",
    "vishwanatha.png": "https://agile-labs.com/wp-content/uploads/2023/01/vi2.jpg",
    "bijaya.png": "https://agile-labs.com/wp-content/uploads/2023/08/BH.jpg",
    "vaidhees.png": "https://agile-labs.com/wp-content/uploads/2023/01/Vai-1.jpg",
    "unni.png": "https://agile-labs.com/wp-content/uploads/2023/12/Unni-Sir.jpg",
    "dhurga.png": "https://agile-labs.com/wp-content/uploads/2023/01/Du.jpg",
    "jeyram.png": "https://agile-labs.com/wp-content/uploads/2023/01/Ja-1.jpg",
    "senthil.png": "https://agile-labs.com/wp-content/uploads/2023/01/Se.jpg",
    "pandi.png": "https://agile-labs.com/wp-content/uploads/2023/01/Pan-1.jpg"
}

out_dir = r"c:\Users\Anish\Downloads\axi-platform\client\public\team"
os.makedirs(out_dir, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for fname, url in team_images.items():
    dest = os.path.join(out_dir, fname)
    print(f"Downloading {fname} from {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(dest, 'wb') as f:
            f.write(resp.read())
        print(f"Saved {dest} ({os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"Error downloading {fname}: {e}")
