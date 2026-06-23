/** Formatacao monetaria em BRL usando Intl.NumberFormat pt-BR. */
const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatBRL(value: number): string {
  return formatter.format(value ?? 0);
}

export function useCurrency() {
  return { formatBRL };
}
