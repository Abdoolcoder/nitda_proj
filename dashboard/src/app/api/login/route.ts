import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    // Authenticate directly against the Nextcloud OCS API
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    const response = await fetch(`http://localhost:8080/ocs/v1.php/cloud/users/${username}?format=json`, {
      method: 'GET',
      headers: {
        'OCS-APIRequest': 'true',
        'Authorization': `Basic ${credentials}`
      }
    });

    if (response.ok) {
      // Authentication successful
      return NextResponse.json({ success: true, message: 'Authentication successful' });
    } else {
      // Authentication failed (401 or 404)
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error: any) {
    console.error("Login Error occurred");
    return NextResponse.json({ error: 'Failed to connect to Nextcloud Authentication Service.' }, { status: 500 });
  }
}
