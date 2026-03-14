import { useEffect, useState } from 'react';
import { transactionService } from '../services/transactionService';
import { productService } from '../services/productService';
import type { Transaction, TransactionCreate, Product } from '../types';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';
import { HiPlus } from 'react-icons/hi2';
import './PageCommon.css';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<TransactionCreate>({
    produto_id: 0, tipo: 'ENTRADA', quantidade: 1, observacao: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      transactionService.getAll(),
      productService.getAll(),
    ]).then(([trans, prods]) => {
      setTransactions(trans);
      setProducts(prods);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const findProduct = (id: number) => products.find(p => p.id === id);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await transactionService.create(form);
      toast.success('Movimentação registrada!');
      setShowModal(false);
      setForm({ produto_id: 0, tipo: 'ENTRADA', quantidade: 1, observacao: '' });
      loadData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Erro ao registrar movimentação';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const activeProducts = products.filter(p => p.ativo);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transações</h1>
          <p className="page-subtitle">Histórico de movimentações de estoque</p>
        </div>
        <Button icon={<HiPlus />} onClick={() => {
          setForm({ produto_id: activeProducts[0]?.id || 0, tipo: 'ENTRADA', quantidade: 1, observacao: '' });
          setShowModal(true);
        }}>Nova Movimentação</Button>
      </div>

      <DataTable
        columns={[
          { key: 'criado_em', header: 'Data',
            render: (t: Transaction) => formatDate(t.criado_em),
          },
          { key: 'produto_id', header: 'Produto',
            render: (t: Transaction) => {
              const prod = findProduct(t.produto_id);
              return prod ? (
                <div className="cell-product">
                  <span className="cell-name">{prod.nome}</span>
                  <span className="cell-sku">{prod.sku}</span>
                </div>
              ) : `#${t.produto_id}`;
            },
          },
          { key: 'tipo', header: 'Tipo', align: 'center',
            render: (t: Transaction) => (
              <Badge variant={t.tipo === 'ENTRADA' ? 'success' : 'danger'}>{t.tipo}</Badge>
            ),
          },
          { key: 'quantidade', header: 'Quantidade', align: 'center',
            render: (t: Transaction) => (
              <span style={{ fontWeight: 700, color: t.tipo === 'ENTRADA' ? 'var(--status-success)' : 'var(--status-danger)' }}>
                {t.tipo === 'ENTRADA' ? '+' : '-'}{t.quantidade}
              </span>
            ),
          },
          { key: 'observacao', header: 'Observação',
            render: (t: Transaction) => t.observacao || '—',
          },
        ]}
        data={transactions}
        loading={loading}
        emptyMessage="Nenhuma movimentação registrada"
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Movimentação" size="md">
        <form onSubmit={handleSubmit} className="modal-form">
          <FormField as="select" label="Produto" required value={form.produto_id} onChange={e => setForm({...form, produto_id: Number(e.target.value)})}>
            <option value={0} disabled>Selecione um produto...</option>
            {activeProducts.map(p => (
              <option key={p.id} value={p.id}>{p.nome} (Estoque: {p.quantidade_atual})</option>
            ))}
          </FormField>
          <div className="form-grid-2">
            <FormField as="select" label="Tipo" required value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value as 'ENTRADA' | 'SAIDA'})}>
              <option value="ENTRADA">📥 Entrada</option>
              <option value="SAIDA">📤 Saída</option>
            </FormField>
            <FormField label="Quantidade" type="number" required min="1" value={form.quantidade} onChange={e => setForm({...form, quantidade: Number(e.target.value)})} />
          </div>
          <FormField label="Observação" value={form.observacao || ''} onChange={e => setForm({...form, observacao: e.target.value || null})} placeholder="Ex: Nota fiscal #12345" />
          <div className="modal-actions">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={submitting}>Registrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
