import { describe, it, expect } from 'vitest';
import { generateQRCode } from './encode.js';

describe('QR Code Generation', () => {
  it('should generate SVG QR code containing <svg tag', async () => {
    const testData = 'https://example.com';
    const svg = await generateQRCode(testData, { margin: 4 });

    expect(svg).toBeTypeOf('string');
    expect(svg).toContain('<svg');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it('should handle different margin values', async () => {
    const testData = 'https://example.com';
    const svg1 = await generateQRCode(testData, { margin: 0 });
    const svg2 = await generateQRCode(testData, { margin: 10 });

    expect(svg1).toContain('<svg');
    expect(svg2).toContain('<svg');
    expect(svg1).not.toBe(svg2); // Different margins should produce different SVGs
  });

  it('should throw error for invalid data', async () => {
    await expect(generateQRCode('')).rejects.toThrow();
  });
});
