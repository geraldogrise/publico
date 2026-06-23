import { useState } from 'react';
import { useMutation, useQuery } from 'urql';
import { ADD_REVIEW_MUTATION, MOVIE_DETAIL_QUERY } from '../graphql';
import type { Movie } from '../types';
import { Stars } from './Stars';

interface Props {
  movieId: number;
  onClose: () => void;
}

/** Painel de detalhe do filme: sinopse, elenco, avaliacoes + adicionar review. */
export function MovieDetail({ movieId, onClose }: Props) {
  const [{ data, fetching, error }, refetch] = useQuery<{ movieById: Movie }>({
    query: MOVIE_DETAIL_QUERY,
    variables: { id: movieId },
  });

  const [, addReview] = useMutation(ADD_REVIEW_MUTATION);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReview = async () => {
    if (!author) return;
    await addReview({ movieId, author, rating, comment });
    setAuthor('');
    setComment('');
    refetch({ requestPolicy: 'network-only' });
  };

  if (fetching) return <div className="detail">Carregando...</div>;
  if (error || !data?.movieById) return <div className="detail">Erro ao carregar.</div>;

  const m = data.movieById;

  return (
    <div className="detail">
      <button className="detail-close" onClick={onClose}>
        ×
      </button>
      <h2>
        {m.title} <span className="muted">({m.releaseYear})</span>
      </h2>
      <div className="detail-meta">
        <Stars value={m.averageRating} /> <span className="muted">({m.reviewCount} avaliacoes)</span>
        <span className="muted"> · {m.durationMinutes} min</span>
      </div>
      <div className="chips">
        {m.genres.map((g) => (
          <span key={g.name} className="chip">
            {g.name}
          </span>
        ))}
      </div>
      <p>{m.synopsis}</p>

      <h3>Elenco</h3>
      <ul className="cast">
        {(m.cast ?? []).map((c, i) => (
          <li key={i}>
            <strong>{c.person.name}</strong>{' '}
            {c.role === 'DIRECTOR' ? '(Diretor)' : c.character ? `como ${c.character}` : '(Ator)'}
          </li>
        ))}
      </ul>

      <h3>Avaliacoes</h3>
      <div className="reviews">
        {(m.reviews ?? []).map((r, i) => (
          <div key={i} className="review">
            <div className="review-head">
              <strong>{r.author}</strong>
              <Stars value={r.rating} />
            </div>
            <p>{r.comment}</p>
          </div>
        ))}
        {(m.reviews ?? []).length === 0 && <p className="muted">Sem avaliacoes ainda.</p>}
      </div>

      <h3>Deixe sua avaliacao</h3>
      <div className="review-form">
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Seu nome" />
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} estrelas
            </option>
          ))}
        </select>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comentario"
        />
        <button className="btn btn-primary" onClick={submitReview}>
          Enviar
        </button>
      </div>
    </div>
  );
}
