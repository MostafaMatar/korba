#!/usr/bin/env node
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const sizes = [
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
  { size: 192, name: 'android-chrome-maskable-192x192.png' },
  { size: 512, name: 'android-chrome-maskable-512x512.png' }
];

const inputSvg = resolve(projectRoot, 'public/img/icons/icon.svg');
const outputDir = resolve(projectRoot, 'public/img/icons');

async function generateIcons() {
  try {
    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Generate icons for each size
    for (const { size, name } of sizes) {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(join(outputDir, name));
      
      console.log(`Generated ${name}`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
