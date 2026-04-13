import { useState, useEffect, useRef } from "react";

// ─── Firebase Config (substituir com suas credenciais) ───────────────────────
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// ─── Simulação de dados locais (sem Firebase real no preview) ────────────────
const useLocalStorage = (key, initial) => {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch { return initial; }
  });
  const set = (v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  return [val, set];
};

// ─── Constantes ───────────────────────────────────────────────────────────────
const POSITIONS = ["Líbero", "Central", "Oposto", "Ponteiro", "Levantador", "Ponta"];
const EXPERIENCE = ["Iniciante", "Intermediário", "Intermediário+", "Avançado"];
const TEAM_COLORS = [
  { name: "Vermelho", hex: "#EF4444", light: "#FEE2E2" },
  { name: "Azul", hex: "#3B82F6", light: "#DBEAFE" },
  { name: "Verde", hex: "#10B981", light: "#D1FAE5" },
  { name: "Laranja", hex: "#F97316", light: "#FED7AA" },
  { name: "Roxo", hex: "#8B5CF6", light: "#EDE9FE" },
  { name: "Rosa", hex: "#EC4899", light: "#FCE7F3" },
  { name: "Amarelo", hex: "#EAB308", light: "#FEF9C3" },
  { name: "Ciano", hex: "#06B6D4", light: "#CFFAFE" },
];

const EXP_COLOR = {
  "Iniciante": "#10B981",
  "Intermediário": "#3B82F6",
  "Intermediário+": "#8B5CF6",
  "Avançado": "#EF4444",
};

// ─── Icons SVG ────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 24, color = "currentColor" }) => {
  const icons = {
    volleyball: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 6.3 17.7"/><path d="M12 2a10 10 0 0 0-6.3 17.7"/><path d="M2.5 8.5h19"/><path d="M12 2v20"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    score: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    teams: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    games: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    flash: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    minus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    back: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>,
    swap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="17,1 21,5 17,9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7,23 3,19 7,15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="8,21 12,21 16,21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H17L17 11a5 5 0 0 1-10 0z"/><path d="M5 9H3a2 2 0 0 1-2-2V5h6"/><path d="M19 9h2a2 2 0 0 0 2-2V5h-6"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>,
    save: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>,
    rotate: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    history: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4.3L1 10"/><polyline points="1 4 1 10 7 10"/></svg>,
    table: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  };
  return icons[name] || null;
};

// ─── Modal Component ──────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,20,60,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: "#0A1628", border: "1px solid rgba(59,130,246,0.3)",
        borderRadius: 20, padding: "28px 24px", width: "100%",
        maxWidth: wide ? 560 : 400, maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#F0F4FF", fontFamily: "'Exo 2', sans-serif", fontSize: 20, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: 4 }}>
            <Icon name="close" size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── Input Component ──────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, type = "text", placeholder, options, required }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", color: "#94A3B8", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}{required && " *"}</label>}
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", background: "#0D1F3C", border: "1.5px solid rgba(59,130,246,0.25)",
        borderRadius: 10, padding: "10px 14px", color: "#F0F4FF", fontSize: 15,
        fontFamily: "'Exo 2', sans-serif", outline: "none", cursor: "pointer",
      }}>
        <option value="">Selecionar...</option>
        {options.map(o => <option key={typeof o === "object" ? o.value : o} value={typeof o === "object" ? o.value : o}>{typeof o === "object" ? o.label : o}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: "100%", background: "#0D1F3C", border: "1.5px solid rgba(59,130,246,0.25)",
          borderRadius: 10, padding: "10px 14px", color: "#F0F4FF", fontSize: 15,
          fontFamily: "'Exo 2', sans-serif", outline: "none", boxSizing: "border-box",
        }} />
    )}
  </div>
);

// ─── Btn Component ────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, color = "#1D4ED8", text = "#fff", full, small, disabled, outline }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: outline ? "transparent" : color,
    border: outline ? `2px solid ${color}` : "none",
    color: outline ? color : text,
    borderRadius: 12, padding: small ? "8px 16px" : "12px 20px",
    fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: small ? 13 : 15,
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
    width: full ? "100%" : "auto", display: "inline-flex",
    alignItems: "center", gap: 8, justifyContent: "center",
    transition: "all 0.2s", letterSpacing: "0.03em",
  }}>{children}</button>
);

// ─── Badge Component ──────────────────────────────────────────────────────────
const Badge = ({ label, color }) => (
  <span style={{
    background: color + "22", color, border: `1px solid ${color}44`,
    borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700,
    letterSpacing: "0.05em", textTransform: "uppercase",
  }}>{label}</span>
);

// ─── Loading Screen ───────────────────────────────────────────────────────────
const LoadingScreen = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#030D1F",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Exo 2', sans-serif", zIndex: 9999,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(0.95)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wave { 0%,100%{transform:scaleY(0.5)} 50%{transform:scaleY(1.5)} }
      `}</style>
      <div style={{ animation: "pulse 1.5s ease-in-out infinite", marginBottom: 24 }}>
        <div style={{
          width: 100, height: 100, borderRadius: "50%",
          background: "radial-gradient(circle at 40% 40%, #1D4ED8, #0A1628)",
          border: "3px solid #3B82F6", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(59,130,246,0.5)",
        }}>
          <Icon name="volleyball" size={52} color="#EAB308" />
        </div>
      </div>
      <div style={{ animation: "fadeUp 0.5s 0.3s both" }}>
        <h1 style={{ color: "#F0F4FF", fontSize: 38, fontWeight: 900, margin: 0, letterSpacing: "-0.02em" }}>
          Volei<span style={{ color: "#EAB308" }}>Hub</span>
        </h1>
        <p style={{ color: "#3B82F6", fontSize: 13, textAlign: "center", margin: "6px 0 0", letterSpacing: "0.15em", textTransform: "uppercase" }}>Sistema Voleibosístico</p>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 36 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            width: 6, height: 24, background: "#1D4ED8", borderRadius: 3,
            animation: `wave 1s ${i * 0.15}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    </div>
  );
};



// ─── Nav Bar ──────────────────────────────────────────────────────────────────
const NavBar = ({ current, onChange }) => {
  const tabs = [
    { id: "home", icon: "home", label: "Início" },
    { id: "score", icon: "score", label: "Placar" },
    { id: "teams", icon: "teams", label: "Times" },
    { id: "games", icon: "games", label: "Jogos" },
  ];
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,22,40,0.95)", backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(59,130,246,0.2)",
      display: "flex", padding: "8px 0 calc(8px + env(safe-area-inset-bottom))",
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: 1, background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          padding: "6px 0", transition: "all 0.2s",
          color: current === t.id ? "#EAB308" : "#475569",
        }}>
          <div style={{
            padding: "6px 16px", borderRadius: 12,
            background: current === t.id ? "rgba(234,179,8,0.12)" : "transparent",
            transition: "all 0.2s",
          }}>
            <Icon name={t.icon} size={22} color={current === t.id ? "#EAB308" : "#475569"} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
};

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
const HomeScreen = ({ onNavigate, admin, teams, games, players, onLoginPress, onLogout }) => {
  const today = new Date().toISOString().split("T")[0];
  const todayGames = games.filter(g => g.date === today);

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0D1F3C 100%)",
        padding: "60px 24px 32px", borderBottom: "1px solid rgba(59,130,246,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #1D4ED8, #0A1628)", border: "2px solid #3B82F6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(59,130,246,0.4)", fontSize: 28 }}>
              🏐
            </div>
            <div>
              <h1 style={{ color: "#F0F4FF", fontFamily: "'Exo 2',sans-serif", fontSize: 26, fontWeight: 900, margin: 0 }}>Volei<span style={{ color: "#EAB308" }}>Hub</span></h1>
              <p style={{ color: "#3B82F6", fontSize: 10, margin: 0, letterSpacing: "0.12em", textTransform: "uppercase" }}>Sistema Voleibosístico</p>
            </div>
          </div>
          {admin ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#EAB308", fontSize: 11, fontWeight: 700 }}>ADM</div>
                <div style={{ color: "#475569", fontSize: 10 }}>UNIP</div>
              </div>
              <button onClick={onLogout} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: 8, cursor: "pointer" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          ) : (
            <button onClick={onLoginPress} style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 12, padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span style={{ color: "#3B82F6", fontSize: 12, fontWeight: 700, fontFamily: "'Exo 2',sans-serif" }}>ADM</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "20px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { label: "Times", val: teams.length, icon: "teams", color: "#3B82F6" },
          { label: "Jogadores", val: players.length, icon: "user", color: "#EAB308" },
          { label: "Jogos", val: games.length, icon: "games", color: "#10B981" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#0A1628", borderRadius: 16, padding: "16px 12px",
            border: `1px solid ${s.color}33`, textAlign: "center",
          }}>
            <Icon name={s.icon} size={20} color={s.color} />
            <div style={{ color: "#F0F4FF", fontSize: 24, fontWeight: 900, fontFamily: "'Exo 2',sans-serif", margin: "6px 0 2px" }}>{s.val}</div>
            <div style={{ color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main Buttons */}
      <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { label: "Placar", sub: "Ao vivo", icon: "score", color: "#1D4ED8", screen: "score" },
          { label: "Times", sub: "Gerenciar", icon: "teams", color: "#065F46", screen: "teams" },
          { label: "Jogos", sub: "Agenda", icon: "games", color: "#92400E", screen: "games" },
          { label: "Jogo Rápido", sub: "Começar agora", icon: "flash", color: "#7C3AED", screen: "quickgame" },
        ].map(btn => (
          <button key={btn.label} onClick={() => onNavigate(btn.screen)} style={{
            background: `linear-gradient(135deg, ${btn.color}ee, ${btn.color}99)`,
            border: `1px solid ${btn.color}`, borderRadius: 18,
            padding: "22px 18px", cursor: "pointer", textAlign: "left",
            boxShadow: `0 8px 24px ${btn.color}44`, transition: "transform 0.15s, box-shadow 0.15s",
          }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <Icon name={btn.icon} size={28} color="#fff" />
            <div style={{ color: "#fff", fontFamily: "'Exo 2',sans-serif", fontSize: 18, fontWeight: 800, marginTop: 10 }}>{btn.label}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 }}>{btn.sub}</div>
          </button>
        ))}
      </div>

      {/* Today's Games */}
      <div style={{ padding: "0 24px 20px" }}>
        <h3 style={{ color: "#94A3B8", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Jogos de Hoje</h3>
        {todayGames.length === 0 ? (
          <div style={{ background: "#0A1628", borderRadius: 14, padding: "20px", border: "1px dashed rgba(59,130,246,0.2)", textAlign: "center", color: "#475569", fontSize: 14 }}>
            Nenhum jogo agendado para hoje
          </div>
        ) : todayGames.map(g => {
          const t1 = teams.find(t => t.id === g.team1Id);
          const t2 = teams.find(t => t.id === g.team2Id);
          return (
            <div key={g.id} style={{
              background: "#0A1628", borderRadius: 14, padding: "14px 16px",
              border: "1px solid rgba(59,130,246,0.2)", marginBottom: 8,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <span style={{ color: t1?.color || "#fff", fontWeight: 700, fontFamily: "'Exo 2',sans-serif" }}>{t1?.name || "?"}</span>
                <span style={{ color: "#475569", margin: "0 8px", fontSize: 12 }}>vs</span>
                <span style={{ color: t2?.color || "#fff", fontWeight: 700, fontFamily: "'Exo 2',sans-serif" }}>{t2?.name || "?"}</span>
              </div>
              <Badge label={g.type} color="#3B82F6" />
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ─── QUICK GAME (self-contained: setup + live) ────────────────────────────────
const QuickGameSetup = ({ onCancel }) => {
  const [phase, setPhase] = useState("setup"); // setup | live
  const [nameA, setNameA] = useState("Time A");
  const [nameB, setNameB] = useState("Time B");
  const [colorA, setColorA] = useState(1); // index into TEAM_COLORS
  const [colorB, setColorB] = useState(0);
  const [config, setConfig] = useState({ sets: 3, maxPoints: 25 });
  const [score, setScore] = useState({ sets: [{ a: 0, b: 0 }], currentSet: 0, setsA: 0, setsB: 0 });
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  const teamA = { name: nameA, color: TEAM_COLORS[colorA].hex };
  const teamB = { name: nameB, color: TEAM_COLORS[colorB].hex };

  const addPoint = (side) => {
    if (finished) return;
    setScore(prev => {
      const sets = [...prev.sets];
      const cur = { ...sets[prev.currentSet] };
      cur[side]++;
      const need = config.maxPoints;
      const maxSets = Math.ceil(config.sets / 2);
      let setsA = prev.setsA, setsB = prev.setsB;
      const diff = Math.abs(cur.a - cur.b);
      const won = cur[side] >= need && diff >= 2;
      if (won) {
        if (side === "a") setsA++; else setsB++;
        sets[prev.currentSet] = cur;
        if (setsA >= maxSets || setsB >= maxSets) { setFinished(true); return { ...prev, sets, setsA, setsB }; }
        sets.push({ a: 0, b: 0 });
        return { sets, currentSet: prev.currentSet + 1, setsA, setsB };
      }
      sets[prev.currentSet] = cur;
      return { ...prev, sets, setsA, setsB };
    });
  };

  const undoPoint = (side) => {
    if (finished) return;
    setScore(prev => {
      const sets = [...prev.sets];
      const cur = { ...sets[prev.currentSet] };
      if (cur[side] > 0) cur[side]--;
      sets[prev.currentSet] = cur;
      return { ...prev, sets };
    });
  };

  const startGame = () => {
    setScore({ sets: [{ a: 0, b: 0 }], currentSet: 0, setsA: 0, setsB: 0 });
    setFinished(false);
    setFlipped(false);
    setPhase("live");
  };

  // ── Setup Screen ──
  if (phase === "setup") return (
    <div style={{ paddingBottom: 90, fontFamily: "'Exo 2',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #0A1628, #0D1F3C)", padding: "56px 24px 24px", borderBottom: "1px solid rgba(124,58,237,0.3)" }}>
        <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontFamily: "'Exo 2',sans-serif" }}>
          <Icon name="back" size={18} color="#94A3B8" /> Voltar
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(124,58,237,0.2)", border: "2px solid #7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="flash" size={24} color="#A78BFA" />
          </div>
          <div>
            <h1 style={{ color: "#F0F4FF", fontSize: 24, fontWeight: 900, margin: 0 }}>Jogo Rápido</h1>
            <p style={{ color: "#7C3AED", fontSize: 12, margin: 0, fontWeight: 600 }}>Sem cadastro — começa agora</p>
          </div>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {[
          { label: "Time de Cima", name: nameA, setName: setNameA, ci: colorA, setC: setColorA },
          { label: "Time de Baixo", name: nameB, setName: setNameB, ci: colorB, setC: setColorB },
        ].map((t, idx) => (
          <div key={idx} style={{ background: "#0A1628", borderRadius: 16, padding: 20, border: `2px solid ${TEAM_COLORS[t.ci].hex}55`, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: TEAM_COLORS[t.ci].hex }} />
              <span style={{ color: "#94A3B8", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.label}</span>
            </div>
            <Input label="Nome" value={t.name} onChange={t.setName} placeholder={idx === 0 ? "Time A" : "Time B"} />
            <label style={{ display: "block", color: "#94A3B8", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Cor</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TEAM_COLORS.map((c, i) => (
                <button key={i} onClick={() => t.setC(i)} style={{ width: 34, height: 34, borderRadius: "50%", background: c.hex, border: t.ci === i ? "3px solid #fff" : "3px solid transparent", cursor: "pointer", outline: "none", transition: "transform 0.15s", transform: t.ci === i ? "scale(1.15)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: "#0A1628", borderRadius: 16, padding: 20, border: "1px solid rgba(59,130,246,0.2)", marginBottom: 24 }}>
          <h3 style={{ color: "#94A3B8", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 14px" }}>Configuração</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Sets" value={String(config.sets)} onChange={v => setConfig(c => ({ ...c, sets: Number(v) }))} options={["1","3","5"].map(v => ({ value: v, label: "Melhor de " + v }))} />
            <Input label="Pontos" value={String(config.maxPoints)} onChange={v => setConfig(c => ({ ...c, maxPoints: Number(v) }))} options={["15","21","25"].map(v => ({ value: v, label: v + " pts" }))} />
          </div>
        </div>

        {/* Preview */}
        <div style={{ background: "#0A1628", borderRadius: 14, padding: "14px 20px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <span style={{ color: TEAM_COLORS[colorA].hex, fontWeight: 800, fontSize: 16 }}>{nameA || "Time A"}</span>
          <span style={{ color: "#475569", fontSize: 13 }}>vs</span>
          <span style={{ color: TEAM_COLORS[colorB].hex, fontWeight: 800, fontSize: 16 }}>{nameB || "Time B"}</span>
        </div>

        <Btn onClick={startGame} color="#7C3AED" full>
          <Icon name="flash" size={20} /> Começar Agora
        </Btn>
      </div>
    </div>
  );

  // ── Live Scoreboard ──
  const curSet = score.sets[score.currentSet] || { a: 0, b: 0 };
  const dA = flipped ? teamB : teamA;
  const dB = flipped ? teamA : teamB;
  const sA = flipped ? curSet.b : curSet.a;
  const sB = flipped ? curSet.a : curSet.b;
  const setsWonA = flipped ? score.setsB : score.setsA;
  const setsWonB = flipped ? score.setsA : score.setsB;
  const winner = finished ? (score.setsA > score.setsB ? teamA : teamB) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#020810", fontFamily: "'Exo 2',sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "50px 20px 16px" }}>
        <button onClick={() => setPhase("setup")} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: 10, cursor: "pointer" }}>
          <Icon name="back" size={20} color="#fff" />
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#EAB308", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>⚡ Jogo Rápido</div>
          <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>
            Set {score.currentSet + 1}/{config.sets} · {setsWonA}–{setsWonB} sets
          </div>
        </div>
        <button onClick={() => setFlipped(f => !f)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: 10, cursor: "pointer" }}>
          <Icon name="swap" size={18} color="#fff" />
        </button>
      </div>

      {/* Winner banner */}
      {finished && (
        <div style={{ margin: "0 20px 16px", background: "#EAB30822", borderRadius: 14, padding: 16, textAlign: "center", border: "1px solid #EAB30866" }}>
          <Icon name="trophy" size={28} color="#EAB308" />
          <div style={{ color: "#EAB308", fontWeight: 900, fontSize: 20, margin: "6px 0 10px" }}>🏆 {winner?.name} venceu!</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Btn onClick={() => { setPhase("setup"); setFinished(false); }} color="#475569" small>Nova Partida</Btn>
            <Btn onClick={onCancel} color="#1D4ED8" small>Início</Btn>
          </div>
        </div>
      )}

      {/* Score Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Team A (top) */}
        <div style={{ flex: 1, background: `linear-gradient(135deg, ${dA.color}33 0%, #020810 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ color: dA.color, fontWeight: 900, fontSize: 15, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{dA.name}</div>
          <div style={{ color: "#F0F4FF", fontSize: 100, fontWeight: 900, lineHeight: 1 }}>{sA}</div>
          {!finished && (
            <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
              <button onClick={() => undoPoint(flipped ? "b" : "a")} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 12, width: 50, height: 50, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="minus" size={20} color="#EF4444" />
              </button>
              <button onClick={() => addPoint(flipped ? "b" : "a")} style={{ background: `${dA.color}33`, border: `2px solid ${dA.color}`, borderRadius: 16, width: 86, height: 86, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="plus" size={32} color={dA.color} />
              </button>
            </div>
          )}
        </div>

        <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #3B82F6, transparent)" }} />

        {/* Team B (bottom) */}
        <div style={{ flex: 1, background: `linear-gradient(315deg, ${dB.color}33 0%, #020810 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
          {!finished && (
            <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
              <button onClick={() => undoPoint(flipped ? "a" : "b")} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 12, width: 50, height: 50, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="minus" size={20} color="#EF4444" />
              </button>
              <button onClick={() => addPoint(flipped ? "a" : "b")} style={{ background: `${dB.color}33`, border: `2px solid ${dB.color}`, borderRadius: 16, width: 86, height: 86, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="plus" size={32} color={dB.color} />
              </button>
            </div>
          )}
          <div style={{ color: "#F0F4FF", fontSize: 100, fontWeight: 900, lineHeight: 1 }}>{sB}</div>
          <div style={{ color: dB.color, fontWeight: 900, fontSize: 15, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 8 }}>{dB.name}</div>
        </div>
      </div>

      {/* Sets history */}
      <div style={{ padding: "12px 20px 24px", display: "flex", gap: 8, justifyContent: "center" }}>
        {score.sets.map((s, i) => (
          <div key={i} style={{ background: i === score.currentSet ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)", borderRadius: 10, padding: "6px 12px", border: i === score.currentSet ? "1px solid #3B82F6" : "1px solid transparent", fontSize: 13, color: "#94A3B8", fontWeight: 700 }}>
            {flipped ? s.b : s.a}–{flipped ? s.a : s.b}
          </div>
        ))}
      </div>
    </div>
  );
};
// ─── SCORE SCREEN ─────────────────────────────────────────────────────────────
const ScoreScreen = ({ teams, games, onSaveResult }) => {
  const [mode, setMode] = useState("menu"); // menu | setup | live | history
  const [selectedGame, setSelectedGame] = useState(null);
  const [config, setConfig] = useState({ sets: 3, maxPoints: 25 });
  const [score, setScore] = useState({ sets: [{ a: 0, b: 0 }], currentSet: 0, setsA: 0, setsB: 0 });
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);
  const [history, setHistory] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  const addPoint = (side) => {
    if (finished) return;
    setScore(prev => {
      const sets = [...prev.sets];
      const cur = { ...sets[prev.currentSet] };
      cur[side]++;
      const need = config.maxPoints;
      const maxSets = Math.ceil(config.sets / 2);
      let setsA = prev.setsA, setsB = prev.setsB, nextSet = prev.currentSet;
      const diff = Math.abs(cur.a - cur.b);
      const won = (cur[side] >= need && diff >= 2);
      if (won) {
        if (side === "a") setsA++;
        else setsB++;
        sets[prev.currentSet] = cur;
        if (setsA >= maxSets || setsB >= maxSets) { setFinished(true); return { ...prev, sets, setsA, setsB }; }
        sets.push({ a: 0, b: 0 });
        nextSet = prev.currentSet + 1;
        return { sets, currentSet: nextSet, setsA, setsB };
      }
      sets[prev.currentSet] = cur;
      return { ...prev, sets, setsA, setsB };
    });
  };

  const undoPoint = (side) => {
    if (finished) return;
    setScore(prev => {
      const sets = [...prev.sets];
      const cur = { ...sets[prev.currentSet] };
      if (cur[side] > 0) cur[side]--;
      sets[prev.currentSet] = cur;
      return { ...prev, sets };
    });
  };

  const startGame = (game) => {
    const t1 = teams.find(t => t.id === game.team1Id);
    const t2 = teams.find(t => t.id === game.team2Id);
    setTeamA(t1); setTeamB(t2);
    setSelectedGame(game);
    setScore({ sets: [{ a: 0, b: 0 }], currentSet: 0, setsA: 0, setsB: 0 });
    setFinished(false);
    setMode("live");
  };

  const startQuick = () => {
    setTeamA(teams[0] || { name: "Time A", color: "#3B82F6" });
    setTeamB(teams[1] || { name: "Time B", color: "#EF4444" });
    setSelectedGame(null);
    setScore({ sets: [{ a: 0, b: 0 }], currentSet: 0, setsA: 0, setsB: 0 });
    setFinished(false);
    setMode("live");
  };

  const curSet = score.sets[score.currentSet] || { a: 0, b: 0 };
  const displayA = flipped ? teamB : teamA;
  const displayB = flipped ? teamA : teamB;
  const scoreA = flipped ? curSet.b : curSet.a;
  const scoreB = flipped ? curSet.a : curSet.b;

  const todayGames = games.filter(g => g.date === new Date().toISOString().split("T")[0] && !g.result);

  if (mode === "quicksetup") {
    return (
      <QuickGameSetup
        config={config}
        setConfig={setConfig}
        onCancel={() => setMode("menu")}
        onStart={(tA, tB) => {
          setTeamA(tA); setTeamB(tB);
          setSelectedGame(null);
          setScore({ sets: [{ a: 0, b: 0 }], currentSet: 0, setsA: 0, setsB: 0 });
          setFinished(false);
          setMode("live");
        }}
      />
    );
  }

  if (mode === "live") {
    const winner = finished ? (score.setsA > score.setsB ? displayA : displayB) : null;
    return (
      <div style={{ minHeight: "100vh", background: "#020810", fontFamily: "'Exo 2',sans-serif", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "50px 20px 16px" }}>
          <button onClick={() => setMode("menu")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: 10, cursor: "pointer", color: "#fff" }}>
            <Icon name="back" size={20} color="#fff" />
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#64748B", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Set {score.currentSet + 1} de {config.sets}
            </div>
            <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 2 }}>
              {score.setsA} – {score.setsB} <span style={{ color: "#475569", fontSize: 10 }}>sets</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setFlipped(f => !f)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: 10, cursor: "pointer" }}>
              <Icon name="swap" size={18} color="#fff" />
            </button>
          </div>
        </div>

        {finished && (
          <div style={{ margin: "0 20px 16px", background: "#EAB30822", borderRadius: 14, padding: "14px", textAlign: "center", border: "1px solid #EAB30866" }}>
            <Icon name="trophy" size={28} color="#EAB308" />
            <div style={{ color: "#EAB308", fontWeight: 900, fontSize: 20, marginTop: 6 }}>🏆 {winner?.name} venceu!</div>
            <Btn onClick={() => { onSaveResult && onSaveResult(selectedGame?.id, score); setMode("menu"); }} color="#EAB308" text="#000" small>
              <Icon name="save" size={16} /> Salvar e Sair
            </Btn>
          </div>
        )}

        {/* Score Display */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Team A */}
          <div style={{ flex: 1, background: `linear-gradient(135deg, ${displayA?.color || "#1D4ED8"}33 0%, #020810 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
            <div style={{ color: displayA?.color || "#3B82F6", fontWeight: 900, fontSize: 16, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{displayA?.name || "Time A"}</div>
            <div style={{ color: "#F0F4FF", fontSize: 96, fontWeight: 900, lineHeight: 1 }}>{scoreA}</div>
            {!finished && (
              <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                <button onClick={() => undoPoint(flipped ? "b" : "a")} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 12, width: 52, height: 52, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="minus" size={20} color="#EF4444" />
                </button>
                <button onClick={() => addPoint(flipped ? "b" : "a")} style={{ background: `${displayA?.color || "#1D4ED8"}33`, border: `2px solid ${displayA?.color || "#1D4ED8"}`, borderRadius: 16, width: 88, height: 88, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900, color: displayA?.color || "#3B82F6" }}>
                  <Icon name="plus" size={32} color={displayA?.color || "#3B82F6"} />
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #3B82F6, transparent)" }} />

          {/* Team B */}
          <div style={{ flex: 1, background: `linear-gradient(315deg, ${displayB?.color || "#EF4444"}33 0%, #020810 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
            {!finished && (
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <button onClick={() => undoPoint(flipped ? "a" : "b")} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 12, width: 52, height: 52, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="minus" size={20} color="#EF4444" />
                </button>
                <button onClick={() => addPoint(flipped ? "a" : "b")} style={{ background: `${displayB?.color || "#EF4444"}33`, border: `2px solid ${displayB?.color || "#EF4444"}`, borderRadius: 16, width: 88, height: 88, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="plus" size={32} color={displayB?.color || "#EF4444"} />
                </button>
              </div>
            )}
            <div style={{ color: "#F0F4FF", fontSize: 96, fontWeight: 900, lineHeight: 1 }}>{scoreB}</div>
            <div style={{ color: displayB?.color || "#EF4444", fontWeight: 900, fontSize: 16, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 8 }}>{displayB?.name || "Time B"}</div>
          </div>
        </div>

        {/* Sets history */}
        <div style={{ padding: "12px 20px 20px", display: "flex", gap: 8, justifyContent: "center" }}>
          {score.sets.map((s, i) => (
            <div key={i} style={{ background: i === score.currentSet ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)", borderRadius: 10, padding: "6px 12px", border: i === score.currentSet ? "1px solid #3B82F6" : "1px solid transparent", fontSize: 13, color: "#94A3B8", fontWeight: 700 }}>
              {flipped ? s.b : s.a}–{flipped ? s.a : s.b}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Score menu
  return (
    <div style={{ paddingBottom: 90, fontFamily: "'Exo 2',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #0A1628, #0D1F3C)", padding: "60px 24px 24px", borderBottom: "1px solid rgba(59,130,246,0.15)" }}>
        <h1 style={{ color: "#F0F4FF", fontSize: 26, fontWeight: 900, margin: "0 0 4px" }}>Placar</h1>
        <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>Controle de pontuação ao vivo</p>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {/* Config */}
        <div style={{ background: "#0A1628", borderRadius: 16, padding: "18px", border: "1px solid rgba(59,130,246,0.2)", marginBottom: 20 }}>
          <h3 style={{ color: "#94A3B8", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 14px" }}>Configuração do Jogo</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Sets" value={String(config.sets)} onChange={v => setConfig(c => ({ ...c, sets: Number(v) }))} options={["1","3","5"].map(v => ({ value: v, label: `Melhor de ${v}` }))} />
            <Input label="Pontos por Set" value={String(config.maxPoints)} onChange={v => setConfig(c => ({ ...c, maxPoints: Number(v) }))} options={["15","21","25"].map(v => ({ value: v, label: v + " pts" }))} />
          </div>
        </div>

        {/* Quick game */}
        <button onClick={() => setMode("quicksetup")} style={{
          width: "100%", background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
          border: "none", borderRadius: 16, padding: "18px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 14, marginBottom: 16,
          boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
        }}>
          <Icon name="flash" size={28} color="#fff" />
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>Jogo Rápido</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Escolha nomes e cores — sem cadastro</div>
          </div>
        </button>

        {/* Today's games */}
        <h3 style={{ color: "#94A3B8", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "20px 0 12px" }}>Jogos de Hoje</h3>
        {todayGames.length === 0 ? (
          <div style={{ background: "#0A1628", borderRadius: 14, padding: "20px", border: "1px dashed rgba(59,130,246,0.2)", textAlign: "center", color: "#475569", fontSize: 14 }}>
            Nenhum jogo agendado para hoje
          </div>
        ) : todayGames.map(g => {
          const t1 = teams.find(t => t.id === g.team1Id);
          const t2 = teams.find(t => t.id === g.team2Id);
          return (
            <div key={g.id} style={{ background: "#0A1628", borderRadius: 14, padding: "14px 16px", border: "1px solid rgba(59,130,246,0.2)", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: t1?.color || "#fff", fontWeight: 700, fontSize: 15 }}>{t1?.name || "?"}</span>
                  <span style={{ color: "#475569", fontSize: 12 }}>vs</span>
                  <span style={{ color: t2?.color || "#fff", fontWeight: 700, fontSize: 15 }}>{t2?.name || "?"}</span>
                </div>
                <Badge label={g.type} color="#3B82F6" />
              </div>
              <Btn onClick={() => startGame(g)} color="#1D4ED8" small>Iniciar</Btn>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── TEAMS SCREEN ─────────────────────────────────────────────────────────────
const TeamsScreen = ({ teams, setTeams, players, setPlayers, games, isAdmin }) => {
  const [view, setView] = useState("list"); // list | detail
  const [selTeam, setSelTeam] = useState(null);
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [showNewPlayer, setShowNewPlayer] = useState(false);
  const [showPlayerDetail, setShowPlayerDetail] = useState(null);
  const [newTeam, setNewTeam] = useState({ name: "", colorIdx: 0 });
  const [newPlayer, setNewPlayer] = useState({ name: "", height: "", position: "", experience: "", teamId: "" });

  const createTeam = () => {
    if (!newTeam.name.trim()) return;
    const col = TEAM_COLORS[newTeam.colorIdx];
    const t = { id: Date.now(), name: newTeam.name, color: col.hex, colorName: col.name, captain: null };
    setTeams(prev => [...prev, t]);
    setNewTeam({ name: "", colorIdx: 0 });
    setShowNewTeam(false);
  };

  const createPlayer = () => {
    if (!newPlayer.name.trim() || !newPlayer.position || !newPlayer.experience) return;
    const p = { id: Date.now(), ...newPlayer, height: newPlayer.height || "–" };
    setPlayers(prev => [...prev, p]);
    setNewPlayer({ name: "", height: "", position: "", experience: "", teamId: selTeam?.id || "" });
    setShowNewPlayer(false);
  };

  const setCaptain = (teamId, playerId) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, captain: playerId } : t));
  };

  const removePlayer = (pid) => {
    setPlayers(prev => prev.filter(p => p.id !== pid));
    setShowPlayerDetail(null);
  };

  const teamPlayers = (teamId) => players.filter(p => p.teamId === teamId);

  const teamHistory = (teamId) => games.filter(g => (g.team1Id === teamId || g.team2Id === teamId) && g.result);

  if (view === "detail" && selTeam) {
    const tp = teamPlayers(selTeam.id);
    const th = teamHistory(selTeam.id);
    return (
      <div style={{ paddingBottom: 90, fontFamily: "'Exo 2',sans-serif" }}>
        <div style={{ background: `linear-gradient(135deg, ${selTeam.color}44, #0A1628)`, padding: "60px 24px 24px", borderBottom: `1px solid ${selTeam.color}44` }}>
          <button onClick={() => setView("list")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <Icon name="back" size={18} color="#fff" /> Voltar
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: selTeam.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="teams" size={24} color="#fff" />
            </div>
            <div>
              <h1 style={{ color: "#F0F4FF", fontSize: 24, fontWeight: 900, margin: 0 }}>{selTeam.name}</h1>
              <span style={{ color: selTeam.color, fontSize: 12, fontWeight: 600 }}>{tp.length} jogador{tp.length !== 1 ? "es" : ""}</span>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {isAdmin && (
            <Btn onClick={() => { setNewPlayer(p => ({ ...p, teamId: selTeam.id })); setShowNewPlayer(true); }} color={selTeam.color} full>
              <Icon name="plus" size={18} /> Adicionar Jogador
            </Btn>
          )}

          <h3 style={{ color: "#94A3B8", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "20px 0 12px" }}>Jogadores</h3>
          {tp.length === 0 && <div style={{ color: "#475569", textAlign: "center", padding: 20, fontSize: 14 }}>Nenhum jogador cadastrado</div>}
          {tp.map(p => (
            <div key={p.id} onClick={() => setShowPlayerDetail(p)} style={{
              background: "#0A1628", borderRadius: 14, padding: "14px 16px", border: `1px solid ${selTeam.color}33`,
              marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: selTeam.color + "33", border: `2px solid ${selTeam.color}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="user" size={18} color={selTeam.color} />
                </div>
                <div>
                  <div style={{ color: "#F0F4FF", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
                    {p.name}
                    {selTeam.captain === p.id && <Icon name="star" size={14} color="#EAB308" />}
                  </div>
                  <div style={{ color: "#64748B", fontSize: 12 }}>{p.position} · {p.height}cm</div>
                </div>
              </div>
              <Badge label={p.experience} color={EXP_COLOR[p.experience] || "#3B82F6"} />
            </div>
          ))}

          <h3 style={{ color: "#94A3B8", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "20px 0 12px" }}>
            <Icon name="history" size={14} color="#94A3B8" /> Histórico de Partidas
          </h3>
          {th.length === 0 ? (
            <div style={{ color: "#475569", textAlign: "center", padding: 20, fontSize: 14 }}>Sem partidas registradas</div>
          ) : th.map(g => {
            const opp = g.team1Id === selTeam.id ? g.team2Id : g.team1Id;
            const oppTeam = { id: opp }; // simplified
            const won = g.result?.winner === selTeam.id;
            return (
              <div key={g.id} style={{ background: "#0A1628", borderRadius: 14, padding: "12px 16px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ color: "#94A3B8", fontSize: 13 }}>{g.date}</div>
                <Badge label={won ? "Vitória" : "Derrota"} color={won ? "#10B981" : "#EF4444"} />
              </div>
            );
          })}
        </div>

        {/* Player Detail Modal */}
        <Modal open={!!showPlayerDetail} onClose={() => setShowPlayerDetail(null)} title="Perfil do Jogador">
          {showPlayerDetail && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: selTeam.color + "33", border: `2px solid ${selTeam.color}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Icon name="user" size={30} color={selTeam.color} />
                </div>
                <h2 style={{ color: "#F0F4FF", margin: "0 0 4px", fontFamily: "'Exo 2',sans-serif" }}>{showPlayerDetail.name}</h2>
                {selTeam.captain === showPlayerDetail.id && <Badge label="Capitão" color="#EAB308" />}
              </div>
              {[
                ["Altura", showPlayerDetail.height ? showPlayerDetail.height + " cm" : "–"],
                ["Posição", showPlayerDetail.position],
                ["Experiência", showPlayerDetail.experience],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color: "#64748B", fontSize: 14 }}>{k}</span>
                  <span style={{ color: "#F0F4FF", fontSize: 14, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              {isAdmin && (
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <Btn onClick={() => { setCaptain(selTeam.id, showPlayerDetail.id); setShowPlayerDetail(null); }} color="#EAB308" text="#000" full small>
                    <Icon name="star" size={14} color="#000" /> Definir Capitão
                  </Btn>
                  <Btn onClick={() => removePlayer(showPlayerDetail.id)} color="#EF4444" full small>
                    <Icon name="trash" size={14} /> Remover
                  </Btn>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* New Player Modal */}
        <Modal open={showNewPlayer} onClose={() => setShowNewPlayer(false)} title="Novo Jogador">
          <Input label="Nome *" value={newPlayer.name} onChange={v => setNewPlayer(p => ({ ...p, name: v }))} placeholder="Nome completo" />
          <Input label="Altura (cm)" value={newPlayer.height} onChange={v => setNewPlayer(p => ({ ...p, height: v }))} placeholder="Ex: 185" type="number" />
          <Input label="Posição *" value={newPlayer.position} onChange={v => setNewPlayer(p => ({ ...p, position: v }))} options={POSITIONS} />
          <Input label="Experiência *" value={newPlayer.experience} onChange={v => setNewPlayer(p => ({ ...p, experience: v }))} options={EXPERIENCE} />
          <Btn onClick={createPlayer} color="#1D4ED8" full disabled={!newPlayer.name || !newPlayer.position || !newPlayer.experience}>
            <Icon name="plus" size={18} /> Cadastrar Jogador
          </Btn>
        </Modal>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 90, fontFamily: "'Exo 2',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #0A1628, #0D1F3C)", padding: "60px 24px 24px", borderBottom: "1px solid rgba(59,130,246,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ color: "#F0F4FF", fontSize: 26, fontWeight: 900, margin: "0 0 4px" }}>Times</h1>
            <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>{teams.length} time{teams.length !== 1 ? "s" : ""} cadastrado{teams.length !== 1 ? "s" : ""}</p>
          </div>
          {isAdmin && <Btn onClick={() => setShowNewTeam(true)} color="#1D4ED8" small><Icon name="plus" size={16} /> Novo</Btn>}
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {teams.length === 0 && (
          <div style={{ background: "#0A1628", borderRadius: 14, padding: "32px", border: "1px dashed rgba(59,130,246,0.2)", textAlign: "center", color: "#475569" }}>
            <Icon name="teams" size={36} color="#1E3A5F" />
            <p style={{ marginTop: 12, fontSize: 14 }}>Nenhum time cadastrado ainda</p>
          </div>
        )}
        {teams.map(t => {
          const tp = teamPlayers(t.id);
          const cap = players.find(p => p.id === t.captain);
          return (
            <div key={t.id} onClick={() => { setSelTeam(t); setView("detail"); }} style={{
              background: "#0A1628", borderRadius: 16, padding: "18px", border: `1px solid ${t.color}44`,
              marginBottom: 12, cursor: "pointer", transition: "border-color 0.2s",
              boxShadow: `0 4px 20px ${t.color}11`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: t.color + "33", border: `2px solid ${t.color}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="teams" size={24} color={t.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "#F0F4FF", margin: "0 0 4px", fontSize: 18, fontWeight: 800 }}>{t.name}</h3>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ color: "#64748B", fontSize: 13 }}>{tp.length} jogador{tp.length !== 1 ? "es" : ""}</span>
                    {cap && <span style={{ color: "#EAB308", fontSize: 12 }}><Icon name="star" size={12} color="#EAB308" /> {cap.name}</span>}
                  </div>
                </div>
                <Icon name="back" size={18} color="#475569" />
              </div>
            </div>
          );
        })}
      </div>

      {/* New Team Modal */}
      <Modal open={showNewTeam} onClose={() => setShowNewTeam(false)} title="Novo Time">
        <Input label="Nome do Time *" value={newTeam.name} onChange={v => setNewTeam(t => ({ ...t, name: v }))} placeholder="Ex: Falcões" />
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: "#94A3B8", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Cor do Time</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {TEAM_COLORS.map((c, i) => (
              <button key={i} onClick={() => setNewTeam(t => ({ ...t, colorIdx: i }))} style={{
                background: c.hex + "22", border: `2px solid ${newTeam.colorIdx === i ? c.hex : "transparent"}`,
                borderRadius: 10, padding: "10px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: c.hex }} />
                <span style={{ color: "#94A3B8", fontSize: 10 }}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
        <Btn onClick={createTeam} color="#1D4ED8" full disabled={!newTeam.name.trim()}>
          <Icon name="check" size={18} /> Criar Time
        </Btn>
      </Modal>
    </div>
  );
};

// ─── GAMES SCREEN ─────────────────────────────────────────────────────────────
const GamesScreen = ({ teams, games, setGames, isAdmin }) => {
  const [view, setView] = useState("schedule"); // schedule | table
  const [showNew, setShowNew] = useState(false);
  const [newGame, setNewGame] = useState({ date: "", team1Id: "", team2Id: "", type: "Amistoso" });

  const createGame = () => {
    if (!newGame.date || !newGame.team1Id || !newGame.team2Id || newGame.team1Id === newGame.team2Id) return;
    setGames(prev => [...prev, { id: Date.now(), ...newGame, result: null }]);
    setNewGame({ date: "", team1Id: "", team2Id: "", type: "Amistoso" });
    setShowNew(false);
  };

  const sortedGames = [...games].sort((a, b) => a.date.localeCompare(b.date));
  const teamOpts = teams.map(t => ({ value: t.id, label: t.name }));
  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{ paddingBottom: 90, fontFamily: "'Exo 2',sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #0A1628, #0D1F3C)", padding: "60px 24px 0", borderBottom: "1px solid rgba(59,130,246,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16 }}>
          <div>
            <h1 style={{ color: "#F0F4FF", fontSize: 26, fontWeight: 900, margin: "0 0 4px" }}>Jogos</h1>
            <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>Agenda e resultados</p>
          </div>
          {isAdmin && <Btn onClick={() => setShowNew(true)} color="#1D4ED8" small><Icon name="plus" size={16} /> Novo</Btn>}
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {[["schedule", "Agenda"], ["table", "Tabela"]].map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} style={{
              flex: 1, background: "none", border: "none", padding: "12px 0",
              color: view === id ? "#EAB308" : "#475569", fontWeight: 700, fontSize: 14,
              fontFamily: "'Exo 2',sans-serif", cursor: "pointer",
              borderBottom: view === id ? "2px solid #EAB308" : "2px solid transparent",
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {view === "schedule" ? (
          sortedGames.length === 0 ? (
            <div style={{ background: "#0A1628", borderRadius: 14, padding: "32px", border: "1px dashed rgba(59,130,246,0.2)", textAlign: "center", color: "#475569" }}>
              <Icon name="games" size={36} color="#1E3A5F" />
              <p style={{ marginTop: 12, fontSize: 14 }}>Nenhum jogo agendado</p>
            </div>
          ) : sortedGames.map(g => {
            const t1 = teams.find(t => t.id === g.team1Id);
            const t2 = teams.find(t => t.id === g.team2Id);
            const isPast = g.date < today;
            return (
              <div key={g.id} style={{
                background: "#0A1628", borderRadius: 16, padding: "16px", border: "1px solid rgba(59,130,246,0.15)",
                marginBottom: 12, opacity: isPast && !g.result ? 0.5 : 1,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ color: "#64748B", fontSize: 12 }}>{g.date}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Badge label={g.type} color="#3B82F6" />
                    {g.result && <Badge label="Finalizado" color="#10B981" />}
                    {g.date === today && !g.result && <Badge label="Hoje" color="#EAB308" />}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: (t1?.color || "#3B82F6") + "33", border: `2px solid ${t1?.color || "#3B82F6"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
                      <Icon name="teams" size={18} color={t1?.color || "#3B82F6"} />
                    </div>
                    <div style={{ color: t1?.color || "#3B82F6", fontWeight: 700, fontSize: 14 }}>{t1?.name || "?"}</div>
                  </div>
                  <div style={{ textAlign: "center", padding: "0 12px" }}>
                    {g.result ? (
                      <div style={{ color: "#F0F4FF", fontWeight: 900, fontSize: 22, fontFamily: "'Exo 2',sans-serif" }}>
                        {g.result.setsA} – {g.result.setsB}
                      </div>
                    ) : (
                      <div style={{ color: "#475569", fontWeight: 700, fontSize: 16 }}>VS</div>
                    )}
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: (t2?.color || "#EF4444") + "33", border: `2px solid ${t2?.color || "#EF4444"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
                      <Icon name="teams" size={18} color={t2?.color || "#EF4444"} />
                    </div>
                    <div style={{ color: t2?.color || "#EF4444", fontWeight: 700, fontSize: 14 }}>{t2?.name || "?"}</div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // Table view
          <div>
            <div style={{ background: "#0A1628", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(59,130,246,0.2)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto", gap: 0, background: "#0D1F3C", padding: "10px 16px" }}>
                {["Time", "J", "V", "D", "Pts"].map(h => (
                  <div key={h} style={{ color: "#64748B", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: h !== "Time" ? "center" : "left" }}>{h}</div>
                ))}
              </div>
              {teams.map((t, i) => {
                const tgames = games.filter(g => (g.team1Id === t.id || g.team2Id === t.id) && g.result);
                const wins = tgames.filter(g => g.result?.winner === t.id).length;
                const losses = tgames.length - wins;
                const pts = wins * 3;
                return (
                  <div key={t.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto", gap: 0, padding: "12px 16px", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
                      <span style={{ color: "#F0F4FF", fontWeight: 600, fontSize: 14 }}>{t.name}</span>
                    </div>
                    {[tgames.length, wins, losses, pts].map((v, vi) => (
                      <div key={vi} style={{ color: vi === 3 ? "#EAB308" : "#94A3B8", fontWeight: vi === 3 ? 800 : 400, fontSize: 14, textAlign: "center", minWidth: 32 }}>{v}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* New Game Modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Cadastrar Jogo">
        <Input label="Data *" value={newGame.date} onChange={v => setNewGame(g => ({ ...g, date: v }))} type="date" />
        <Input label="Time 1 *" value={newGame.team1Id} onChange={v => setNewGame(g => ({ ...g, team1Id: Number(v) }))} options={teamOpts} />
        <Input label="Time 2 *" value={newGame.team2Id} onChange={v => setNewGame(g => ({ ...g, team2Id: Number(v) }))} options={teamOpts} />
        <Input label="Tipo" value={newGame.type} onChange={v => setNewGame(g => ({ ...g, type: v }))} options={["Amistoso", "Campeonato", "Treino"]} />
        <Btn onClick={createGame} color="#1D4ED8" full disabled={!newGame.date || !newGame.team1Id || !newGame.team2Id || newGame.team1Id === newGame.team2Id}>
          <Icon name="save" size={18} /> Salvar Jogo
        </Btn>
      </Modal>
    </div>
  );
};

// ─── Login Inline (modal) ─────────────────────────────────────────────────────
const LoginInline = ({ onLogin, onClose }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const handle = () => {
    if (user === "admin" && pass === "unip2024") { onLogin({ name: "Administrador UNIP", role: "ADM" }); }
    else setErr("Credenciais inválidas");
  };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, color: "#3B82F6" }}>
        <Icon name="lock" size={16} color="#3B82F6" />
        <span style={{ color: "#475569", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Acesso Exclusivo UNIP</span>
      </div>
      <Input label="Usuário" value={user} onChange={setUser} placeholder="admin" />
      <Input label="Senha" value={pass} onChange={setPass} type="password" placeholder="••••••••" />
      {err && <p style={{ color: "#EF4444", fontSize: 13, margin: "-8px 0 14px", textAlign: "center" }}>{err}</p>}
      <Btn onClick={handle} color="#1D4ED8" full>
        <Icon name="shield" size={18} /> Entrar como ADM
      </Btn>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [admin, setAdmin] = useState(null); // null = visitante livre
  const [screen, setScreen] = useState("home");
  const [showLogin, setShowLogin] = useState(false);

  const [teams, setTeams] = useLocalStorage("vh_teams", []);
  const [players, setPlayers] = useLocalStorage("vh_players", []);
  const [games, setGames] = useLocalStorage("vh_games", []);

  const handleSaveResult = (gameId, score) => {
    if (!gameId) return;
    setGames(prev => prev.map(g => g.id === gameId ? {
      ...g, result: {
        setsA: score.setsA, setsB: score.setsB,
        winner: score.setsA > score.setsB ? g.team1Id : g.team2Id,
        sets: score.sets,
      }
    } : g));
  };

  useEffect(() => {
    document.body.style.cssText = "margin:0;padding:0;background:#030D1F;font-family:'Exo 2',sans-serif;";
  }, []);

  // Loading → direto pro app, sem login obrigatório
  if (!loaded) return <LoadingScreen onDone={() => setLoaded(true)} />;

  const isAdmin = admin?.role === "ADM";

  const renderScreen = () => {
    switch (screen) {
      case "home": return <HomeScreen onNavigate={s => setScreen(s)} admin={admin} teams={teams} games={games} players={players} onLoginPress={() => setShowLogin(true)} onLogout={() => setAdmin(null)} />;
      case "score": return <ScoreScreen teams={teams} games={games} onSaveResult={handleSaveResult} />;
      case "quickgame": return <QuickGameSetup onCancel={() => setScreen("home")} />;
      case "teams": return <TeamsScreen teams={teams} setTeams={setTeams} players={players} setPlayers={setPlayers} games={games} isAdmin={isAdmin} />;
      case "games": return <GamesScreen teams={teams} games={games} setGames={setGames} isAdmin={isAdmin} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030D1F", color: "#F0F4FF", fontFamily: "'Exo 2',sans-serif", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;800;900&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        input, select { font-family: 'Exo 2', sans-serif !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #1D4ED8; border-radius: 4px; }
      `}</style>
      {renderScreen()}
      <NavBar current={screen} onChange={setScreen} />
      {/* Login modal — opcional, acessível pelo botão ADM no header */}
      <Modal open={showLogin} onClose={() => setShowLogin(false)} title="Login ADM · UNIP">
        <LoginInline onLogin={a => { setAdmin(a); setShowLogin(false); }} onClose={() => setShowLogin(false)} />
      </Modal>
    </div>
  );
}
