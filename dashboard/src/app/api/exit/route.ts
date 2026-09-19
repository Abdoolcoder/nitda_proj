import { NextResponse } from 'next/server';
import { readJsonFile } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { user } = await request.json();
    
    // In a real app, this would execute exit protocol logic via CLI or API.
    // For the hackathon prototype, we load the pre-generated exit-report.json.
    const report = readJsonFile('exit-report.json');
    
    return NextResponse.json({ status: 'success', report });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
