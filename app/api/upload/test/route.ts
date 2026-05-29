import { NextResponse } from 'next/server';

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const envStatus = {
    cloudName: cloudName ? `${cloudName.slice(0, 4)}…` : 'MISSING',
    apiKey:    apiKey    ? `${apiKey.slice(0, 6)}…`    : 'MISSING',
    apiSecret: apiSecret ? `${apiSecret.slice(0, 4)}…` : 'MISSING',
    allSet:    !!(cloudName && apiKey && apiSecret),
  };

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ ...envStatus, cloudinaryPing: 'SKIPPED — env vars missing' });
  }

  // Ping Cloudinary to verify credentials are actually valid
  try {
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const pingRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/ping`,
      { headers: { Authorization: `Basic ${credentials}` } }
    );
    const pingBody = await pingRes.json().catch(() => ({}));

    return NextResponse.json({
      ...envStatus,
      cloudinaryPing:   pingRes.ok ? 'OK ✓' : `FAILED (${pingRes.status})`,
      cloudinaryDetail: pingRes.ok ? undefined : pingBody,
    });
  } catch (err) {
    return NextResponse.json({
      ...envStatus,
      cloudinaryPing: `ERROR — ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}
