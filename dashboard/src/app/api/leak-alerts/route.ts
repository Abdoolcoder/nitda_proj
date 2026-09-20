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
    
    // Merge Next.js custom API alerts
    let apiAlerts: any[] = [];
    let apiActivity: any[] = [];
    try {
      const fs = require('fs');
      const alertsPath = path.join(process.cwd(), '..', 'infra', 'nextjs-alerts.json');
      if (fs.existsSync(alertsPath)) {
        apiAlerts = JSON.parse(fs.readFileSync(alertsPath, 'utf8'));
      }
      
      const activityPath = path.join(process.cwd(), '..', 'infra', 'nextjs-activity.json');
      if (fs.existsSync(activityPath)) {
        apiActivity = JSON.parse(fs.readFileSync(activityPath, 'utf8'));
      }
    } catch(e) {}

    return NextResponse.json({ 
      alerts: [...apiAlerts, ...(data.alerts || [])], 
      raw_activity: [...apiActivity, ...(data.raw_activity || [])]
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to run leak detection' }, { status: 500 });
  }
}
