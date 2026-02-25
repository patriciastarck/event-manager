const API_BASE = "http://localhost:8080";

async function request(method, path, body, token) {
  console.log("Enviando token para a API:", token);
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || "Erro na requisição");
  try { return JSON.parse(text); } catch { return text; }
}

export const loginAdmin = (email, password) =>
  request("POST", "/api/auth/login", { email, password });

export const registerAdmin = (name, email, password) =>
  request("POST", "/api/auth/register", { name, email, password });

export const listEvents = (token) =>
  request("GET", "/api/events", null, token);

export const createEvent = (data, token) =>
  request("POST", "/api/events", data, token);

export const updateEvent = (id, data, token) =>
  request("PUT", `/api/events/${id}`, data, token);

export const deleteEvent = (id, token) =>
  request("DELETE", `/api/events/${id}`, null, token);