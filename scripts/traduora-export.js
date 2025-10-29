import 'dotenv/config';
import {execSync} from 'child_process';

console.log('TRADUORA_PROJECT_ID:', process.env.TRADUORA_PROJECT_ID);
console.log('TRADUORA_CLIENT_ID:', process.env.TRADUORA_CLIENT_ID);
console.log('TRADUORA_CLIENT_SECRET:', process.env.TRADUORA_CLIENT_SECRET);

execSync('pnpm dlx traduora-export', {stdio: 'inherit'});
