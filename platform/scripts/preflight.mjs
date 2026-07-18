import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root=process.cwd();
const requiredFiles=[
  'package.json',
  'next.config.mjs',
  'app/layout.tsx',
  'app/page.tsx',
  'app/dashboard/page.tsx',
  'app/api/health/route.ts',
  'lib/data-provider.ts',
  'lib/workflow-store.ts',
  'lib/notifications.ts',
  'supabase/migrations/001_initial_schema.sql',
  'supabase/seed.sql',
  'vercel.json'
];

let failed=false;
console.log('\nHROX deployment preflight\n');
for(const file of requiredFiles){
  const ok=existsSync(resolve(root,file));
  console.log(`${ok?'✓':'✗'} ${file}`);
  if(!ok)failed=true;
}

const envNames=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY'];
console.log('\nEnvironment');
for(const name of envNames){
  const ok=Boolean(process.env[name]);
  console.log(`${ok?'✓':'○'} ${name}${ok?'':' (Demo mode)'}`);
}

const pkg=JSON.parse(readFileSync(resolve(root,'package.json'),'utf8'));
for(const command of ['dev','build','start','typecheck','preflight']){
  const ok=Boolean(pkg.scripts?.[command]);
  console.log(`${ok?'✓':'✗'} npm script: ${command}`);
  if(!ok)failed=true;
}

console.log(`\nRuntime mode: ${process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?'SUPABASE':'DEMO'}`);
if(failed){
  console.error('\nPreflight failed. Resolve the missing required items above.\n');
  process.exit(1);
}
console.log('\nPreflight passed. Run npm run typecheck and npm run build next.\n');
