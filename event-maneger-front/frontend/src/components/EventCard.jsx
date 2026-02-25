function formatDate(dt) {
  if (!dt) return "—";
  try {
    return new Date(dt).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return dt; }
}

export default function EventCard({ event, onEdit, onDelete }) {
  return (
    <div className="event-card">
      {event.imageUrl ? (
        <img
          className="event-image"
          src={event.imageUrl}
          alt={event.title}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="event-image-placeholder"
        style={{ display: event.imageUrl ? "none" : "flex" }}
      >
        🎉
      </div>

      <div className="event-body">
        <h3 className="event-title">{event.title}</h3>
        <div className="event-meta">
          <div className="event-meta-item">
            <span>📅</span> {formatDate(event.date)}
          </div>
          <div className="event-meta-item">
            <span>📍</span> {event.location}
          </div>
        </div>
        <div className="event-actions">
          <button className="btn btn-icon" onClick={() => onEdit(event)}>
            ✏️ Editar
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(event)}>
            🗑 Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
