import { PrismaClient, Papel } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  // Limpa dados existentes (ordem importa por causa das FKs)
  await prisma.comentario.deleteMany();
  await prisma.post.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();

  // Usuarios
  const senhaAdmin = await bcrypt.hash("123456", 10);
  const admin = await prisma.usuario.create({
    data: {
      nome: "Administrador",
      email: "admin@demo.com",
      senhaHash: senhaAdmin,
      papel: Papel.ADMIN,
    },
  });

  const editor = await prisma.usuario.create({
    data: {
      nome: "Maria Editora",
      email: "editor@demo.com",
      senhaHash: await bcrypt.hash("123456", 10),
      papel: Papel.EDITOR,
    },
  });

  // Categorias
  const categoriaTech = await prisma.categoria.create({
    data: {
      nome: "Tecnologia",
      slug: "tecnologia",
      descricao: "Artigos sobre tecnologia e desenvolvimento.",
    },
  });

  const categoriaRH = await prisma.categoria.create({
    data: {
      nome: "Recursos Humanos",
      slug: "recursos-humanos",
      descricao: "Comunicados e novidades de RH.",
    },
  });

  // Posts
  const post1 = await prisma.post.create({
    data: {
      titulo: "Bem-vindo ao Portal Corporativo",
      slug: "bem-vindo-ao-portal",
      resumo: "Conheca a nova plataforma interna da empresa.",
      conteudo:
        "Este e o primeiro artigo publicado no nosso portal corporativo, construido com Next.js, NextAuth e Prisma.",
      publicado: true,
      autorId: admin.id,
      categoriaId: categoriaTech.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      titulo: "Politica de Home Office 2026",
      slug: "politica-home-office-2026",
      resumo: "Atualizacoes sobre trabalho remoto e hibrido.",
      conteudo:
        "A partir deste ano, adotamos um modelo hibrido flexivel. Confira os detalhes neste comunicado oficial de RH.",
      publicado: true,
      autorId: editor.id,
      categoriaId: categoriaRH.id,
    },
  });

  await prisma.post.create({
    data: {
      titulo: "Rascunho: Roadmap de Produto",
      slug: "rascunho-roadmap-produto",
      resumo: "Em construcao.",
      conteudo: "Conteudo ainda nao publicado.",
      publicado: false,
      autorId: admin.id,
      categoriaId: categoriaTech.id,
    },
  });

  // Comentarios
  await prisma.comentario.createMany({
    data: [
      {
        conteudo: "Excelente iniciativa, parabens a todos!",
        postId: post1.id,
        autorId: editor.id,
      },
      {
        conteudo: "Otimo, finalmente um portal moderno.",
        postId: post1.id,
        autorId: admin.id,
      },
      {
        conteudo: "Fico feliz com o modelo hibrido.",
        postId: post2.id,
        autorId: admin.id,
      },
    ],
  });

  console.log("Seed concluido com sucesso!");
  console.log("Login demo: admin@demo.com / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
