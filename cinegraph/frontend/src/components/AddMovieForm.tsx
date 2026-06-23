import { useState } from 'react';
import { useMutation } from 'urql';
import { ADD_MOVIE_MUTATION } from '../graphql';

/** Formulario de novo filme (requer autenticacao - mutation protegida com JWT). */
export function AddMovieForm({ onAdded }: { onAdded: () => void }) {
  const [{ fetching }, addMovie] = useMutation(ADD_MOVIE_MUTATION);
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [year, setYear] = useState(2024);
  const [duration, setDuration] = useState(120);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    setMsg(null);
    const result = await addMovie({ title, synopsis, year, duration });
    if (result.error) {
      setMsg('Erro: ' + result.error.message);
      return;
    }
    setTitle('');
    setSynopsis('');
    setMsg('Filme adicionado!');
    onAdded();
  };

  return (
    <div className="add-movie">
      <h3>Adicionar filme (admin)</h3>
      <div className="add-movie-grid">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titulo" />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          placeholder="Ano"
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Duracao (min)"
        />
        <input
          className="wide"
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          placeholder="Sinopse"
        />
        <button className="btn btn-primary" onClick={submit} disabled={fetching || !title}>
          {fetching ? '...' : 'Adicionar'}
        </button>
      </div>
      {msg && <p className="muted">{msg}</p>}
    </div>
  );
}
