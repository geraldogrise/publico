jest.mock("@/lib/prisma", () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    usuario: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn() },
    categoria: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), count: jest.fn() },
    comentario: { findMany: jest.fn(), create: jest.fn(), count: jest.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { postRepository } from "@/server/repositories/postRepository";
import { usuarioRepository } from "@/server/repositories/usuarioRepository";
import { categoriaRepository } from "@/server/repositories/categoriaRepository";
import { comentarioRepository } from "@/server/repositories/comentarioRepository";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const p = prisma as any;

describe("postRepository", () => {
  it("cobre todos os metodos", async () => {
    p.post.findMany.mockResolvedValue([]);
    await postRepository.listar();
    expect(p.post.findMany).toHaveBeenCalled();

    p.post.findUnique.mockResolvedValue(null);
    await postRepository.buscarPorId("1");
    expect(p.post.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "1" } }),
    );

    p.post.create.mockResolvedValue({});
    await postRepository.criar({} as never);
    expect(p.post.create).toHaveBeenCalled();

    p.post.update.mockResolvedValue({});
    await postRepository.atualizar("1", {} as never);
    expect(p.post.update).toHaveBeenCalled();

    p.post.delete.mockResolvedValue({});
    await postRepository.remover("1");
    expect(p.post.delete).toHaveBeenCalledWith({ where: { id: "1" } });

    p.post.count.mockResolvedValue(3);
    expect(await postRepository.contar()).toBe(3);
  });
});

describe("usuarioRepository", () => {
  it("cobre todos os metodos", async () => {
    p.usuario.findMany.mockResolvedValue([]);
    await usuarioRepository.listar();
    expect(p.usuario.findMany).toHaveBeenCalled();

    p.usuario.findUnique.mockResolvedValue(null);
    await usuarioRepository.buscarPorId("1");
    expect(p.usuario.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });

    await usuarioRepository.buscarPorEmail("a@b.com");
    expect(p.usuario.findUnique).toHaveBeenCalledWith({ where: { email: "a@b.com" } });

    p.usuario.create.mockResolvedValue({});
    await usuarioRepository.criar({} as never);
    expect(p.usuario.create).toHaveBeenCalled();
  });
});

describe("categoriaRepository", () => {
  it("cobre todos os metodos", async () => {
    p.categoria.findMany.mockResolvedValue([]);
    await categoriaRepository.listar();
    expect(p.categoria.findMany).toHaveBeenCalled();

    p.categoria.findUnique.mockResolvedValue(null);
    await categoriaRepository.buscarPorId("1");
    expect(p.categoria.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });

    p.categoria.create.mockResolvedValue({});
    await categoriaRepository.criar({} as never);
    expect(p.categoria.create).toHaveBeenCalled();

    p.categoria.count.mockResolvedValue(2);
    expect(await categoriaRepository.contar()).toBe(2);
  });
});

describe("comentarioRepository", () => {
  it("cobre todos os metodos", async () => {
    p.comentario.findMany.mockResolvedValue([]);
    await comentarioRepository.listar();
    expect(p.comentario.findMany).toHaveBeenCalled();

    p.comentario.create.mockResolvedValue({});
    await comentarioRepository.criar({} as never);
    expect(p.comentario.create).toHaveBeenCalled();

    p.comentario.count.mockResolvedValue(5);
    expect(await comentarioRepository.contar()).toBe(5);
  });
});
