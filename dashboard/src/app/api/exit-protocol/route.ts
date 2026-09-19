import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { user } = await request.json();
    const scriptPath = path.join(process.cwd(), '..', 'scripts', 'exit_protocol.py');
    const { stdout } = await execAsync(`python "${scriptPath}" --user "${user}"`);
    const report = JSON.parse(stdout);
    return NextResponse.json({ report });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to run exit protocol' }, { status: 500 });
  }
}
