import { NextRequest, NextResponse } from "next/server";
import { postService, ValidacaoError } from "@/server/services/postService";

/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     summary: Lista todos os posts
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *   post:
 *     tags: [Posts]
 *     summary: Cria um novo post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoPost'
 *     responses:
 *       201:
 *         description: Post criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Dados invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
export async function GET() {
  const posts = await postService.listar();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const post = await postService.criar({
      titulo: body.titulo,
      conteudo: body.conteudo,
      resumo: body.resumo,
      publicado: body.publicado,
      autorId: body.autorId,
      categoriaId: body.categoriaId,
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof ValidacaoError) {
      return NextResponse.json({ erro: error.message }, { status: 400 });
    }
    return NextResponse.json({ erro: "Erro ao criar post." }, { status: 500 });
  }
}
