import fs from 'fs';

const html = fs.readFileSync('scratch/clean_elementor.html', 'utf8');

// Match elementor sections or containers
const containerRegex = /<div class="[^"]*elementor-element[^"]*elementor-container[^"]*"[\s\S]*?(?=<div class="[^"]*elementor-element[^"]*elementor-container[^"]*"|$)/gi;

// Or match elementor-widget-wrap / elementor-widget
const widgetRegex = /<div class="[^"]*elementor-widget-container[^"]*"[\s\S]*?<\/div>/gi;

// Let's dump all text blocks and images in order:
let pos = 0;
const results = [];

// Let's search for all img tags, h1, h2, h3, h4, h5, h6, p, ul, blockquote, div with text
const blockRegex = /<(h[1-6]|p|ul|ol|blockquote|img)[^>]*>([\s\S]*?)(<\/h[1-6]>|<\/p>|<\/ul>|<\/ol>|<\/blockquote>|\/>|>)/gi;

let match;
while ((match = blockRegex.exec(html)) !== null) {
  const tag = match[1].toLowerCase();
  const full = match[0];
  const inner = match[2] ? match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  
  if (tag === 'img') {
    const srcMatch = full.match(/src=["']([^"']+)["']/);
    results.push(`[IMAGE] ${srcMatch ? srcMatch[1] : ''}`);
  } else if (inner.length > 0) {
    results.push(`[${tag.toUpperCase()}] ${inner}`);
  }
}

fs.writeFileSync('scratch/structured_content.txt', results.join('\n\n'));
console.log('Structured content written, total elements:', results.length);
