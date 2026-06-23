jest.mock("@/server/repositories/postRepository", () => ({
  postRepository: {
    listar: jest.fn(),
    buscarPorId: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
    remover: jest.fn(),
  },
}));

import { postService, ValidacaoError } from "@/server/services/postService";
import { postRepository } from "@/server/repositories/postRepository";

const repo = postRepository as jest.Mocked<typeof postRepository>;

describe("postService", () => {
  it("listar e obter delegam ao repositorio", async () => {
    repo.listar.mockResolvedValue([] as never);
    await postService.listar();
    expect(repo.listar).toHaveBeenCalled();

    repo.buscarPorId.mockResolvedValue(null as never);
    await postService.obter("x");
    expect(repo.buscarPorId).toHaveBeenCalledWith("x");
  });

  it("criar valida campos obrigatorios", async () => {
    await expect(
      postService.criar({ titulo: "", conteudo: "c", autorId: "a" }),
    ).rejects.toBeInstanceOf(ValidacaoError);
    await expect(
      postService.criar({ titulo: "t", conteudo: "", autorId: "a" }),
    ).rejects.toBeInstanceOf(ValidacaoError);
    await expect(
      postService.criar({ titulo: "t", conteudo: "c", autorId: "" }),
    ).rejects.toBeInstanceOf(ValidacaoError);
  });

  it("criar gera slug e normaliza os dados", async () => {
    (repo.criar as jest.Mock).mockImplementation(async (d: Record<string, unknown>) => d);
    const r = (await postService.criar({
      titulo: "  Olá Mundo!  ",
      conteudo: " texto ",
      autorId: "a1",
    })) as { titulo: string; slug: string; conteudo: string; publicado: boolean; categoriaId: string | null };

    expect(r.titulo).toBe("Olá Mundo!");
    expect(r.slug).toMatch(/^ola-mundo-/);
    expect(r.conteudo).toBe("texto");
    expect(r.publicado).toBe(false);
    expect(r.categoriaId).toBeNull();
  });

  it("atualizar lanca quando o post nao existe", async () => {
    repo.buscarPorId.mockResolvedValue(null as never);
    await expect(postService.atualizar("x", { titulo: "a" })).rejects.toBeInstanceOf(
      ValidacaoError,
    );
  });

  it("atualizar normaliza e chama o repositorio quando existe", async () => {
    repo.buscarPorId.mockResolvedValue({ id: "x" } as never);
    repo.atualizar.mockResolvedValue({ id: "x" } as never);
    await postService.atualizar("x", { titulo: " Novo ", publicado: true });
    expect(repo.atualizar).toHaveBeenCalledWith(
      "x",
      expect.objectContaining({ titulo: "Novo", publicado: true }),
    );
  });

  it("remover lanca quando nao existe e remove quando existe", async () => {
    repo.buscarPorId.mockResolvedValueOnce(null as never);
    await expect(postService.remover("x")).rejects.toBeInstanceOf(ValidacaoError);

    repo.buscarPorId.mockResolvedValueOnce({ id: "x" } as never);
    repo.remover.mockResolvedValue({ id: "x" } as never);
    await postService.remover("x");
    expect(repo.remover).toHaveBeenCalledWith("x");
  });
});
