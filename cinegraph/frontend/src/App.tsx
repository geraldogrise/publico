import { useState } from 'react';
import { useQuery } from 'urql';
import { MOVIES_QUERY } from './graphql';
import type { Movie } from './types';
import { setToken } from './lib/urql';
import { LoginBar } from './components/LoginBar';
import { MovieDetail } from './components/MovieDetail';
import { AddMovieForm } from './components/AddMovieForm';
import { Stars } from './components/Stars';

export function App() {
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem('cg_user'),
  );
  const [selected, setSelected] = useState<number | null>(null);

  const [{ data, fetching, error }, refetch] = useQuery<{ movies: Movie[] }>({
    query: MOVIES_QUERY,
  });

  const handleLogin = (name: string) => {
    setUserName(name);
    localStorage.setItem('cg_user', name);
  };
  const handleLogout = () => {
    setToken(null);
    setUserName(null);
    localStorage.removeItem('cg_user');
  };
  const reloadMovies = () => refetch({ requestPolicy: 'network-only' });

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-icon">🎬</span>
          <div>
            <h1>CineGraph</h1>
            <p>Catalogo de filmes — GraphQL (.NET 9 + HotChocolate)</p>
          </div>
        </div>
        <LoginBar userName={userName} onLogin={handleLogin} onLogout={handleLogout} />
      </header>

      {userName && <AddMovieForm onAdded={reloadMovies} />}

      <main className="content">
        <section className="movies">
          <h2>Filmes</h2>
          {fetching && <p>Carregando catalogo...</p>}
          {error && (
            <p className="error">
              Erro ao conectar no GraphQL. A API esta rodando em :5245? ({error.message})
            </p>
          )}
          <div className="movie-grid">
            {(data?.movies ?? []).map((m) => (
              <button
                key={m.id}
                className={`movie-card ${selected === m.id ? 'active' : ''}`}
                onClick={() => setSelected(m.id)}
              >
                <div className="movie-card-top">
                  <h3>{m.title}</h3>
                  <span className="year">{m.releaseYear}</span>
                </div>
                <Stars value={m.averageRating} />
                <div className="chips">
                  {m.genres.map((g) => (
                    <span key={g.name} className="chip">
                      {g.name}
                    </span>
                  ))}
                </div>
                <span className="muted">
                  {m.reviewCount} avaliacoes · {m.durationMinutes} min
                </span>
              </button>
            ))}
          </div>
        </section>

        {selected !== null && (
          <aside className="detail-panel">
            <MovieDetail movieId={selected} onClose={() => setSelected(null)} />
          </aside>
        )}
      </main>
    </div>
  );
}
