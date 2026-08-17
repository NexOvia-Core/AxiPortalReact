import fs from 'fs';

const html = fs.readFileSync('scratch/clean_elementor.html', 'utf8');

// Parse elementor top-level sections
const sectionMatches = html.matchAll(/<section[^>]*class="([^"]*)"[^>]*data-id="([^"]*)"[\s\S]*?>([\s\S]*?)(?=<\/section>|$)/gi);

let secIndex = 1;
for (const s of sectionMatches) {
  const classes = s[1];
  const id = s[2];
  const body = s[3];
  
  // Extract background style or settings
  const bgMatch = body.match(/background-color:\s*([^;"]+)|background:\s*([^;"]+)/i);
  const imgs = Array.from(body.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)).map(m => m[1]);
  
  console.log(`\n================ SECTION ${secIndex++} (ID: ${id}) ================`);
  console.log('Classes:', classes);
  if (bgMatch) console.log('Background:', bgMatch[0]);
  if (imgs.length) console.log('Images:', imgs);
  
  // Look for columns inside section
  const cols = Array.from(body.matchAll(/<div[^>]*class="[^"]*elementor-column[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*elementor-column[^"]*"|$)/gi));
  console.log(`Columns count: ${cols.length}`);
  
  cols.forEach((col, cIdx) => {
    const colText = col[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (colText.length > 0) {
      console.log(`  [Col ${cIdx+1}]: ${colText.substring(0, 150)}...`);
    }
  });
}
