class ApiService {
  private static instance: ApiService | null = null;
  private baseURL: string;
  private token: string | null;

  private constructor() {
    this.baseURL = 'http://192.168.0.4:8080';
    this.token = null;
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  getToken(): string | null {
    return this.token;
  }

  private async request(method: string, path: string, body?: any): Promise<any> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await fetch(`${this.baseURL}${path}`, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || 'Erro na requisição');
    try { return JSON.parse(text); } catch { return text; }
  }

  login(email: string, password: string) {
    return this.request('POST', '/api/auth/login', { email, password });
  }

  register(name: string, email: string, password: string) {
    return this.request('POST', '/api/auth/register', { name, email, password });
  }

  listEvents() {
    return this.request('GET', '/api/events');
  }

  createEvent(data: any) {
    return this.request('POST', '/api/events', data);
  }

  updateEvent(id: number, data: any) {
    return this.request('PUT', `/api/events/${id}`, data);
  }

  deleteEvent(id: number) {
    return this.request('DELETE', `/api/events/${id}`);
  }
}

export default ApiService.getInstance();