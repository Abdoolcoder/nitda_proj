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

    // Log the event securely
    try {
      const timestamp = new Date().toISOString();
      const fs = require('fs');

      if (action === 'download') {
        // High Severity Alert
        const alert = {
          user,
          timestamp,
          rule_triggered: 'DATA_EXFILTRATION_ATTEMPT',
          evidence: `User ${user} downloaded raw file: ${filename} to their local machine.`
        };
        const alertsPath = path.join(process.cwd(), '..', 'infra', 'nextjs-alerts.json');
        let existingAlerts = [];
        if (fs.existsSync(alertsPath)) existingAlerts = JSON.parse(fs.readFileSync(alertsPath, 'utf8'));
        existingAlerts.unshift(alert);
        fs.writeFileSync(alertsPath, JSON.stringify(existingAlerts, null, 2));
      } else {
        // Standard Activity Log (View / Edit)
        const activity = {
          user,
          type: 'file_viewed',
          subject: `Opened file in Secure Inline Editor: ${filename}`,
          datetime: timestamp
        };
        const activityPath = path.join(process.cwd(), '..', 'infra', 'nextjs-activity.json');
        let existingActivity = [];
        if (fs.existsSync(activityPath)) existingActivity = JSON.parse(fs.readFileSync(activityPath, 'utf8'));
        existingActivity.unshift(activity);
        fs.writeFileSync(activityPath, JSON.stringify(existingActivity, null, 2));
      }
    } catch (e) {
      console.error("Failed to log event:", e);
    }

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
    if (error.code === 'EISDIR' || error.message.includes('EISDIR') || error.message.includes('directory')) {
       return NextResponse.json({ error: 'This is a folder/directory, not a file. It cannot be opened in the text editor.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to retrieve file from backend' }, { status: 500 });
  }
}
