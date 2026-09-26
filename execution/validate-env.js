/**
 * Script Determinístico: Validação de Variáveis de Ambiente (.env)
 * Camada 3: Execução
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn('⚠️ Arquivo .env não encontrado no caminho:', filePath);
    return {};
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const eqIdx = line.indexOf('=');
    if (eqIdx !== -1) {
      const key = line.substring(0, eqIdx).trim();
      let val = line.substring(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (val.endsWith(',')) {
        val = val.slice(0, -1).trim();
      }
      env[key] = val;
    }
  });
  return env;
}

const env = parseEnv(envPath);
console.log('🔍 Validando variáveis de ambiente...');

const requiredKeys = [
  'FIREBASE_apiKey',
  'FIREBASE_authDomain',
  'FIREBASE_projectId',
  'GITHUB_PERSONA_KEY'
];

let allValid = true;
requiredKeys.forEach(k => {
  if (env[k]) {
    console.log(`  ✅ [OK] ${k} está presente.`);
  } else {
    console.warn(`  ⚠️ [FALTA] ${k} não está definido.`);
    allValid = false;
  }
});

if (allValid) {
  console.log('🚀 Todas as variáveis de ambiente obrigatórias estão configuradas com sucesso!');
} else {
  console.log('ℹ️ Operando com valores de fallback onde aplicável.');
}

export { env };
