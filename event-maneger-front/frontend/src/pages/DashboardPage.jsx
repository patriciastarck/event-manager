import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import EventCard from "../components/EventCard";
import EventModal from "../components/EventModal";
import { useTheme } from "../hooks/useTheme";
import { listEvents, deleteEvent } from "../services/api";

export default function DashboardPage({ token, onLogout }) {
  const { theme, toggleTheme } = useTheme(); // Inicializando o hook de tema
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid"); 

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const data = await listEvents(token);
      setEvents(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  function handleSaved(event, isEdit) {
    if (isEdit) {
      setEvents((ev) => ev.map((e) => e.id === event.id ? event : e));
    } else {
      setEvents((ev) => [event, ...ev]);
    }
    setModal(null);
  }

  async function handleDelete(event) {
    if (!confirm(`Excluir "${event.title}"?`)) return;
    try {
      await deleteEvent(event.id, token);
      setEvents((ev) => ev.filter((e) => e.id !== event.id));
    } catch (e) { setError(e.message); }
  }

  return (
    <div className="dashboard">
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="brand-icon">🗓</div>
          <div>
            <div className="topbar-title">EventManager</div>
            <div className="topbar-sub">Painel do Administrador</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Botão de Alternância de Tema */}
          <button className="btn btn-ghost" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
          <button className="btn btn-ghost" onClick={onLogout}>Sair</button>
        </div>
      </div>

      {/* Header da lista */}
      <div className="events-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <span className="events-title">Meus Eventos</span>
            <span className="events-count">{events.length}</span>
          </div>

          {events.length > 0 && (
            <div className="view-toggle" style={{ display: 'flex', gap: '4px', background: 'var(--surface2)', padding: '4px', borderRadius: '8px' }}>
              <button 
                className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
                style={{ 
                    background: viewMode === 'grid' ? 'var(--accent)' : 'transparent', 
                    color: viewMode === 'grid' ? '#fff' : 'var(--muted)', 
                    border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' 
                }}
                onClick={() => setViewMode("grid")}
                title="Visualização em Grid"
              >
                ⊞
              </button>
              <button 
                className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
                style={{ 
                    background: viewMode === 'list' ? 'var(--accent)' : 'transparent', 
                    color: viewMode === 'list' ? '#fff' : 'var(--muted)', 
                    border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' 
                }}
                onClick={() => setViewMode("list")}
                title="Visualização em Lista"
              >
                ☰
              </button>
            </div>
          )}
        </div>

        {events.length > 0 && (
          <button
            className="btn btn-primary"
            style={{ width: "auto" }}
            onClick={() => setModal("add")}
          >
            + Adicionar Evento
          </button>
        )}
      </div>

      <Alert type="error" msg={error} />

      {/* Conteúdo */}
      {loading ? (
        <div className="loading-page">
          <Spinner /> <span>Carregando eventos...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎭</div>
          <h3 className="empty-title">Nenhum evento ainda</h3>
          <p className="empty-sub">Crie seu primeiro evento para começar</p>
          <button
            className="btn btn-primary"
            style={{ width: "auto", margin: "0 auto" }}
            onClick={() => setModal("add")}
          >
            + Criar evento
          </button>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "events-grid" : "events-list"}>
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              viewMode={viewMode}
              onEdit={(e) => setModal(e)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {(modal === "add" || (modal && modal.id)) && (
        <EventModal
          token={token}
          editing={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}