# 🚀 Deploy VoleiHub no Firebase Hosting

## 1️⃣ INSTALAR NODE.JS + NPM

### Windows:
1. Baixe em: https://nodejs.org/ (versão LTS recomendada)
2. Execute o instalador
3. Clique em "Next" até o final
4. **IMPORTANTE:** Verifique a opção "Add to PATH" durante a instalação
5. Reinicie o PowerShell/CMD tras a instalação

### Verificar instalação:
```powershell
node --version
npm --version
```

Exemplo de saída esperada:
```
v20.11.0
10.2.4
```

## 2️⃣ INSTALAR FIREBASE CLI

Após instalar Node.js, abra o PowerShell e execute:

```powershell
npm install -g firebase-tools
```

Verificar instalação:
```powershell
firebase --version
```

Saída esperada:
```
13.5.0
```

## 3️⃣ FAZER LOGIN NO FIREBASE

Conecte sua conta Google:

```powershell
firebase login
```

Isso abrirá uma janela do navegador para você fazer login.

## 4️⃣ INICIALIZAR PROJETO FIREBASE HOSTING

Navegue até a pasta do projeto:

```powershell
cd "C:\Users\heito\OneDrive\Área de Trabalho\Codes\Volei_Hub"
```

Inicialize o Firebase:

```powershell
firebase init hosting
```

Responda as perguntas:
```
? Which Firebase project do you want to associate with this directory?
→ voleihub-59a3b

? What do you want to use as your public directory?
→ . (ponto, porque seu arquivo já está na raiz)

? Configure as a single-page app (rewrite all urls to /index.html)?
→ N (não, porque é arquivo HTML único)

? Set up automatic builds and deploys with GitHub?
→ N (não precisa por enquanto)
```

Isso criará 2 arquivos:
- `.firebaserc` - Configuração do projeto
- `firebase.json` - Configuração de hosting

## 5️⃣ DEPLOY DO SITE

**Primeira vez:**
```powershell
firebase deploy
```

**Próximas vezes:**
```powershell
firebase deploy
```

Saída esperada:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/voleihub-59a3b
Hosting URL: https://voleihub-59a3b.web.app
```

## 🌍 SUA APP ESTARÁ DISPONÍVEL EM:

```
https://voleihub-59a3b.web.app
```

Compartilhe este link com seus amigos e eles verão seu VoleiHub ao vivo!

## 🔄 FLUXO DE DESENVOLVIMENTO

**Cada vez que fizer mudanças:**

```powershell
# Faça suas edições em volei-hub.html

# Deploy para produção
firebase deploy

# Pronto! A versão online está atualizada
```

## 🎯 VERIFICAR STATUS

```powershell
# Ver histórico de deploys
firebase hosting:channel:list

# Ver versão ao vivo
firebase hosting:sites
```

## 🛠️ TROUBLESHOOTING

| Erro | Solução |
|------|---------|
| `firebase: The term 'firebase' is not recognized` | Node.js/npm não está no PATH. Reinicie a máquina |
| `Error: Cannot find firebase.json` | Execute `firebase init hosting` na pasta correta |
| `Permission denied` | Execute PowerShell como Administrator |
| `CORS error ao sincronizar Firebase` | Verifique regras de Database/Firestore |

## 📋 ARQUIVO GERADO: firebase.json

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "redirects": [],
    "rewrites": [
      {
        "source": "**",
        "destination": "/volei-hub.html"
      }
    ]
  }
}
```

## 🔐 GERENCIAR PROJETO ONLINE

Console: https://console.firebase.google.com/project/voleihub-59a3b/hosting

Ali você pode:
- Ver histórico de deploys
- Restaurar versões anteriores
- Gerenciar domínios customizados
- Ver analytics

## 🎉 ESTÁ PRONTO!

Após completar os passos acima:

1. ✅ VoleiHub online 24/7
2. ✅ Sincronização Firebase funcionando
3. ✅ Múltiplos acessos em tempo real
4. ✅ Histórico de partidas armazenado
5. ✅ Disponível em qualquer lugar

Qualquer dúvida: https://firebase.google.com/docs/hosting
