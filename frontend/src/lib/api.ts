const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4590/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('weldtrack_token', token);
      } else {
        localStorage.removeItem('weldtrack_token');
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('weldtrack_token');
    }
    return this.token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.setToken(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
      throw new Error('Oturum süresi doldu');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path);
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(data) });
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(data) });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }

  // Auth
  login(email: string, password: string) {
    return this.post<{ access_token: string; user: any }>('/auth/login', { email, password });
  }

  register(data: { email: string; password: string; name: string }) {
    return this.post<{ access_token: string; user: any }>('/auth/register', data);
  }

  getProfile() {
    return this.get<any>('/auth/profile');
  }

  // Dashboard
  getDashboard() {
    return this.get<any>('/dashboard');
  }

  // Customers
  getCustomers(search?: string) {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.get<any[]>(`/customers${q}`);
  }

  getCustomer(id: string) {
    return this.get<any>(`/customers/${id}`);
  }

  createCustomer(data: any) {
    return this.post<any>('/customers', data);
  }

  updateCustomer(id: string, data: any) {
    return this.put<any>(`/customers/${id}`, data);
  }

  deleteCustomer(id: string) {
    return this.delete<any>(`/customers/${id}`);
  }

  // Workers
  getWorkers(active?: string) {
    const q = active ? `?active=${active}` : '';
    return this.get<any[]>(`/workers${q}`);
  }

  getWorker(id: string) {
    return this.get<any>(`/workers/${id}`);
  }

  createWorker(data: any) {
    return this.post<any>('/workers', data);
  }

  updateWorker(id: string, data: any) {
    return this.put<any>(`/workers/${id}`, data);
  }

  deleteWorker(id: string) {
    return this.delete<any>(`/workers/${id}`);
  }

  // Materials
  getMaterials(category?: string, search?: string) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    const q = params.toString() ? `?${params}` : '';
    return this.get<any[]>(`/materials${q}`);
  }

  getMaterial(id: string) {
    return this.get<any>(`/materials/${id}`);
  }

  getLowStockMaterials() {
    return this.get<any[]>('/materials/low-stock');
  }

  createMaterial(data: any) {
    return this.post<any>('/materials', data);
  }

  updateMaterial(id: string, data: any) {
    return this.put<any>(`/materials/${id}`, data);
  }

  deleteMaterial(id: string) {
    return this.delete<any>(`/materials/${id}`);
  }

  // Work Orders
  getWorkOrders(status?: string, priority?: string, search?: string) {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (priority) params.set('priority', priority);
    if (search) params.set('search', search);
    const q = params.toString() ? `?${params}` : '';
    return this.get<any[]>(`/work-orders${q}`);
  }

  getWorkOrder(id: string) {
    return this.get<any>(`/work-orders/${id}`);
  }

  createWorkOrder(data: any) {
    return this.post<any>('/work-orders', data);
  }

  updateWorkOrder(id: string, data: any) {
    return this.put<any>(`/work-orders/${id}`, data);
  }

  deleteWorkOrder(id: string) {
    return this.delete<any>(`/work-orders/${id}`);
  }

  addQualityCheck(workOrderId: string, data: any) {
    return this.post<any>(`/work-orders/${workOrderId}/quality-checks`, data);
  }

  // Invoices
  getInvoices(status?: string) {
    const q = status ? `?status=${status}` : '';
    return this.get<any[]>(`/invoices${q}`);
  }

  getInvoice(id: string) {
    return this.get<any>(`/invoices/${id}`);
  }

  createInvoice(data: any) {
    return this.post<any>('/invoices', data);
  }

  updateInvoice(id: string, data: any) {
    return this.put<any>(`/invoices/${id}`, data);
  }

  deleteInvoice(id: string) {
    return this.delete<any>(`/invoices/${id}`);
  }
}

export const api = new ApiClient();
