import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/data';

export async function POST() {
  const events = readJsonFile('activity-log.json');
  if (!Array.isArray(events)) {
    return NextResponse.json({ status: 'error', message: 'Invalid activity log' }, { status: 500 });
  }

  const userBaselines: Record<string, { avg_files_per_hour: number, departure_date: string | null }> = {
    "alice": { avg_files_per_hour: 2, departure_date: null },
    "bob": { avg_files_per_hour: 5, departure_date: null },
    "carol": { avg_files_per_hour: 1, departure_date: "2026-09-20T00:00:00Z" }
  };

  const alerts: any[] = [];
  const hourWindowFiles: Record<string, number> = {};

  for (const event of events) {
    const { user, action, timestamp, file_path } = event;
    if (!user || !action || !timestamp) continue;

    // Rule 3: Unauthorized External Share
    if (action === 'share_external') {
      alerts.push({
        user,
        rule_triggered: "unauthorized_external_share",
        evidence: `User created an external share link for ${file_path}.`,
        severity: "high",
        timestamp
      });
      continue;
    }

    if (action !== 'view' && action !== 'download') continue;

    const baseline = userBaselines[user];
    if (!baseline) continue;

    hourWindowFiles[user] = (hourWindowFiles[user] || 0) + 1;

    // Rule 1: Spike vs Baseline
    if (hourWindowFiles[user] > baseline.avg_files_per_hour * 3) {
      alerts.push({
        user,
        rule_triggered: "spike_vs_baseline",
        evidence: `User accessed ${hourWindowFiles[user]} files in an hour. Baseline is ${baseline.avg_files_per_hour}.`,
        severity: "high",
        timestamp
      });
      // reset window to avoid spam
      hourWindowFiles[user] = 0;
    }

    // Rule 2: Burst Near Departure
    if (baseline.departure_date) {
      const eventTime = new Date(timestamp).getTime();
      const depTime = new Date(baseline.departure_date).getTime();
      const diffDays = (depTime - eventTime) / (1000 * 3600 * 24);
      
      if (diffDays >= 0 && diffDays <= 14 && hourWindowFiles[user] >= 5) {
        alerts.push({
          user,
          rule_triggered: "burst_near_departure",
          evidence: `User accessed >= 5 files within 14 days of departure date (${baseline.departure_date}).`,
          severity: "high",
          timestamp
        });
        hourWindowFiles[user] = 0;
      }
    }
  }

  writeJsonFile('leak-alert.json', alerts);
  return NextResponse.json({ status: 'success', alerts });
}
