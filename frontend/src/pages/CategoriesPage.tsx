import { useEffect, useState } from 'react';
import { categoryService } from '../services/categoryService';
import type { Category, CategoryCreate } from '../types';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import toast from 'react-hot-toast';
import { HiPlus } from 'react-icons/hi2';
import './PageCommon.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CategoryCreate>({ nome: '', descricao: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    categoryService.getAll().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await categoryService.create(form);
      toast.success('Categoria criada!');
      setShowModal(false);
      setForm({ nome: '', descricao: '' });
      loadData();
    } catch {
      toast.error('Erro ao criar categoria');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categorias</h1>
          <p className="page-subtitle">Organize os produtos em categorias</p>
        </div>
        <Button icon={<HiPlus />} onClick={() => setShowModal(true)}>Nova Categoria</Button>
      </div>

      <DataTable
        columns={[
          { key: 'id', header: 'ID', align: 'center' },
          { key: 'nome', header: 'Nome' },
          { key: 'descricao', header: 'Descrição',
            render: (c: Category) => c.descricao || '—',
          },
        ]}
        data={categories}
        loading={loading}
        emptyMessage="Nenhuma categoria cadastrada"
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nova Categoria" size="sm">
        <form onSubmit={handleSubmit} className="modal-form">
          <FormField label="Nome" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Ex: Eletrônicos" />
          <FormField label="Descrição" value={form.descricao || ''} onChange={e => setForm({...form, descricao: e.target.value || null})} placeholder="Descrição opcional" />
          <div className="modal-actions">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={submitting}>Criar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
