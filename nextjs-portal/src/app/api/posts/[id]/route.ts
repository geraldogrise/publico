import { NextRequest, NextResponse } from "next/server";
import { postService, ValidacaoError } from "@/server/services/postService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Obtem um post pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post nao encontrado
 *   put:
 *     tags: [Posts]
 *     summary: Atualiza um post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoPost'
 *     responses:
 *       200:
 *         description: Post atualizado
 *       400:
 *         description: Dados invalidos
 *   delete:
 *     tags: [Posts]
 *     summary: Remove um post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post removido
 *       404:
 *         description: Post nao encontrado
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const post = await postService.obter(id);
  if (!post) {
    return NextResponse.json({ erro: "Post nao encontrado." }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const post = await postService.atualizar(id, body);
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof ValidacaoError) {
      return NextResponse.json({ erro: error.message }, { status: 400 });
    }
    return NextResponse.json({ erro: "Erro ao atualizar post." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await postService.remover(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ValidacaoError) {
      return NextResponse.json({ erro: error.message }, { status: 404 });
    }
    return NextResponse.json({ erro: "Erro ao remover post." }, { status: 500 });
  }
}
