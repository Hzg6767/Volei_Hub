# 🚀 Deploy VoleiHub - Instruções Rápidas

## ⚡ START RÁPIDO (1 minuto)

### Windows
1. Baixe [Node.js LTS](https://nodejs.org/) e instale
2. Reinicie o PC
3. Clique 2x em `deploy.bat` nesta pasta
4. Siga as instruções (vai abrir seu navegador para login)

### Mac/Linux
1. Instale [Node.js LTS](https://nodejs.org/)
2. Abra terminal na pasta do projeto
3. Execute: `bash deploy.sh`
4. Siga as instruções

## 🎯 O que o script faz

```
1. Verifica Node.js/npm ✅
2. Instala Firebase CLI ✅
3. Faz login com Google ✅
4. Deploy automático ✅
5. Aqui! 🎉 https://voleihub-59a3b.web.app
```

## 📊 Seu site online

Após o deploy, acesse:
```
🌍 https://voleihub-59a3b.web.app
```

## 🔄 Próximas Atualizações

Depois da primeira vez, para atualizar o site:

**Terminal (qualquer pasta):**
```powershell
firebase deploy
```

Ou execute o script novamente.

## ⚠️ PRIMEIRO DEPLOY - Pré-requisitos

### Obrigatório:
- [ ] Node.js LTS instalado
- [ ] Conta Google ativa
- [ ] Projeto Firebase criado (voleihub-59a3b)
- [ ] Realtime Database ativado
- [ ] Firestore ativado

### Opcional:
- [ ] Domínio customizado
- [ ] HTTPS (automático)
- [ ] CDN global (automático)

## 🐛 Troubleshooting

### "Node.js não encontrado"
- Instale: https://nodejs.org/
- Marque "Add to PATH" na instalação
- Reinicie o PC

### "npm command not found"
- Mesmo problema do Node.js
- Verificar: `npm -v` no terminal

### "Firebase não instalado"
- Execute em PowerShell como **Administrator**
- Ou manual: `npm install -g firebase-tools`

### Erro de autenticação
- Certifique-se que você tem acesso ao projeto voleihub-59a3b
- Tente: `firebase logout` e depois `firebase login` novamente

### Arquivo não atualiza online
- Aguarde 30-60 segundos após deploy
- Limpar cache: Ctrl+F5 (ou Cmd+Shift+R no Mac)
- Verificar: `firebase hosting:channel:list`

## 📋 Arquivos envolvidos

```
volei-hub.html           ← Seu app (upload automático)
firebase.json            ← Config (criado)
.firebaserc             ← Projeto link (criado)
deploy.bat/deploy.sh    ← Script automation (este arquivo)
```

## 🎯 Console Firebase

Gerenciar seu site:
https://console.firebase.google.com/project/voleihub-59a3b/hosting

Ali você pode:
- Ver histórico de deploys
- Restaurar versão anterior
- Gerenciar domínios
- Ver estatísticas

## ✅ Pronto?

```
[Windows]  Clique 2x em: deploy.bat
[Mac/Linux] Execute:    bash deploy.sh
```

Seu VoleiHub online em < 1 minuto! 🚀
