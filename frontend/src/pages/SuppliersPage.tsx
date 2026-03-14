import { useEffect, useState } from 'react';
import { supplierService } from '../services/supplierService';
import type { Supplier, SupplierCreate } from '../types';
import DataTable from '../components/ui/DataTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import FormField from '../components/ui/FormField';
import toast from 'react-hot-toast';
import { HiPlus } from 'react-icons/hi2';
import './PageCommon.css';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<SupplierCreate>({ razao_social: '', cnpj_cpf: '', email: '', telefone: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    supplierService.getAll().then(setSuppliers).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await supplierService.create(form);
      toast.success('Fornecedor cadastrado!');
      setShowModal(false);
      setForm({ razao_social: '', cnpj_cpf: '', email: '', telefone: '' });
      loadData();
    } catch {
      toast.error('Erro ao cadastrar fornecedor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fornecedores</h1>
          <p className="page-subtitle">Cadastre e visualize seus fornecedores</p>
        </div>
        <Button icon={<HiPlus />} onClick={() => setShowModal(true)}>Novo Fornecedor</Button>
      </div>

      <DataTable
        columns={[
          { key: 'id', header: 'ID', align: 'center' },
          { key: 'razao_social', header: 'Razão Social' },
          { key: 'cnpj_cpf', header: 'CNPJ/CPF',
            render: (s: Supplier) => s.cnpj_cpf || '—',
          },
          { key: 'email', header: 'E-mail',
            render: (s: Supplier) => s.email || '—',
          },
          { key: 'telefone', header: 'Telefone',
            render: (s: Supplier) => s.telefone || '—',
          },
        ]}
        data={suppliers}
        loading={loading}
        emptyMessage="Nenhum fornecedor cadastrado"
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Fornecedor" size="md">
        <form onSubmit={handleSubmit} className="modal-form">
          <FormField label="Razão Social" required value={form.razao_social} onChange={e => setForm({...form, razao_social: e.target.value})} placeholder="Ex: Distribuidora XYZ Ltda" />
          <div className="form-grid-2">
            <FormField label="CNPJ / CPF" value={form.cnpj_cpf || ''} onChange={e => setForm({...form, cnpj_cpf: e.target.value || null})} placeholder="00.000.000/0000-00" />
            <FormField label="Telefone" value={form.telefone || ''} onChange={e => setForm({...form, telefone: e.target.value || null})} placeholder="(00) 00000-0000" />
          </div>
          <FormField label="E-mail" type="email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value || null})} placeholder="contato@fornecedor.com" />
          <div className="modal-actions">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" loading={submitting}>Cadastrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
