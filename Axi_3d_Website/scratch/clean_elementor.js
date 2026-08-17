import fs from 'fs';

const html = fs.readFileSync('scratch/elementor_html.html', 'utf8');

// Parse sections/containers and headings, paragraphs, images
const sections = [];

// Clean up scripts/styles for easier text inspection
const cleanHtml = html
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<script[\s\S]*?<\/script>/gi, '');

fs.writeFileSync('scratch/clean_elementor.html', cleanHtml);
console.log('Clean elementor HTML written, length:', cleanHtml.length);
