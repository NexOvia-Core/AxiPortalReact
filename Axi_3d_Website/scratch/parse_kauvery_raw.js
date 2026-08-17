import fs from 'fs';

const html = fs.readFileSync('scratch/kauvery_page.html', 'utf8');

// Find all image tags and background images
const imgs = Array.from(html.matchAll(/src=["']([^"']+)["']/gi)).map(m => m[1]);
console.log('All image srcs found:', imgs);

const bgs = Array.from(html.matchAll(/url\(["']?([^"')]*)["']?\)/gi)).map(m => m[1]);
console.log('All background url srcs found:', bgs);

// Find article or post or elementor section body
const bodyMatch = html.match(/<main[\s\S]*?<\/main>/i) || html.match(/<article[\s\S]*?<\/article>/i) || html.match(/<body[\s\S]*?<\/body>/i);
if (bodyMatch) {
  const cleanText = bodyMatch[0]
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/\n\s*\n/g, '\n')
    .trim();
  fs.writeFileSync('scratch/kauvery_raw_text.txt', cleanText);
  console.log('Saved kauvery_raw_text.txt, length:', cleanText.length);
}
