import fs from 'fs';

const html = fs.readFileSync('scratch/clean_elementor.html', 'utf8');

// Find all elementor sections
const sections = html.split(/<section\s+/i);
console.log(`Found ${sections.length} sections`);

sections.forEach((sec, idx) => {
  if (idx === 0) return;
  console.log(`\n=== SECTION ${idx} ===`);
  // Extract text and image urls from this section
  const imgs = [];
  const imgMatches = sec.matchAll(/src=["']([^"']+)["']/g);
  for (const m of imgMatches) {
    if (m[1].includes('wp-content')) imgs.push(m[1]);
  }
  const bgMatches = sec.matchAll(/url\(["']?([^"')]*)["']?\)/g);
  for (const m of bgMatches) {
    if (m[1].includes('wp-content')) imgs.push('BG: ' + m[1]);
  }
  console.log('Images:', imgs);
  
  // Extract raw text with headings
  const text = sec
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n--- HEADING: $1 ---\n')
    .replace(/<div class="[^"]*elementor-heading-title[^"]*"[^>]*>(.*?)<\/div>/gi, '\n--- TITLE: $1 ---\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '\n* $1')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();
  
  console.log('Content:\n', text.substring(0, 1000));
});
