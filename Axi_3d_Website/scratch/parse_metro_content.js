import fs from 'fs';

const html = fs.readFileSync('scratch/metro_clean_elementor.html', 'utf8');

// Match all elementor-widget-container contents
const widgets = html.matchAll(/<div class="[^"]*elementor-widget-container[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);

let log = '';
let i = 1;
for (const w of widgets) {
  const content = w[1];
  // extract images
  const imgs = Array.from(content.matchAll(/src=["']([^"']+)["']/gi)).map(m => m[1]);
  const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (imgs.length || text) {
    log += `\n[WIDGET ${i++}]\n`;
    if (imgs.length) log += `IMAGES: ${imgs.join(', ')}\n`;
    if (text) log += `TEXT: ${text}\n`;
  }
}

fs.writeFileSync('scratch/metro_widgets.txt', log);
console.log('Saved metro_widgets.txt, length:', log.length);
