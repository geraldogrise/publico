import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/**
 * Repositorio de Usuarios — encapsula o acesso a dados (SRP).
 * As camadas superiores (servicos / route handlers) nao conhecem o Prisma.
 */
export const usuarioRepository = {
  listar() {
    return prisma.usuario.findMany({
      orderBy: { criadoEm: "desc" },
      select: {
        id: true,
        nome: true,
        email: true,
        papel: true,
        criadoEm: true,
      },
    });
  },

  buscarPorId(id: string) {
    return prisma.usuario.findUnique({ where: { id } });
  },

  buscarPorEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  },

  criar(dados: Prisma.UsuarioCreateInput) {
    return prisma.usuario.create({ data: dados });
  },
};
