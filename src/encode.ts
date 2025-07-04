import QRCode from 'qrcode';

export interface QRCodeOptions {
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  version?: number;
}

export async function generateQRCode(
  data: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const { margin = 4, errorCorrectionLevel = 'M', version } = options;

  const qrOptions: QRCode.QRCodeToStringOptions = {
    margin,
    errorCorrectionLevel,
    type: 'svg',
  };

  if (version) {
    qrOptions.version = version;
  }

  try {
    const svg = await QRCode.toString(data, qrOptions);
    return svg;
  } catch (error) {
    throw new Error(
      `Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
