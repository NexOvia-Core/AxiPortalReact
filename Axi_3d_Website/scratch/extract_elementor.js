import fs from 'fs';

const html = fs.readFileSync('scratch/page.html', 'utf8');

// Elementor post container is usually <div data-elementor-type="single" ...> or <div class="elementor elementor-...">
const elemStart = html.indexOf('data-elementor-type');
let content = '';
if (elemStart !== -1) {
  // find container start tag
  const startTagPos = html.lastIndexOf('<div', elemStart);
  content = html.substring(startTagPos);
  // find footer start tag or footer container to truncate
  const footerPos = content.indexOf('<footer');
  if (footerPos !== -1) {
    content = content.substring(0, footerPos);
  }
}

fs.writeFileSync('scratch/elementor_html.html', content);
console.log('Saved elementor HTML, length:', content.length);
