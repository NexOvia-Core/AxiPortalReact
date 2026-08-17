import fs from 'fs';

const html = fs.readFileSync('scratch/kauvery_page.html', 'utf8');

let log = '';

log += '=== TITLE ===\n';
const titleMatch = html.match(/<title>(.*?)<\/title>/i);
if (titleMatch) log += titleMatch[1] + '\n';

log += '\n=== IMAGES IN HTML ===\n';
const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
for (const m of imgMatches) {
  log += m[0] + '\n';
}

log += '\n=== BACKGROUND IMAGES ===\n';
const bgMatches = html.matchAll(/url\(["']?([^"')]*)["']?\)/gi);
for (const m of bgMatches) {
  if (m[1].includes('wp-content')) {
    log += m[1] + '\n';
  }
}

log += '\n=== WIDGET TEXT & HEADINGS ===\n';
const widgets = html.matchAll(/<div class="[^"]*elementor-widget-container[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
let i = 1;
for (const w of widgets) {
  const content = w[1];
  const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length > 0 && !text.startsWith('.elementor')) {
    log += `[WIDGET ${i++}] ${text}\n`;
  }
}

fs.writeFileSync('scratch/kauvery_details.txt', log);
console.log('Saved kauvery_details.txt, length:', log.length);
