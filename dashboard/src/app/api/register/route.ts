import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { username, password, displayName } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    // 1. Create the user in Nextcloud via Docker OCC
    // Note: MUST run as www-data, otherwise Nextcloud rejects it.
    const cmdCreate = `docker compose exec --user www-data -e OC_PASS="${password}" app php occ user:add --password-from-env --display-name="${displayName || username}" ${username}`;
    await execAsync(cmdCreate, { cwd: '../infra' });

    return NextResponse.json({ success: true, message: 'Account created successfully in Nextcloud!' });
  } catch (error: any) {
    console.error("Registration Error occurred");
    // NEVER leak the raw error.message because it contains the executed command string and password!
    return NextResponse.json({ error: 'Failed to create account in Nextcloud. Please try again.' }, { status: 500 });
  }
}
