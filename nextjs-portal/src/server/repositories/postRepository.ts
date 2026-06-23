import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const includePadrao = {
  autor: { select: { id: true, nome: true, email: true } },
  categoria: { select: { id: true, nome: true, slug: true } },
  _count: { select: { comentarios: true } },
} satisfies Prisma.PostInclude;

/**
 * Repositorio de Posts/Artigos — acesso a dados isolado.
 */
export const postRepository = {
  listar() {
    return prisma.post.findMany({
      orderBy: { criadoEm: "desc" },
      include: includePadrao,
    });
  },

  buscarPorId(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        ...includePadrao,
        comentarios: {
          orderBy: { criadoEm: "desc" },
          include: { autor: { select: { id: true, nome: true } } },
        },
      },
    });
  },

  criar(dados: Prisma.PostUncheckedCreateInput) {
    return prisma.post.create({ data: dados, include: includePadrao });
  },

  atualizar(id: string, dados: Prisma.PostUncheckedUpdateInput) {
    return prisma.post.update({ where: { id }, data: dados, include: includePadrao });
  },

  remover(id: string) {
    return prisma.post.delete({ where: { id } });
  },

  contar() {
    return prisma.post.count();
  },
};
