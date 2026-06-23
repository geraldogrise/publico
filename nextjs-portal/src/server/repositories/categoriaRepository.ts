import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Repositorio de Categorias.
 */
export const categoriaRepository = {
  listar() {
    return prisma.categoria.findMany({
      orderBy: { nome: "asc" },
      include: { _count: { select: { posts: true } } },
    });
  },

  buscarPorId(id: string) {
    return prisma.categoria.findUnique({ where: { id } });
  },

  criar(dados: Prisma.CategoriaCreateInput) {
    return prisma.categoria.create({ data: dados });
  },

  contar() {
    return prisma.categoria.count();
  },
};
