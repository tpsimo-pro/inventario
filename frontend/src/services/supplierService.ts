import api from './api';
import type { Supplier, SupplierCreate } from '../types';

export const supplierService = {
  async getAll(skip = 0, limit = 100): Promise<Supplier[]> {
    const { data } = await api.get<Supplier[]>('/fornecedores/', { params: { skip, limit } });
    return data;
  },

  async create(supplier: SupplierCreate): Promise<Supplier> {
    const { data } = await api.post<Supplier>('/fornecedores/', supplier);
    return data;
  },
};
