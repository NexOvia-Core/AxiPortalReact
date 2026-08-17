import fs from 'fs';

const html = fs.readFileSync('scratch/metro_page.html', 'utf8');

const elemStart = html.indexOf('data-elementor-type');
let content = '';
if (elemStart !== -1) {
  const startTagPos = html.lastIndexOf('<div', elemStart);
  content = html.substring(startTagPos);
  const footerPos = content.indexOf('<footer');
  if (footerPos !== -1) {
    content = content.substring(0, footerPos);
  }
}

const cleanHtml = content
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<script[\s\S]*?<\/script>/gi, '');

fs.writeFileSync('scratch/metro_clean_elementor.html', cleanHtml);
console.log('Saved metro_clean_elementor.html, length:', cleanHtml.length);
