import fs from 'fs';

const html = fs.readFileSync('scratch/metro_clean_elementor.html', 'utf8');

const sections = html.split(/<section\s+/i);
let fullLog = '';

sections.forEach((sec, idx) => {
  if (idx === 0) return;
  fullLog += `\n========================================\n=== SECTION ${idx} ===\n========================================\n`;
  
  // Extract images
  const imgs = [];
  const imgMatches = sec.matchAll(/src=["']([^"']+)["']/g);
  for (const m of imgMatches) {
    if (m[1].includes('wp-content')) imgs.push(m[1]);
  }
  const bgMatches = sec.matchAll(/url\(["']?([^"')]*)["']?\)/g);
  for (const m of bgMatches) {
    if (m[1].includes('wp-content')) imgs.push('BG: ' + m[1]);
  }
  fullLog += `IMAGES:\n` + imgs.join('\n') + '\n\n';
  
  // Clean text and print
  const clean = sec
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n--- HEADING: $1 ---\n')
    .replace(/<div class="[^"]*elementor-heading-title[^"]*"[^>]*>(.*?)<\/div>/gi, '\n--- TITLE: $1 ---\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '\n* $1')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\n\s*\n/g, '\n')
    .trim();
  
  fullLog += `CONTENT:\n` + clean + '\n';
});

fs.writeFileSync('scratch/metro_full_details.txt', fullLog);
console.log('Saved to scratch/metro_full_details.txt, length:', fullLog.length);
