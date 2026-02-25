import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import EventCard from "../components/EventCard";
import EventModal from "../components/EventModal";
import { listEvents, deleteEvent } from "../services/api";

export default function DashboardPage({ token, onLogout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | evento (editar)
  const [error, setError] = useState("");

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
        <button className="btn btn-ghost" onClick={onLogout}>Sair</button>
      </div>

      {/* Header da lista */}
      <div className="events-header">
        <div>
          <span className="events-title">Meus Eventos</span>
          <span className="events-count">{events.length}</span>
        </div>
        <button
          className="btn btn-primary"
          style={{ width: "auto" }}
          onClick={() => setModal("add")}
        >
          + Adicionar Evento
        </button>
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
        <div className="events-grid">
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
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
