// ─── Category ────────────────────────────────────────
export interface Category {
  id: number;
  nome: string;
  descricao: string | null;
}

export interface CategoryCreate {
  nome: string;
  descricao?: string | null;
}

// ─── Supplier ────────────────────────────────────────
export interface Supplier {
  id: number;
  razao_social: string;
  cnpj_cpf: string | null;
  email: string | null;
  telefone: string | null;
}

export interface SupplierCreate {
  razao_social: string;
  cnpj_cpf?: string | null;
  email?: string | null;
  telefone?: string | null;
}

// ─── Product ─────────────────────────────────────────
export interface Product {
  id: number;
  nome: string;
  sku: string;
  codigo_barras: string | null;
  descricao: string | null;
  preco_custo: number;
  preco_venda: number;
  quantidade_atual: number;
  estoque_minimo: number;
  ativo: boolean;
  categoria_id: number;
  fornecedor_id: number | null;
  categoria: Category;
  fornecedor: Supplier | null;
  criado_em: string;
  atualizado_em: string;
}

export interface ProductCreate {
  nome: string;
  sku: string;
  codigo_barras?: string | null;
  descricao?: string | null;
  preco_custo?: number;
  preco_venda?: number;
  quantidade_atual?: number;
  estoque_minimo?: number;
  ativo?: boolean;
  categoria_id: number;
  fornecedor_id?: number | null;
}

export interface ProductUpdate {
  nome?: string;
  sku?: string;
  codigo_barras?: string | null;
  descricao?: string | null;
  preco_custo?: number;
  preco_venda?: number;
  quantidade_atual?: number;
  estoque_minimo?: number;
  ativo?: boolean;
  categoria_id?: number;
  fornecedor_id?: number | null;
}

// ─── Transaction ─────────────────────────────────────
export type TransactionType = 'ENTRADA' | 'SAIDA';

export interface Transaction {
  id: number;
  produto_id: number;
  tipo: TransactionType;
  quantidade: number;
  observacao: string | null;
  usuario_id: number | null;
  criado_em: string;
}

export interface TransactionCreate {
  produto_id: number;
  tipo: TransactionType;
  quantidade: number;
  observacao?: string | null;
}

// ─── User ────────────────────────────────────────────
export interface User {
  id: number;
  email: string;
  nome: string;
  is_active: boolean;
  is_superuser: boolean;
}

export interface UserCreate {
  email: string;
  nome: string;
  password: string;
}

// ─── Auth ────────────────────────────────────────────
export interface AuthToken {
  access_token: string;
  token_type: string;
}
