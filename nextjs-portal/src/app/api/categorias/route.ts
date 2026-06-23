import { NextResponse } from "next/server";
import { categoriaRepository } from "@/server/repositories/categoriaRepository";

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     tags: [Categorias]
 *     summary: Lista todas as categorias
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 */
export async function GET() {
  const categorias = await categoriaRepository.listar();
  return NextResponse.json(categorias);
}
