import { NextResponse } from 'next/server';

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return NextResponse.json({
    cloudName:  cloudName  ? `${cloudName.slice(0, 4)}…` : 'MISSING',
    apiKey:     apiKey     ? `${apiKey.slice(0, 6)}…`    : 'MISSING',
    apiSecret:  apiSecret  ? `${apiSecret.slice(0, 4)}…` : 'MISSING',
    allSet: !!(cloudName && apiKey && apiSecret),
  });
}
