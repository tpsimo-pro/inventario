import type { ReactNode } from 'react';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}

export default function StatsCard({ title, value, icon, variant = 'default' }: StatsCardProps) {
  return (
    <div className={`stats-card stats-card-${variant}`}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <span className="stats-value">{value}</span>
        <span className="stats-title">{title}</span>
      </div>
    </div>
  );
}
