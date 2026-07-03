export interface PincodeResult {
  city: string;
  state: string;
}

export async function lookupPincode(pincode: string): Promise<PincodeResult | null> {
  if (!/^\d{6}$/.test(pincode)) return null;
  try {
    const res = await fetch(`/api/pincode/${pincode}`);
    if (!res.ok) return null;
    return (await res.json()) as PincodeResult;
  } catch {
    return null;
  }
}
