import 'dotenv/config';

const base = process.env.BASE_URL || 'http://localhost:5001/api';

async function postJson(url, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
  return { status: res.status, data };
}

async function run() {
  try {
    const testUser = { name: 'ApiTester', email: 'apitester@example.com', password: 'password123' };
    // Signup (ignore 400 already exists)
    try {
      const s = await postJson(`${base}/auth/signup`, testUser);
      console.log('Signup response:', s.status, s.data);
    } catch (e) { console.warn('Signup step error', e); }

    // Login
    const login = await postJson(`${base}/auth/login`, { email: testUser.email, password: testUser.password });
    if (login.status !== 200) {
      console.error('Login failed', login.status, login.data);
      return;
    }
    const token = login.data.token;
    console.log('Logged in, token present:', !!token);

    // Create settlement via API
    const payload = {
      groupId: null,
      fromUser: '000000000000000000000001',
      toUser: '000000000000000000000002',
      amount: 5,
      note: 'API flow test'
    };

    const res = await postJson(`${base}/settlements/record`, payload, token);
    console.log('Settlement API response:', res.status, res.data);
  } catch (err) {
    console.error('Unexpected error', err);
  }
}

run();
