import api from './api';
import type { Category, CategoryCreate } from '../types';

export const categoryService = {
  async getAll(skip = 0, limit = 100): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categorias/', { params: { skip, limit } });
    return data;
  },

  async create(category: CategoryCreate): Promise<Category> {
    const { data } = await api.post<Category>('/categorias/', category);
    return data;
  },
};
