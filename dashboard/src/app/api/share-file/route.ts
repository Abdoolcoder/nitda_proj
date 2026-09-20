import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { user, filename } = await request.json();

    if (!user || !filename) {
      return NextResponse.json({ error: 'User and filename required' }, { status: 400 });
    }

    // Run occ command to create a public link
    const cmd = `docker compose exec -T --user www-data app php occ share:create ${user} "/${filename}" --public`;
    const { stdout } = await execAsync(cmd, { cwd: '../infra' });

    // occ outputs something like "Public link share created: https://localhost:8080/s/xyz123"
    // We want to extract just the URL
    const match = stdout.match(/https?:\/\/[^\s]+/);
    const url = match ? match[0] : 'Link created, check Nextcloud';

    return NextResponse.json({ success: true, url, message: 'Share link generated!' });
  } catch (error: any) {
    console.error("Share Error:", error);
    return NextResponse.json({ error: 'Failed to generate share link' }, { status: 500 });
  }
}
