import { HiOutlineInbox } from 'react-icons/hi2';
import './EmptyState.css';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ message = 'Nenhum dado encontrado', icon }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon || <HiOutlineInbox />}</div>
      <p className="empty-message">{message}</p>
    </div>
  );
}
