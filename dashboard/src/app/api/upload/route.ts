import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const user = formData.get('user') as string;

    if (!file || !user) {
      return NextResponse.json({ error: 'File and user are required' }, { status: 400 });
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to temp directory
    const tempFilePath = path.join(os.tmpdir(), file.name);
    await writeFile(tempFilePath, buffer);

    // 1. Copy the file into the Nextcloud container directly to the user's files folder
    const targetPath = `/var/www/html/data/${user}/files/${file.name}`;
    await execAsync(`docker compose cp "${tempFilePath}" app:"${targetPath}"`, { cwd: '../infra' });

    // 2. Fix permissions so www-data owns the file
    await execAsync(`docker compose exec -T app chown www-data:www-data "${targetPath}"`, { cwd: '../infra' });

    // 3. Force Nextcloud to scan the new file into its database
    await execAsync(`docker compose exec -T --user www-data app php occ files:scan --path="${user}/files"`, { cwd: '../infra' });

    // 4. Log the activity manually since occ files:scan doesn't trigger Nextcloud WebDAV events
    try {
      const activity = {
        user,
        type: 'file_created_or_updated',
        subject: `Uploaded/Edited file: ${file.name}`,
        datetime: new Date().toISOString()
      };
      const fs = require('fs');
      const alertsPath = path.join(process.cwd(), '..', 'infra', 'nextjs-activity.json');
      let existingActivity = [];
      if (fs.existsSync(alertsPath)) {
        existingActivity = JSON.parse(fs.readFileSync(alertsPath, 'utf8'));
      }
      existingActivity.unshift(activity);
      fs.writeFileSync(alertsPath, JSON.stringify(existingActivity, null, 2));
    } catch (e) {
      console.error("Failed to log activity:", e);
    }

    return NextResponse.json({ success: true, message: 'File uploaded successfully' });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: 'Failed to upload file to backend' }, { status: 500 });
  }
}
