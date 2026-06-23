import { postRepository } from "@/server/repositories/postRepository";

export interface CriarPostDTO {
  titulo: string;
  conteudo: string;
  resumo?: string;
  publicado?: boolean;
  autorId: string;
  categoriaId?: string | null;
}

export interface AtualizarPostDTO {
  titulo?: string;
  conteudo?: string;
  resumo?: string;
  publicado?: boolean;
  categoriaId?: string | null;
}

export class ValidacaoError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ValidacaoError";
  }
}

function gerarSlug(texto: string): string {
  // ̀-ͯ = marcas diacriticas combinantes (acentos) a remover apos NFD.
  const base = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  // Sufixo curto para garantir unicidade do slug.
  const sufixo = Math.random().toString(36).slice(2, 7);
  return `${base || "post"}-${sufixo}`;
}

/**
 * Servico de Posts — regras de negocio (validacao, geracao de slug).
 * Orquestra o repositorio sem expor detalhes de persistencia.
 */
export const postService = {
  listar: () => postRepository.listar(),

  obter: (id: string) => postRepository.buscarPorId(id),

  async criar(dto: CriarPostDTO) {
    if (!dto.titulo?.trim()) throw new ValidacaoError("O titulo e obrigatorio.");
    if (!dto.conteudo?.trim()) throw new ValidacaoError("O conteudo e obrigatorio.");
    if (!dto.autorId?.trim()) throw new ValidacaoError("O autor e obrigatorio.");

    return postRepository.criar({
      titulo: dto.titulo.trim(),
      slug: gerarSlug(dto.titulo),
      conteudo: dto.conteudo.trim(),
      resumo: dto.resumo?.trim() || null,
      publicado: dto.publicado ?? false,
      autorId: dto.autorId,
      categoriaId: dto.categoriaId ?? null,
    });
  },

  async atualizar(id: string, dto: AtualizarPostDTO) {
    const existente = await postRepository.buscarPorId(id);
    if (!existente) throw new ValidacaoError("Post nao encontrado.");

    return postRepository.atualizar(id, {
      titulo: dto.titulo?.trim() ?? undefined,
      conteudo: dto.conteudo?.trim() ?? undefined,
      resumo: dto.resumo?.trim() ?? undefined,
      publicado: dto.publicado ?? undefined,
      categoriaId: dto.categoriaId ?? undefined,
    });
  },

  async remover(id: string) {
    const existente = await postRepository.buscarPorId(id);
    if (!existente) throw new ValidacaoError("Post nao encontrado.");
    return postRepository.remover(id);
  },
};
