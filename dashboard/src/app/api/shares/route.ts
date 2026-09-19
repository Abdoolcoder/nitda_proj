import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const scriptPath = path.join(process.cwd(), '..', 'scripts', 'get_shares.py');
    const { stdout } = await execAsync(`python "${scriptPath}"`);
    const shares = JSON.parse(stdout);
    return NextResponse.json({ shares });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ shares: [] });
  }
}
