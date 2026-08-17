import fs from 'fs';

const html = fs.readFileSync('scratch/clean_elementor.html', 'utf8');

// Print all headers, section titles, images with context
const regex = /<(h[1-6]|div class="[^"]*elementor-heading-title[^"]*"|div class="[^"]*elementor-text-editor[^"]*"|img)[^>]*>([\s\S]*?)(<\/h[1-6]>|<\/div>|\/>|>)/gi;

let match;
let i = 1;
while ((match = regex.exec(html)) !== null) {
  const full = match[0];
  const tag = match[1];
  const inner = match[2] ? match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  if (full.includes('<img')) {
    const src = full.match(/src=["']([^"']+)["']/);
    console.log(`[${i++}] IMAGE: ${src ? src[1] : ''}`);
  } else if (inner) {
    console.log(`[${i++}] ${tag}: ${inner}`);
  }
}
