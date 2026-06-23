import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { usuarioRepository } from "@/server/repositories/usuarioRepository";

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Lista usuarios (requer autenticacao)
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Nao autenticado
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ erro: "Nao autenticado." }, { status: 401 });
  }
  const usuarios = await usuarioRepository.listar();
  return NextResponse.json(usuarios);
}
