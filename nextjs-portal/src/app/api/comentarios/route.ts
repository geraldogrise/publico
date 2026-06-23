import { NextResponse } from "next/server";
import { comentarioRepository } from "@/server/repositories/comentarioRepository";

/**
 * @swagger
 * /api/comentarios:
 *   get:
 *     tags: [Comentarios]
 *     summary: Lista todos os comentarios
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comentario'
 */
export async function GET() {
  const comentarios = await comentarioRepository.listar();
  return NextResponse.json(comentarios);
}
