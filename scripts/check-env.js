#!/usr/bin/env node
/* Simple env guard for Vite client variables used by the app.
 * Fails fast if critical env vars are missing locally or in CI.
 */
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];

function parseDotEnvFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const out = {};
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let [, key, val] = m;
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      out[key] = val;
    }
    return out;
  } catch {
    return {};
  }
}

function loadLocalEnv() {
  const cwd = process.cwd();
  const files = ['.env.local', '.env'];
  let env = { ...process.env };
  for (const f of files) {
    const p = path.join(cwd, f);
    if (fs.existsSync(p)) env = { ...parseDotEnvFile(p), ...env };
  }
  return env;
}

const env = loadLocalEnv();
const missing = REQUIRED.filter((k) => !env[k] || String(env[k]).trim().length === 0);

const isCI = process.env.CI === 'true' || process.env.VERCEL === '1';

if (missing.length) {
  const msg = `\n[Env Check] Missing required env var(s): ${missing.join(', ')}\n`;
  if (isCI) {
    // On CI/Vercel we warn but do not fail the build to allow preview deployments.
    console.warn(msg + '[Env Check] Warning only on CI — set Project Environment Variables in Vercel for production.');
  } else {
    console.error(msg);
    console.error('Create a .env.local file in the project root with values like:');
    console.error('  VITE_SUPABASE_URL=https://<project-ref>.supabase.co');
    console.error('  VITE_SUPABASE_ANON_KEY=<your anon key>');
    process.exit(1);
  }
} else {
  console.log('[Env Check] OK');
}
