import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user') || 'dr_amara';
    
    // Dynamically list the actual files inside the user's Nextcloud vault using Docker
    const { stdout } = await execAsync(`docker compose exec app ls -1 /var/www/html/data/${user}/files/`, { cwd: '../infra' });
    
    // Split output into array, filter out empty lines, and ignore Nextcloud's hidden appdata folders if any
    const files = stdout.split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0 && !f.startsWith('.'));
        
    return NextResponse.json({ files });
  } catch (error) {
    // If the directory doesn't exist yet, it means 0 files are uploaded
    return NextResponse.json({ files: [] });
  }
}
