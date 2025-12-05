#!/usr/bin/env node
/**
 * Trim transparent padding from image and create favicons with minimal margins
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_IMAGE = join(__dirname, '../packages/ui/src/assets/my-face-transparent.png');
const SHELL_OUTPUT = join(__dirname, '../apps/_shell/public');
const BLOG_OUTPUT = join(__dirname, '../apps/blog/public');

async function trimAndCreateFavicons() {
  console.log('🔧 Processing favicon...\n');

  // Read original image
  const image = sharp(INPUT_IMAGE);
  const metadata = await image.metadata();
  console.log(`📸 Original: ${metadata.width}x${metadata.height}`);

  // Trim transparent pixels and add minimal padding
  const trimmed = await image
    .trim({ threshold: 10 }) // Remove transparent edges
    .toBuffer();

  // Get trimmed dimensions
  const trimmedImage = sharp(trimmed);
  const trimmedMeta = await trimmedImage.metadata();
  console.log(`✂️  Trimmed: ${trimmedMeta.width}x${trimmedMeta.height}`);

  // Add minimal padding (2% of size)
  const padding = Math.round(Math.max(trimmedMeta.width, trimmedMeta.height) * 0.02);
  const maxSize = Math.max(trimmedMeta.width, trimmedMeta.height) + padding * 2;

  // Create square canvas with padding
  const paddedImage = await sharp(trimmed)
    .resize(maxSize - padding * 2, maxSize - padding * 2, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  console.log(`📦 Padded: ${maxSize}x${maxSize}\n`);

  // Create all favicon sizes
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ];

  console.log('📐 Creating favicon sizes...');
  for (const { name, size } of sizes) {
    const resized = await sharp(paddedImage)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    // Save to both shell and blog
    await sharp(resized).toFile(join(SHELL_OUTPUT, name));
    await sharp(resized).toFile(join(BLOG_OUTPUT, name));
    console.log(`  ✅ ${name} (${size}x${size})`);
  }

  // Create favicon.ico from 32x32
  const favicon32 = await sharp(paddedImage)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFormat('png')
    .toBuffer();

  await sharp(favicon32).toFile(join(SHELL_OUTPUT, 'favicon.ico'));
  await sharp(favicon32).toFile(join(BLOG_OUTPUT, 'favicon.ico'));
  console.log(`  ✅ favicon.ico`);

  console.log('\n✅ All favicons created successfully!');
}

trimAndCreateFavicons().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
