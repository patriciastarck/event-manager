import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import { loginAdmin, registerAdmin } from "../services/api";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [savePass, setSavePass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("saved_creds");
    if (saved) {
      const { email, password } = JSON.parse(saved);
      setForm((f) => ({ ...f, email, password }));
      setSavePass(true);
    }
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit() {
    setError(""); setSuccess("");

    if (mode === "register") {
      if (!form.name || !form.email || !form.password)
        return setError("Preencha todos os campos.");
      if (form.password !== form.confirm)
        return setError("As senhas não coincidem.");
      setLoading(true);
      try {
        await registerAdmin(form.name, form.email, form.password);
        setSuccess("Cadastro realizado! Faça o login.");
        setMode("login");
        setForm((f) => ({ ...f, name: "", confirm: "" }));
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    } else {
      if (!form.email || !form.password)
        return setError("Preencha email e senha.");
      setLoading(true);
      try {
        const token = await loginAdmin(form.email, form.password);
        if (savePass) {
          localStorage.setItem("saved_creds", JSON.stringify({ email: form.email, password: form.password }));
        } else {
          localStorage.removeItem("saved_creds");
        }
        onLogin(token);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }
  }

  function switchMode(m) {
    setMode(m); setError(""); setSuccess("");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-icon">🗓</div>
          <div className="brand-name">EventManager</div>
        </div>

        <h1 className="auth-title">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
        <p className="auth-sub">
          {mode === "login" ? "Acesse seu painel de eventos" : "Registre-se como administrador"}
        </p>

        <Alert type="error" msg={error} />
        <Alert type="success" msg={success} />

        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input className="form-input" placeholder="Seu nome completo"
              value={form.name} onChange={set("name")} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="admin@email.com"
            value={form.email} onChange={set("email")} />
        </div>

        <div className="form-group">
          <label className="form-label">Senha</label>
          <input className="form-input" type="password" placeholder="••••••••"
            value={form.password} onChange={set("password")} />
        </div>

        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Confirmar senha</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={form.confirm} onChange={set("confirm")} />
          </div>
        )}

        {mode === "login" && (
          <label className="checkbox-row">
            <input type="checkbox" checked={savePass}
              onChange={(e) => setSavePass(e.target.checked)} />
            <span>Gravar senha</span>
          </label>
        )}

        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner /> : mode === "login" ? "Entrar" : "Cadastrar-se"}
        </button>

        <div className="auth-footer">
          {mode === "login" ? (
            <>Não tem conta?{" "}
              <button className="btn-link" onClick={() => switchMode("register")}>
                Cadastrar-se
              </button>
            </>
          ) : (
            <>Já tem conta?{" "}
              <button className="btn-link" onClick={() => switchMode("login")}>
                Entrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
