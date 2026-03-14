import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { supplierService } from '../services/supplierService';
import type { Product, ProductCreate, ProductUpdate, Category, Supplier } from '../types';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiMagnifyingGlass, HiArrowPath } from 'react-icons/hi2';
import './PageCommon.css';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Form
  const [form, setForm] = useState<ProductCreate>({
    nome: '', sku: '', categoria_id: 0, codigo_barras: '',
    descricao: '', preco_custo: 0, preco_venda: 0,
    quantidade_atual: 0, estoque_minimo: 5, fornecedor_id: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      productService.getAll(),
      categoryService.getAll(),
      supplierService.getAll(),
    ]).then(([prods, cats, supps]) => {
      setProducts(prods);
      setCategories(cats);
      setSuppliers(supps);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const filtered = products.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingProduct(null);
    setForm({
      nome: '', sku: '', categoria_id: categories[0]?.id || 0, codigo_barras: '',
      descricao: '', preco_custo: 0, preco_venda: 0,
      quantidade_atual: 0, estoque_minimo: 5, fornecedor_id: null,
    });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      nome: product.nome,
      sku: product.sku,
      codigo_barras: product.codigo_barras || '',
      descricao: product.descricao || '',
      preco_custo: product.preco_custo,
      preco_venda: product.preco_venda,
      quantidade_atual: product.quantidade_atual,
      estoque_minimo: product.estoque_minimo,
      categoria_id: product.categoria_id,
      fornecedor_id: product.fornecedor_id,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingProduct) {
        const update: ProductUpdate = {};
        const keys = Object.keys(form) as (keyof ProductCreate)[];
        keys.forEach((key) => {
          const newVal = form[key];
          const oldVal = editingProduct[key as keyof Product];
          if (newVal !== oldVal) {
            (update as Record<string, unknown>)[key] = newVal;
          }
        });
        await productService.update(editingProduct.id, update);
        toast.success('Produto atualizado!');
      } else {
        await productService.create(form);
        toast.success('Produto criado!');
      }
      setShowModal(false);
      loadData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Erro ao salvar produto';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (product: Product) => {
    setDeletingProduct(product);
  };

  const executeDelete = async () => {
    if (!deletingProduct) return;
    try {
      await productService.delete(deletingProduct.id);
      toast.success('Produto desativado!');
      loadData();
    } catch {
      toast.error('Erro ao desativar produto');
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleReactivate = async (product: Product) => {
    try {
      await productService.update(product.id, { ativo: true });
      toast.success('Produto reativado com sucesso!');
      loadData();
    } catch {
      toast.error('Erro ao reativar produto');
    }
  };

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Produtos</h1>
          <p className="page-subtitle">Gerencie todos os produtos do inventário</p>
        </div>
        <Button icon={<HiPlus />} onClick={openCreate}>Novo Produto</Button>
      </div>

      <div className="page-toolbar">
        <div className="search-box">
          <HiMagnifyingGlass className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'nome', header: 'Produto',
            render: (p: Product) => (
              <div className="cell-product">
                <span className="cell-name">{p.nome}</span>
                <span className="cell-sku">{p.sku}</span>
              </div>
            ),
          },
          { key: 'categoria', header: 'Categoria',
            render: (p: Product) => p.categoria?.nome || '—',
          },
          { key: 'preco_venda', header: 'Preço Venda', align: 'right',
            render: (p: Product) => formatCurrency(p.preco_venda),
          },
          { key: 'quantidade_atual', header: 'Estoque', align: 'center',
            render: (p: Product) => (
              <Badge variant={
                p.quantidade_atual === 0 ? 'danger' :
                p.quantidade_atual <= p.estoque_minimo ? 'warning' : 'success'
              }>
                {p.quantidade_atual}
              </Badge>
            ),
          },
          { key: 'ativo', header: 'Status', align: 'center',
            render: (p: Product) => (
              <Badge variant={p.ativo ? 'success' : 'neutral'}>{p.ativo ? 'Ativo' : 'Inativo'}</Badge>
            ),
          },
          { key: 'actions', header: 'Ações', align: 'center',
            render: (p: Product) => (
              <div className="cell-actions" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="action-btn edit" title="Editar" onClick={(e) => { e.preventDefault(); openEdit(p); }}>
                  <HiPencil />
                </button>
                {p.ativo && (
                  <button type="button" className="action-btn delete" title="Desativar" onClick={(e) => { e.preventDefault(); confirmDelete(p); }}>
                    <HiTrash />
                  </button>
                )}
                {!p.ativo && (
                  <button type="button" className="action-btn activate" title="Reativar" onClick={(e) => { e.preventDefault(); handleReactivate(p); }}>
                    <HiArrowPath />
                  </button>
                )}
              </div>
            ),
          },
        ]}
        data={filtered}
        loading={loading}
        emptyMessage="Nenhum produto encontrado"
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingProduct ? 'Editar Produto' : 'Novo Produto'} size="lg">
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid-2">
            <FormField label="Nome" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
            <FormField label="SKU" required value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} />
          </div>
          <div className="form-grid-2">
            <FormField label="Código de Barras" value={form.codigo_barras || ''} onChange={e => setForm({...form, codigo_barras: e.target.value || null})} />
            <FormField as="select" label="Categoria" required value={form.categoria_id} onChange={e => setForm({...form, categoria_id: Number(e.target.value)})}>
              <option value={0} disabled>Selecione...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </FormField>
          </div>
          <div className="form-grid-2">
            <FormField label="Preço de Custo" type="number" step="0.01" min="0" value={form.preco_custo} onChange={e => setForm({...form, preco_custo: Number(e.target.value)})} />
            <FormField label="Preço de Venda" type="number" step="0.01" min="0" value={form.preco_venda} onChange={e => setForm({...form, preco_venda: Number(e.target.value)})} />
          </div>
          <div className="form-grid-2">
            <FormField label="Qtd. Atual" type="number" min="0" value={form.quantidade_atual} onChange={e => setForm({...form, quantidade_atual: Number(e.target.value)})} />
            <FormField label="Estoque Mínimo" type="number" min="0" value={form.estoque_minimo} onChange={e => setForm({...form, estoque_minimo: Number(e.target.value)})} />
          </div>
          <FormField as="select" label="Fornecedor" value={form.fornecedor_id ?? ''} onChange={e => setForm({...form, fornecedor_id: e.target.value ? Number(e.target.value) : null})}>
            <option value="">Nenhum</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.razao_social}</option>)}
          </FormField>
          <FormField label="Descrição" value={form.descricao || ''} onChange={e => setForm({...form, descricao: e.target.value || null})} />
          <div className="modal-actions">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={submitting}>{editingProduct ? 'Salvar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deletingProduct} onClose={() => setDeletingProduct(null)} title="Desativar Produto" size="sm">
        <div style={{ padding: '0.5rem 0' }}>
          <p>Tem certeza que deseja desativar o produto <strong>{deletingProduct?.nome}</strong>?</p>
          <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
            <Button variant="ghost" onClick={() => setDeletingProduct(null)}>Cancelar</Button>
            <Button variant="danger" onClick={executeDelete}>Desativar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
