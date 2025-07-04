import { describe, it, expect } from 'vitest';
import { generateQRCode } from '../src/encode.js';

describe('generateQRCode', () => {
  it('should encode "Hello" and return string containing <svg', async () => {
    const result = await generateQRCode('Hello');
    expect(result).toContain('<svg');
  });
});
