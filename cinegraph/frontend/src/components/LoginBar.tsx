import { useState } from 'react';
import { useMutation } from 'urql';
import { LOGIN_MUTATION } from '../graphql';
import { setToken } from '../lib/urql';

interface Props {
  userName: string | null;
  onLogin: (name: string) => void;
  onLogout: () => void;
}

/** Barra de login (mutation GraphQL -> guarda o JWT). */
export function LoginBar({ userName, onLogin, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('123456');
  const [{ fetching }, login] = useMutation(LOGIN_MUTATION);
  const [error, setError] = useState<string | null>(null);

  if (userName) {
    return (
      <div className="login-bar">
        <span>
          Ola, <strong>{userName}</strong>
        </span>
        <button className="btn btn-ghost" onClick={onLogout}>
          Sair
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="login-bar">
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Entrar
        </button>
      </div>
    );
  }

  const handleSubmit = async () => {
    setError(null);
    const result = await login({ email, password });
    if (result.error || !result.data?.login) {
      setError('Credenciais invalidas.');
      return;
    }
    setToken(result.data.login.token);
    onLogin(result.data.login.name);
    setOpen(false);
  };

  return (
    <div className="login-bar login-form">
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button className="btn btn-primary" onClick={handleSubmit} disabled={fetching}>
        {fetching ? '...' : 'Login'}
      </button>
      {error && <span className="error">{error}</span>}
    </div>
  );
}
