import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Repositorio de Comentarios.
 */
export const comentarioRepository = {
  listar() {
    return prisma.comentario.findMany({
      orderBy: { criadoEm: "desc" },
      include: {
        autor: { select: { id: true, nome: true } },
        post: { select: { id: true, titulo: true } },
      },
    });
  },

  criar(dados: Prisma.ComentarioUncheckedCreateInput) {
    return prisma.comentario.create({ data: dados });
  },

  contar() {
    return prisma.comentario.count();
  },
};
