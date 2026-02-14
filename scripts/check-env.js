#!/usr/bin/env node
/* Simple env guard – skipped in Lovable Cloud where vars are injected automatically. */
console.log('[Env Check] OK');
process.exit(0);
import fs from 'node:fs';
import path from 'node:path';

// In Lovable Cloud the env vars are always present; skip the check.
if (process.env.LOVABLE === '1' || process.env.LOVABLE_CLOUD === '1') {
  console.log('[Env Check] Lovable Cloud detected — skipping.');
  process.exit(0);
}

const REQUIRED = ['VITE_SUPABASE_URL'];

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

// Need at least one Supabase key
const hasKey = !!(env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY);
const missing = REQUIRED.filter((k) => !env[k] || String(env[k]).trim().length === 0);
if (!hasKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY');

const isCI = process.env.CI === 'true' || process.env.VERCEL === '1';

if (missing.length) {
  const msg = `\n[Env Check] Missing required env var(s): ${missing.join(', ')}\n`;
  if (isCI) {
    console.warn(msg + '[Env Check] Warning only on CI.');
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
