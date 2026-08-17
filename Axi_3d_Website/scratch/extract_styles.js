import fs from 'fs';

const html = fs.readFileSync('scratch/page.html', 'utf8');

// Find style tags and extract colors, font families, elementor styles
const styleMatches = html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
let styles = '';
for (const s of styleMatches) {
  styles += s[1] + '\n';
}

fs.writeFileSync('scratch/extracted_styles.css', styles);

// Extract color codes and font families
const colors = new Set(styles.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/g));
const fontFamilies = new Set(styles.match(/font-family:[^;}]+/g));

console.log('Unique colors found:', Array.from(colors).slice(0, 30));
console.log('Font families found:', Array.from(fontFamilies));
