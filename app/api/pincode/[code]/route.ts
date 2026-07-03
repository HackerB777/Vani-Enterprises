import { NextRequest, NextResponse } from 'next/server';

interface PostOffice {
  District: string;
  State: string;
}

interface PincodeApiResponse {
  Status: string;
  PostOffice: PostOffice[] | null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
    if (!res.ok) throw new Error('Upstream error');

    const data = (await res.json()) as PincodeApiResponse[];
    const office = data[0]?.PostOffice?.[0];
    if (!office) return NextResponse.json({ error: 'Pincode not found' }, { status: 404 });

    return NextResponse.json({ city: office.District, state: office.State });
  } catch (err) {
    console.error('GET /api/pincode/[code]:', err);
    return NextResponse.json({ error: 'Lookup failed' }, { status: 502 });
  }
}
