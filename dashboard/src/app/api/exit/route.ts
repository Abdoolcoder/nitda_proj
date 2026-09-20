import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { user } = await request.json();
    
    // Execute the Python script which physically removes the user from the Nextcloud group via OCC
    const { stdout, stderr } = await execAsync(`python scripts/exit_protocol.py --user ${user}`, { cwd: '../' });
    
    try {
      const report = JSON.parse(stdout);
      return NextResponse.json({ status: 'success', report });
    } catch (e) {
      console.error("Failed to parse JSON from script:", stdout);
      return NextResponse.json({ status: 'error', message: "Invalid script output" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Exit protocol failed:", error.message);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
