/**
 * Script Determinístico: Publicação no GitHub via REST API
 * Camada 3: Execução
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.resolve(rootDir, '.env');

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
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

async function publishToGitHub() {
  const env = parseEnv(envPath);
  const token = env.GITHUB_PERSONA_KEY;
  const repoName = 'burguersync-ourinhos';

  if (!token) {
    console.error('❌ GITHUB_PERSONA_KEY não encontrada no arquivo .env');
    return;
  }

  console.log('🚀 Inicializando publicação no GitHub...');

  // 1. Identificar usuário autenticado
  let user;
  try {
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'BurguerSync-Publisher',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    user = await userRes.json();
    if (!userRes.ok) {
      throw new Error(user.message || 'Falha ao autenticar no GitHub');
    }
    console.log(`👤 Autenticado no GitHub como: ${user.login}`);
  } catch (err) {
    console.error('❌ Erro na autenticação com GitHub:', err.message);
    return;
  }

  // 2. Verificar se repositório já existe ou criar
  let repoUrl;
  try {
    const repoCheckRes = await fetch(`https://api.github.com/repos/${user.login}/${repoName}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'BurguerSync-Publisher',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (repoCheckRes.ok) {
      const repoData = await repoCheckRes.json();
      repoUrl = repoData.clone_url;
      console.log(`ℹ️ Repositório já existe: ${repoData.html_url}`);
    } else {
      console.log(`📦 Criando repositório público '${repoName}' no GitHub...`);
      const createRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'BurguerSync-Publisher',
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: repoName,
          description: '🍔 BurguerSync Ourinhos - Plataforma de Pedidos & KDS em Tempo Real com Google Antigravity & Firebase',
          private: false,
          auto_init: false
        })
      });
      const createdRepo = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createdRepo.message || 'Falha ao criar repositório');
      }
      repoUrl = createdRepo.clone_url;
      console.log(`✅ Repositório criado com sucesso: ${createdRepo.html_url}`);
    }
  } catch (err) {
    console.error('❌ Erro ao gerenciar repositório no GitHub:', err.message);
    return;
  }

  // 3. Configurar git local e fazer push
  try {
    console.log('🔄 Preparando commit e push local...');
    try { execSync('git init', { cwd: rootDir, stdio: 'pipe' }); } catch (_) {}
    execSync('git config user.name "Google Antigravity Agent"', { cwd: rootDir, stdio: 'pipe' });
    execSync('git config user.email "agent@antigravity.google"', { cwd: rootDir, stdio: 'pipe' });
    execSync('git branch -M main', { cwd: rootDir, stdio: 'pipe' });
    execSync('git add .', { cwd: rootDir, stdio: 'pipe' });
    
    try {
      execSync('git commit -m "feat: initial commit - BurguerSync Ourinhos with Firebase Firestore & Stitch UI"', { cwd: rootDir, stdio: 'pipe' });
    } catch (_) {
      console.log('ℹ️ Sem alterações novas para commit.');
    }

    const authenticatedRemote = `https://${user.login}:${token}@github.com/${user.login}/${repoName}.git`;
    
    try {
      execSync('git remote remove origin', { cwd: rootDir, stdio: 'pipe' });
    } catch (_) {}

    execSync(`git remote add origin ${authenticatedRemote}`, { cwd: rootDir, stdio: 'pipe' });
    console.log('⬆️ Enviando branch main para o GitHub...');
    execSync('git push -u origin main --force', { cwd: rootDir, stdio: 'inherit' });
    console.log(`🎉 Código publicado com sucesso no GitHub: https://github.com/${user.login}/${repoName}`);
  } catch (err) {
    console.error('❌ Erro durante git push:', err.message);
  }
}

publishToGitHub();
