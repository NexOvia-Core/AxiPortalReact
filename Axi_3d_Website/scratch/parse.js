import fs from 'fs';

const html = fs.readFileSync('scratch/page.html', 'utf8');

let out = '';

out += '=== TITLE ===\n';
const titleMatch = html.match(/<title>(.*?)<\/title>/i);
if (titleMatch) out += titleMatch[1] + '\n';

out += '\n=== IMAGES IN HTML ===\n';
const imgRegex = /<img[^>]+>/gi;
let match;
while ((match = imgRegex.exec(html)) !== null) {
  out += match[0] + '\n';
}

out += '\n=== BACKGROUND IMAGES ===\n';
const bgRegex = /url\(["']?([^"')]*)["']?\)/gi;
while ((match = bgRegex.exec(html)) !== null) {
  if (match[1].includes('wp-content')) {
    out += match[1] + '\n';
  }
}

out += '\n=== MAIN / ARTICLE TAG CONTENT ===\n';
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
if (mainMatch) {
  out += mainMatch[1];
}

fs.writeFileSync('scratch/output.txt', out);
console.log('Saved to scratch/output.txt, length:', out.length);
