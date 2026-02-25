import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem("jwt") || null);

  function handleLogin(jwt) {
    sessionStorage.setItem("jwt", jwt);
    setToken(jwt);
  }

  function handleLogout() {
    sessionStorage.removeItem("jwt");
    setToken(null);
  }

  return token
    ? <DashboardPage token={token} onLogout={handleLogout} />
    : <AuthPage onLogin={handleLogin} />;
}
