import api from './api';
import type { Product, ProductCreate, ProductUpdate } from '../types';

export const productService = {
  async getAll(skip = 0, limit = 100): Promise<Product[]> {
    const { data } = await api.get<Product[]>('/produtos/', { params: { skip, limit } });
    return data;
  },

  async getById(id: number): Promise<Product> {
    const { data } = await api.get<Product>(`/produtos/${id}`);
    return data;
  },

  async getLowStockAlerts(skip = 0, limit = 100): Promise<Product[]> {
    const { data } = await api.get<Product[]>('/produtos/alertas/estoque-baixo', { params: { skip, limit } });
    return data;
  },

  async create(product: ProductCreate): Promise<Product> {
    const { data } = await api.post<Product>('/produtos/', product);
    return data;
  },

  async update(id: number, product: ProductUpdate): Promise<Product> {
    const { data } = await api.patch<Product>(`/produtos/${id}`, product);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`);
  },
};
