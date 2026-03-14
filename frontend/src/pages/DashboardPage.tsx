import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { transactionService } from '../services/transactionService';
import type { Product, Transaction } from '../types';
import StatsCard from '../components/ui/StatsCard';
import DataTable from '../components/ui/DataTable';
import Badge from '../components/ui/Badge';
import {
  HiOutlineCube,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineArrowsRightLeft,
} from 'react-icons/hi2';
import './DashboardPage.css';

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getAll(),
      productService.getLowStockAlerts(),
      transactionService.getAll(0, 10),
    ]).then(([prods, alerts, trans]) => {
      setProducts(prods);
      setLowStock(alerts);
      setTransactions(trans);
    }).finally(() => setLoading(false));
  }, []);

  const activeProducts = products.filter(p => p.ativo);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const findProductName = (prodId: number) => {
    return products.find(p => p.id === prodId)?.nome || `Produto #${prodId}`;
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visão geral do seu inventário</p>
      </div>

      <div className="stats-grid">
        <StatsCard
          title="Total de Produtos"
          value={products.length}
          icon={<HiOutlineCube />}
          variant="default"
        />
        <StatsCard
          title="Produtos Ativos"
          value={activeProducts.length}
          icon={<HiOutlineCheckCircle />}
          variant="success"
        />
        <StatsCard
          title="Alertas de Estoque"
          value={lowStock.length}
          icon={<HiOutlineExclamationTriangle />}
          variant={lowStock.length > 0 ? 'danger' : 'success'}
        />
        <StatsCard
          title="Movimentações"
          value={transactions.length}
          icon={<HiOutlineArrowsRightLeft />}
          variant="info"
        />
      </div>

      <div className="dashboard-sections">
        {lowStock.length > 0 && (
          <section className="dashboard-section">
            <h2 className="section-title">
              <HiOutlineExclamationTriangle className="section-icon danger" />
              Alertas de Estoque Baixo
            </h2>
            <DataTable
              columns={[
                { key: 'nome', header: 'Produto' },
                { key: 'sku', header: 'SKU' },
                { key: 'quantidade_atual', header: 'Qtd. Atual', align: 'center',
                  render: (p: Product) => (
                    <Badge variant={p.quantidade_atual === 0 ? 'danger' : 'warning'}>
                      {p.quantidade_atual}
                    </Badge>
                  ),
                },
                { key: 'estoque_minimo', header: 'Mínimo', align: 'center' },
                { key: 'categoria', header: 'Categoria',
                  render: (p: Product) => p.categoria?.nome || '—',
                },
              ]}
              data={lowStock}
              loading={loading}
              emptyMessage="Nenhum alerta de estoque"
            />
          </section>
        )}

        <section className="dashboard-section">
          <h2 className="section-title">
            <HiOutlineArrowsRightLeft className="section-icon info" />
            Últimas Movimentações
          </h2>
          <DataTable
            columns={[
              { key: 'criado_em', header: 'Data',
                render: (t: Transaction) => formatDate(t.criado_em),
              },
              { key: 'produto_id', header: 'Produto',
                render: (t: Transaction) => findProductName(t.produto_id),
              },
              { key: 'tipo', header: 'Tipo', align: 'center',
                render: (t: Transaction) => (
                  <Badge variant={t.tipo === 'ENTRADA' ? 'success' : 'danger'}>
                    {t.tipo}
                  </Badge>
                ),
              },
              { key: 'quantidade', header: 'Qtd.', align: 'center' },
              { key: 'observacao', header: 'Observação',
                render: (t: Transaction) => t.observacao || '—',
              },
            ]}
            data={transactions}
            loading={loading}
            emptyMessage="Nenhuma movimentação registrada"
          />
        </section>
      </div>
    </div>
  );
}
