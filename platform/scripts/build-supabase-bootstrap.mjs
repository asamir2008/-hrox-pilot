import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const migrationsDir = path.join(root, 'supabase', 'migrations');
const seedPath = path.join(root, 'supabase', 'seed.sql');
const outputPath = path.join(root, 'supabase', 'bootstrap.sql');

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(migrationsDir))) {
    throw new Error(`Missing migrations directory: ${migrationsDir}`);
  }

  const files = (await readdir(migrationsDir))
    .filter((name) => name.toLowerCase().endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    throw new Error('No SQL migration files were found.');
  }

  const sections = [
    '-- HROX Supabase Bootstrap',
    `-- Generated: ${new Date().toISOString()}`,
    '-- Run this file once in a fresh Supabase project using the SQL Editor.',
    '-- Re-running may fail where objects already exist; use migrations for later changes.',
    '',
    'begin;',
    ''
  ];

  for (const file of files) {
    const fullPath = path.join(migrationsDir, file);
    const sql = await readFile(fullPath, 'utf8');
    sections.push(`-- ============================================================`);
    sections.push(`-- Migration: ${file}`);
    sections.push(`-- ============================================================`);
    sections.push(sql.trim());
    sections.push('');
  }

  if (await exists(seedPath)) {
    sections.push('-- ============================================================');
    sections.push('-- Seed data');
    sections.push('-- ============================================================');
    sections.push((await readFile(seedPath, 'utf8')).trim());
    sections.push('');
  }

  sections.push('commit;');
  sections.push('');
  sections.push('-- Bootstrap completed. Create Supabase Auth users next, then confirm profiles and roles.');

  await writeFile(outputPath, sections.join('\n'), 'utf8');
  console.log(`Created ${path.relative(root, outputPath)} from ${files.length} migration file(s).`);
}

main().catch((error) => {
  console.error(`Bootstrap generation failed: ${error.message}`);
  process.exit(1);
});
