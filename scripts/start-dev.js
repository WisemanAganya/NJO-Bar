import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

process.env.NODE_ENV = 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cliPath = path.join(__dirname, '../node_modules/tsx/dist/cli.mjs');

const result = spawnSync(process.execPath, [cliPath, 'server.ts'], {
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error('Failed to start development server:', result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
