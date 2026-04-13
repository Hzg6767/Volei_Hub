@echo off
REM ════════════════════════════════════════════════════════════════
REM  VOLEI HUB - AUTO DEPLOY FIREBASE
REM ════════════════════════════════════════════════════════════════

cls
echo.
echo  ███████████████████████████████████████████████████
echo  █  VOLEI HUB - Deploy Firebase Hosting Automático  █
echo  ███████████████████████████████████████████████████
echo.

REM Verificar se Node.js está instalado
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo.
    echo 📥 Baixe em: https://nodejs.org/ (LTS recomendado)
    echo 📌 Após instalar, reinicie este script
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js !NODE_VERSION! encontrado
)

REM Verificar se npm está instalado
echo [2/5] Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm não encontrado!
    echo 📌 Reinstale Node.js e verifique "Add to PATH"
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm !NPM_VERSION! encontrado
)

REM Instalar Firebase CLI
echo [3/5] Instalando Firebase CLI...
npm install -g firebase-tools >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Erro ao instalar Firebase CLI
    echo 💡 Tente executar como Administrator
    pause
    exit /b 1
) else (
    echo ✅ Firebase CLI instalado
)

REM Fazer login no Firebase
echo [4/5] Fazendo login no Firebase...
echo 📌 Sua janela default do navegador abrirá para autenticação
echo 📌 Clique em sua conta Google e retorne aqui
timeout /t 3 >nul
firebase login
if errorlevel 1 (
    echo ❌ Falha na autenticação
    pause
    exit /b 1
) else (
    echo ✅ Autenticado com sucesso
)

REM Deploy
echo [5/5] Fazendo deploy...
echo 📤 Enviando arquivos para Firebase Hosting...
firebase deploy

if errorlevel 1 (
    echo ❌ Erro no deploy!
    pause
    exit /b 1
) else (
    echo.
    echo ╔════════════════════════════════════════════════════╗
    echo ║  ✅ DEPLOY CONCLUÍDO COM SUCESSO!                 ║
    echo ║  🌍 https://voleihub-59a3b.web.app                ║
    echo ║  📤 Próximas atualizações: firebase deploy        ║
    echo ╚════════════════════════════════════════════════════╝
    echo.
    pause
)
