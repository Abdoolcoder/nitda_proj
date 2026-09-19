import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { file, recipient, expiry } = data;
    
    let shares = readJsonFile('external-shares.json');
    if (!Array.isArray(shares)) shares = [];
    
    shares.push({ file, recipient, expiry });
    writeJsonFile('external-shares.json', shares);
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
