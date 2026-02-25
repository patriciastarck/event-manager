import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem("jwt") || null);
  const { theme, toggleTheme } = useTheme();

  function handleLogin(jwt) {
    sessionStorage.setItem("jwt", jwt);
    setToken(jwt);
  }

  function handleLogout() {
    sessionStorage.removeItem("jwt");
    setToken(null);
  }

  return (
    <>
      {/* O botão agora só aparece se NÃO houver token (ou seja, na tela de Auth) */}
      {!token && (
        <button 
          onClick={toggleTheme}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            background: 'var(--surface2)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontWeight: '500'
          }}
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      )}

      {token
        ? <DashboardPage token={token} onLogout={handleLogout} />
        : <AuthPage onLogin={handleLogin} />
      }
    </>
  );
}