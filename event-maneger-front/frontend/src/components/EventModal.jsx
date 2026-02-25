import { useState } from "react";
import Alert from "./Alert";
import Spinner from "./Spinner";
import { createEvent, updateEvent } from "../services/api";

function fromISOLocal(dt) {
  if (!dt) return "";
  return typeof dt === "string" ? dt.slice(0, 16) : "";
}

export default function EventModal({ token, editing, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: editing?.title || "",
    date: fromISOLocal(editing?.date) || "",
    location: editing?.location || "",
    imageUrl: editing?.imageUrl || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSave() {
    setError("");
    if (!form.title || !form.date || !form.location)
      return setError("Preencha título, data e localização.");

    setLoading(true);
    try {
      const body = {
        title: form.title,
        date: form.date + ":00",
        location: form.location,
        imageUrl: form.imageUrl || null,
      };
      const result = editing
        ? await updateEvent(editing.id, body, token)
        : await createEvent(body, token);
      onSaved(result, !!editing);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {editing ? "Editar evento" : "Novo evento"}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <Alert type="error" msg={error} />

        <div className="form-group">
          <label className="form-label">Título</label>
          <input className="form-input" placeholder="Nome do evento"
            value={form.title} onChange={set("title")} />
        </div>

        <div className="form-group">
          <label className="form-label">Data e horário</label>
          <input className="form-input" type="datetime-local"
            value={form.date} onChange={set("date")} />
        </div>

        <div className="form-group">
          <label className="form-label">Localização</label>
          <input className="form-input" placeholder="Endereço ou local"
            value={form.location} onChange={set("location")} />
        </div>

        <div className="form-group">
          <label className="form-label">URL da imagem (opcional)</label>
          <input className="form-input" placeholder="https://..."
            value={form.imageUrl} onChange={set("imageUrl")} />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? <Spinner /> : editing ? "Salvar alterações" : "Criar evento"}
          </button>
        </div>
      </div>
    </div>
  );
}
