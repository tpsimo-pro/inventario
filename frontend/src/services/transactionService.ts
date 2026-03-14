import api from './api';
import type { Transaction, TransactionCreate } from '../types';

export const transactionService = {
  async getAll(skip = 0, limit = 100): Promise<Transaction[]> {
    const { data } = await api.get<Transaction[]>('/transacoes/', { params: { skip, limit } });
    return data;
  },

  async getByProduct(productId: number, skip = 0, limit = 100): Promise<Transaction[]> {
    const { data } = await api.get<Transaction[]>(`/transacoes/produto/${productId}`, { params: { skip, limit } });
    return data;
  },

  async create(transaction: TransactionCreate): Promise<Transaction> {
    const { data } = await api.post<Transaction>('/transacoes/', transaction);
    return data;
  },
};
