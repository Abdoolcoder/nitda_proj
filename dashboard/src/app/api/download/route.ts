import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get('user');
  const filename = searchParams.get('file');
  const action = searchParams.get('action') || 'download'; // 'download' or 'view'

  if (!user || !filename) {
    return NextResponse.json({ error: 'User and filename required' }, { status: 400 });
  }

  try {
    const tempFilePath = path.join(os.tmpdir(), `${user}_${filename}`);
    const sourcePath = `/var/www/html/data/${user}/files/${filename}`;

    // Copy file from docker to temp
    await execAsync(`docker compose cp app:"${sourcePath}" "${tempFilePath}"`, { cwd: '../infra' });

    // Read the file
    const fileBuffer = await readFile(tempFilePath);
    
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const types: Record<string, string> = {
      'txt': 'text/plain',
      'pdf': 'application/pdf',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'md': 'text/markdown',
      'csv': 'text/csv',
      'json': 'application/json'
    };
    const contentType = types[ext] || 'application/octet-stream';
    const disposition = action === 'view' ? 'inline' : `attachment; filename="${filename}"`;

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': disposition,
      },
    });
  } catch (error: any) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: 'Failed to retrieve file from backend' }, { status: 500 });
  }
}
