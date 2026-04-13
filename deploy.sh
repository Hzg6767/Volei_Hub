#!/bin/bash

# ════════════════════════════════════════════════════════════════
#  VOLEI HUB - AUTO DEPLOY FIREBASE (Linux/Mac)
# ════════════════════════════════════════════════════════════════

clear
echo ""
echo "  ███████████████████████████████████████████████████"
echo "  █  VOLEI HUB - Deploy Firebase Hosting Automático  █"
echo "  ███████████████████████████████████████████████████"
echo ""

# Verificar Node.js
echo "📌 [1/5] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "📥 Instale em: https://nodejs.org/ (LTS recomendado)"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION encontrado"

# Verificar npm
echo "📌 [2/5] Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado!"
    exit 1
fi
NPM_VERSION=$(npm --version)
echo "✅ npm $NPM_VERSION encontrado"

# Instalar Firebase CLI
echo "📌 [3/5] Instalando Firebase CLI..."
npm install -g firebase-tools
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar Firebase CLI"
    exit 1
fi
echo "✅ Firebase CLI instalado"

# Login Firebase
echo "📌 [4/5] Fazendo login no Firebase..."
echo "📌 Sua janela default do navegador abrirá para autenticação"
sleep 3
firebase login
if [ $? -ne 0 ]; then
    echo "❌ Falha na autenticação"
    exit 1
fi
echo "✅ Autenticado com sucesso"

# Deploy
echo "📌 [5/5] Fazendo deploy..."
echo "📤 Enviando arquivos para Firebase Hosting..."
firebase deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════════════╗"
    echo "║  ✅ DEPLOY CONCLUÍDO COM SUCESSO!                 ║"
    echo "║  🌍 https://voleihub-59a3b.web.app                ║"
    echo "║  📤 Próximas atualizações: firebase deploy        ║"
    echo "╚════════════════════════════════════════════════════╝"
    echo ""
else
    echo "❌ Erro no deploy!"
    exit 1
fi
