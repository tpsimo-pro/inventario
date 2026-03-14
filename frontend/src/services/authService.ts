import api from './api';
import type { AuthToken, User, UserCreate } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthToken> {
    // OAuth2PasswordRequestForm espera form-data com 'username' e 'password'
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const { data } = await api.post<AuthToken>('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async register(user: UserCreate): Promise<User> {
    const { data } = await api.post<User>('/usuarios/', user);
    return data;
  },
};
