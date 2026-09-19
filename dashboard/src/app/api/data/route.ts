import { NextResponse } from 'next/server';
import { readJsonFile } from '@/lib/data';

export async function GET() {
  const activities = readJsonFile('activity-log.json');
  const alerts = readJsonFile('leak-alert.json');
  const shares = readJsonFile('external-shares.json');
  
  return NextResponse.json({ activities, alerts, shares });
}
