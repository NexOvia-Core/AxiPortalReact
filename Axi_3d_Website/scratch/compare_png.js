import fs from 'fs';
import zlib from 'zlib';

function getPixels(filePath) {
  const buffer = fs.readFileSync(filePath);
  let offset = 8;
  const idatChunks = [];
  let width = 0, height = 0, colorType = 0;

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buffer.readUInt32BE(offset + 8);
      height = buffer.readUInt32BE(offset + 12);
      colorType = buffer[offset + 17];
    } else if (type === 'IDAT') {
      idatChunks.push(buffer.subarray(offset + 8, offset + 8 + length));
    }
    offset += 12 + length;
  }

  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  return { width, height, colorType, decompressed };
}

const pr0 = getPixels('image-Photoroom.png');
const pr1 = getPixels('image-Photoroom (1).png');
const cr = getPixels('AXI_Create.png');
const gl = getPixels('AXi_Goes Live.png');

function compareToOriginal(prPixels, origPixels) {
  const { width, height, decompressed: prData } = prPixels;
  const { decompressed: origData } = origPixels;
  const prStride = width * 4 + 1;
  const origStride = width * 3 + 1;
  let diff = 0;
  let count = 0;

  for (let y = 100; y < height - 100; y += 5) {
    for (let x = 100; x < width - 100; x += 5) {
      const prIdx = y * prStride + 1 + x * 4;
      const origIdx = y * origStride + 1 + x * 3;
      const a = prData[prIdx + 3];
      if (a > 200) { // Solid pixel in Photoroom image
        const rDiff = Math.abs(prData[prIdx] - origData[origIdx]);
        const gDiff = Math.abs(prData[prIdx + 1] - origData[origIdx + 1]);
        const bDiff = Math.abs(prData[prIdx + 2] - origData[origIdx + 2]);
        diff += rDiff + gDiff + bDiff;
        count++;
      }
    }
  }
  return count > 0 ? diff / count : 999999;
}

console.log('image-Photoroom vs AXI_Create:', compareToOriginal(pr0, cr));
console.log('image-Photoroom vs AXi_Goes Live:', compareToOriginal(pr0, gl));
console.log('image-Photoroom (1) vs AXI_Create:', compareToOriginal(pr1, cr));
console.log('image-Photoroom (1) vs AXi_Goes Live:', compareToOriginal(pr1, gl));
