import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register
  const [regNome, setRegNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Bem-vindo de volta!');
      navigate('/');
    } catch {
      toast.error('E-mail ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register({ email: regEmail, nome: regNome, password: regPassword });
      toast.success('Conta criada! Faça login.');
      setIsRegister(false);
      setEmail(regEmail);
    } catch {
      toast.error('Erro ao criar conta. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
      </div>
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">📦</span>
          <h1>Inventário</h1>
          <p>{isRegister ? 'Crie sua conta para acessar' : 'Acesse o sistema de gestão'}</p>
        </div>

        {!isRegister ? (
          <form onSubmit={handleLogin} className="login-form">
            <FormField
              label="E-mail"
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormField
              label="Senha"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" loading={loading} className="login-btn">
              Entrar
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <FormField
              label="Nome completo"
              required
              placeholder="Seu nome"
              value={regNome}
              onChange={(e) => setRegNome(e.target.value)}
            />
            <FormField
              label="E-mail"
              type="email"
              required
              placeholder="seu@email.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
            <FormField
              label="Senha"
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              minLength={6}
            />
            <Button type="submit" loading={loading} className="login-btn">
              Criar Conta
            </Button>
          </form>
        )}

        <div className="login-toggle">
          <span>{isRegister ? 'Já tem uma conta?' : 'Não tem conta?'}</span>
          <button type="button" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Fazer login' : 'Criar conta'}
          </button>
        </div>
      </div>
    </div>
  );
}
