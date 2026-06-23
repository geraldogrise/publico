import { createClient, fetchExchange, cacheExchange } from 'urql';

/** Endpoint GraphQL do backend CineGraph (.NET 9 + HotChocolate). */
const API_URL = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:5245/graphql';

const TOKEN_KEY = 'cg_token';
let token: string | null = localStorage.getItem(TOKEN_KEY);

export function setToken(value: string | null): void {
  token = value;
  if (value) localStorage.setItem(TOKEN_KEY, value);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return token;
}

/** Cliente urql: injeta o JWT (quando houver) em cada requisicao. */
export const urqlClient = createClient({
  url: API_URL,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () =>
    token ? { headers: { authorization: `Bearer ${token}` } } : {},
});
