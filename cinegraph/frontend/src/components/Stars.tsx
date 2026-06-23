/** Renderiza uma nota (0..5) como estrelas. */
export function Stars({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span className="stars" title={value.toFixed(1)}>
      {'★'.repeat(full)}
      {'☆'.repeat(5 - full)}
    </span>
  );
}
