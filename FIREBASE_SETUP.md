# 🔥 Firebase Setup - VoleiHub

## 1️⃣ CRIAR PROJETO FIREBASE

1. Acesse: https://console.firebase.google.com
2. Clique em **"+ Adicionar Projeto"**
3. Nome: `volei-hub` (ou o nome que quiser)
4. Desmarque "Analytics" (não precisa por enquanto)
5. Clique em **"Criar Projeto"**

## 2️⃣ CONFIGURAR REALTIME DATABASE

1. No seu projeto, clique em **"Realtime Database"** (menu esquerdo)
2. Clique em **"Criar Banco de Dados"**
3. Região: `southamerica-southeast1` (São Paulo) ✅
4. Modo de segurança: **"Iniciar no modo de teste"** (para desenvolvimento)
5. Clique em **"Ativar"**

```
Regras de teste (válidas por 30 dias):
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## 3️⃣ CONFIGURAR FIRESTORE

1. Clique em **"Firestore Database"** (menu esquerdo)
2. Clique em **"Criar Banco de Dados"**
3. Localização: `southamerica-southeast1` ✅
4. Modo de segurança: **"Iniciar no modo de teste"**
5. Clique em **"Criar"**

```
Regras de teste:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 4️⃣ OBTER CREDENCIAIS

1. Vá em **Configurações do Projeto** (engrenagem, canto superior direito)
2. Clique em **"Apps"** → **"Adicionar app"** → **"Web"**
3. Nome do app: `VoleiHub Web`
4. Marque "Configurar também o Firebase Hosting"
5. Clique em **"Registrar app"**
6. Você verá um código como:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDexample...",
  authDomain: "seu-projeto.firebaseapp.com",
  databaseURL: "https://seu-projeto.firebaseio.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456gh78"
};
```

## 5️⃣ COLAR NO CÓDIGO

No arquivo `volei-hub.html`, procure por:

```javascript
  const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "seu-projeto.firebaseapp.com",
    databaseURL: "https://seu-projeto.firebaseio.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
  };
```

**Cole suas credenciais reais** no lugar dos placeholders.

## 📡 COMO FUNCIONA A SINCRONIZAÇÃO

### A. Score em Tempo Real (Realtime Database)
Quando um marcador adiciona pontos:
```
📱 Device 1 (Marcador)
   ↓
   syncScore() → Firebase Realtime DB
   ↓
📱 Device 2 (Espectador) ← onValue() → atualiza ao vivo
📱 Device 3 (Transmissor) ← onValue() → atualiza ao vivo
```

**Caminho no Firebase:** `live_scores/{gameId}`
```json
{
  "scoreA": 25,
  "scoreB": 22,
  "timestamp": 1704067200000,
  "updated": "13/04/2026 14:00:30"
}
```

### B. Histórico de Partidas (Firestore)
Quando uma partida termina:
```
setWinner() 
   ↓
saveGameHistory()
   ↓
Firestore: collection "historico_jogos"
```

**Estrutura no Firestore:**
```json
{
  "gameId": 1707895000,
  "winner": "time-123",
  "phase": "Final",
  "timestamp": 1704067200000,
  "setsA": 2,
  "setsB": 0,
  "savedAt": "2026-04-13T14:00:30Z",
  "device": "Mozilla/5.0..."
}
```

## 🎯 USE CASES

### 1. Placar Ao Vivo (Multi-Device)
```javascript
// Device 1: Marcador
addPt('a') 
→ window.fbSync.syncScore(gameId, 25, 22)
→ Firebase atualiza

// Device 2 & 3: Observadores
Escutam automaticamente: window.fbSync.listenScore(gameId, callback)
→ Veem o score atualizar em tempo real
```

### 2. Histórico Persistente
```javascript
// Quando jogo termina
setWinner(gameId, teamId)
→ window.fbSync.saveGameHistory({...})
→ Fica salvo no Firestore FOREVER
→ Pode consultar depois com: window.fbSync.loadGameHistory()
```

### 3. Dashboard de Resultados
```javascript
// Buscar últimos 10 jogos
const historico = await window.fbSync.loadGameHistory(10);
console.log(historico);
// [
//   { gameId: 123, winner: "456", phase: "Final", ... },
//   { gameId: 122, winner: "789", phase: "Semi", ... },
//   ...
// ]
```

## 🔒 SEGURANÇA (Produção)

Para fazer a app ir para **produção**, siga estas regras:

### Realtime Database (PRODUCTION)
```json
{
  "rules": {
    "live_scores": {
      "$gameId": {
        ".read": true,
        ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
      }
    }
  }
}
```

### Firestore (PRODUCTION)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /historico_jogos/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## ✅ COMO TESTAR

1. Abra a app em **Device 1** (seu celular)
2. Abra a app em **Device 2** (outro celular / tablet)
3. Comece um jogo em Device 1
4. Clique em **"Placar ao Vivo"**
5. Adicione um ponto (clique em +)
6. **Veja o score atualizar em Device 2 em tempo real!** 🎯

## 🐛 TROUBLESHOOTING

| Problema | Solução |
|----------|---------|
| "Firebase não configurado" no console | Cole as credenciais corretas no `firebaseConfig` |
| Score não sincroniza | Verifique se Realtime Database está ativado |
| Histórico não salva | Confirme que Firestore está ativado |
| Erro de CORS | Realtime Database precisa estar públic em desenvolvimento |

## 📝 DISPONÍVEL VIA:

```javascript
// Script global
window.fbSync = {
  enabled: boolean,
  syncScore(gameId, scoreA, scoreB),
  listenScore(gameId, callback),
  saveGameHistory(gameData),
  loadGameHistory(limitCount),
  clearScore(gameId)
}
```

## 🚀 PRÓXIMOS PASSOS

1. ✅ Configure os 3 serviços acima
2. ✅ Cole as credenciais
3. ✅ Teste com 2 dispositivos
4. 🔐 Implemente autenticação (Google Sign-In)
5. 🔒 Finalize as regras de segurança
6. 🌍 Faça deploy no Firebase Hosting

Qualquer dúvida, acesse a documentação: https://firebase.google.com/docs
