import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const API_URL = process.env.TRADUORA_API_URL;
const PROJECT_ID = process.env.TRADUORA_PROJECT_ID;
const TOKEN = process.env.TRADUORA_TOKEN;

const MESSAGES_DIR = path.resolve('messages');
const locales = ['en', 'ja', 'de'];

if (!API_URL || !PROJECT_ID || !TOKEN) {
  console.error(
    '❌ Set TRADUORA_API_URL, TRADUORA_PROJECT_ID, TRADUORA_TOKEN in .env.local'
  );
  process.exit(1);
}

async function uploadLocale(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ ${locale}.json not found, skipping.`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`📤 Uploading ${locale}.json...`);

  const res = await fetch(`${API_URL}/import`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      format: 'json',
      language: locale,
      content
    })
  });

  if (!res.ok)
    throw new Error(`Failed to upload ${locale}: ${await res.text()}`);
  console.log(`✅ Uploaded ${locale}`);
}

(async () => {
  for (const locale of locales) await uploadLocale(locale);
  console.log('🚀 All locales uploaded!');
})();
