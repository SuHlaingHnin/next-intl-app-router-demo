import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const CLIENT_ID = process.env.TRADUORA_CLIENT_ID;
const CLIENT_SECRET = process.env.TRADUORA_CLIENT_SECRET;
const USERNAME = process.env.TRADUORA_USERNAME;
const PASSWORD = process.env.TRADUORA_PASSWORD;
const API_URL = process.env.TRADUORA_API_URL;
const PROJECT_ID = process.env.TRADUORA_PROJECT_ID;

const MESSAGES_DIR = path.resolve('messages');
const locales = ['en', 'ja', 'de'];

if (!API_URL || !PROJECT_ID) {
  console.error(
    '❌ Set TRADUORA_API_URL, TRADUORA_PROJECT_ID, TRADUORA_TOKEN in .env.local'
  );
  process.exit(1);
}

async function getAccessToken(username, password, clientId, clientSecret) {
  const res = await fetch(`${API_URL}/api/v1/auth/token`, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      grant_type: 'password',
      username: username,
      password: password,
      client_id: clientId,
      client_secret: clientSecret
    })
  });
  console.log('res: ', res);
  if (!res.ok) throw new Error('Failed to get access token');
  const data = await res.json();
  return data.access_token; // <- This is the Bearer token
}

async function downloadLocale(locale) {
  console.log(`📥 Downloading ${locale}.json... on ${API_URL}`);

  const res = await fetch(
    `${API_URL}/api/v1/projects/${PROJECT_ID}/exports?locale=${locale}&format=jsonnested`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!res.ok)
    throw new Error(`Failed to download ${locale}: ${await res.text()}`);

  const data = await res.text();
  fs.writeFileSync(path.join(MESSAGES_DIR, `${locale}.json`), data);
  console.log(`✅ Saved ${locale}.json`);
}

const token = await getAccessToken(
  USERNAME,
  PASSWORD,
  CLIENT_ID,
  CLIENT_SECRET
);

for (const locale of locales) {
  await downloadLocale(locale, token);
}

console.log('🚀 All locales downloaded!');
