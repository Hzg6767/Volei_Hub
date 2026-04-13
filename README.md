# VoleiHub - Gerenciador de Voleibol

Sistema completo para gerenciar times, jogadores e torneios de voleibol com sincronização em tempo real via Firebase.

## 🚀 Quick Start

### Local (sem deploy)
1. Abra `volei-hub.html` no navegador
2. Use normalmente - dados salvos localmente

### Online (Firebase Hosting)
1. Instale [Node.js](https://nodejs.org/)
2. Instale Firebase CLI:
   ```
   npm install -g firebase-tools
   ```
3. Faça login:
   ```
   firebase login
   ```
4. Deploy:
   ```
   firebase deploy
   ```
5. Acesse: https://voleihub-59a3b.web.app

## 📱 Recursos

### ⚽ Gerenciamento de Times
- Criar times com cores customizadas
- Adicionar/remover jogadores
- Perfil de experiência (Iniciante, Intermediário, Avançado)

### 🏆 Torneios
- Criar bracket automático (8, 16, 32 times)
- Fases: Inicial → Round of 16 → Quartas → Semi → Final
- Advance automático de vencedores
- Marca campeão ao final

### 📊 Placar ao Vivo
- Score em tempo real com Firebase
- Vista espelhada (180°) para ler de ambos os lados
- Modo portrait e landscape
- Suporta múltiplos dispositivos simultâneos

### 📈 Histórico
- Todas as partidas salvas no Firestore
- Busca e filtros de resultados
- Estatísticas por fase

### 🔒 Admin
- Controle total com botão admin
- Deletar times, jogadores, jogos
- Resetar torneio

## 🔥 Firebase Realtime

Quando alguém adiciona ponto:
```
Device A (Marcador) → Clica + 
                    ↓
              Firebase realtime
                    ↓
Device B (Espectador A) ← Vê atualizar ao vivo
Device C (Espectador B) ← Vê atualizar ao vivo
Device D (Transmissor) ← Vê atualizar ao vivo
```

## 📁 Estrutura

```
volei-hub.html              # App completa (1500+ linhas)
firebase.json               # Config Firebase Hosting
.firebaserc                 # Projeto Firebase
FIREBASE_SETUP.md           # Como configurar Firebase
DEPLOY_FIREBASE_HOSTING.md  # Como fazer deploy
README.md                   # Este arquivo
```

## 🎯 Dados Salvos

**LocalStorage (offline):**
- `vh_teams` - Times
- `vh_players` - Jogadores  
- `vh_games` - Todos os jogos
- `vh_champion` - Campeão atual

**Firebase Realtime Database:**
- `live_scores/{gameId}` - Score em tempo real

**Firebase Firestore:**
- `historico_jogos` - Histórico permanente

## 🛠️ Desenvolvimento

### Editar código
1. Abra `volei-hub.html` em editor
2. Faça mudanças
3. Recarregue o navegador
4. Para deploy: `firebase deploy`

### Estrutura do código
```javascript
// CONFIG
- TEAM_COLORS
- Variáveis de estado (teams, games, players)

// CORE FUNCTIONS
- save() / ls() - Armazenamento local
- renderGames() - Bracket
- setWinner() - Marcar resultado
- addPt() - Adicionar ponto (placar ao vivo)

// FIREBASE
- fbSync.syncScore() - Sync de score
- fbSync.saveGameHistory() - Salvar resultado
- fbSync.loadGameHistory() - Carregar histórico

// UI
- renderTeams()
- renderPlayers()
- renderLive()
- renderBracket()
```

## 📋 To-Do (Futuras Atualizações)

- [ ] Autenticação Google
- [ ] Perfil de usuário
- [ ] Estatísticas jogador
- [ ] Ranking global
- [ ] Notificações push
- [ ] PWA offline
- [ ] Dark mode toggle
- [ ] Exportar PDF/Excel

## 🤝 Contribuições

Bugs, ideias ou melhorias? Fale comigo!

## 📞 Suporte

- Firebase: https://firebase.google.com/docs
- Volei: www.cbv.com.br

---

**Versão:** 1.0 | **Data:** Abril 2026 | **Status:** Production Ready ✅
