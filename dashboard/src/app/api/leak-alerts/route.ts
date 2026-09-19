import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const scriptPath = path.join(process.cwd(), '..', 'scripts', 'leak_detection.py');
    const { stdout } = await execAsync(`python "${scriptPath}"`);
    const data = JSON.parse(stdout);
    return NextResponse.json({ 
      alerts: data.alerts, 
      raw_activity: data.raw_activity 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to run leak detection' }, { status: 500 });
  }
}
