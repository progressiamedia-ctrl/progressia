const fs = require('fs');
const path = require('path');
const iconsDir = path.resolve(__dirname, '../public/icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const base64Image =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAKElEQVR4nO3OMQ0AAAgDoO1f6F+gBK6WhS0kAAwAAAAAAAIHLAf8HYCkAAABa0lEQVR4nO3QwQmAQAwEwY/0T6YUTIEBwqjF/6aoKCCCAAAIIIIDwW58gA0+f/Vi/vsf3VZR3Zf8QZJuK8cbaEvVv/AHDFdN3/l0QYjH2/gPhQAECBAgAABAgQIECAAAECBAgQILAv0Fym9hs5004EAAAAAElFTkSuQmCC';

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), Buffer.from(base64Image, 'base64'));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), Buffer.from(base64Image, 'base64'));
