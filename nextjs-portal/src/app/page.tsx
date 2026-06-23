import Link from "next/link";
import styles from "./page.module.css";
import { postRepository } from "@/server/repositories/postRepository";
import { categoriaRepository } from "@/server/repositories/categoriaRepository";
import { comentarioRepository } from "@/server/repositories/comentarioRepository";

// Server Component: busca estatisticas direto da camada de dados.
export const dynamic = "force-dynamic";

export default async function Home() {
  let totalPosts = 0;
  let totalCategorias = 0;
  let totalComentarios = 0;

  try {
    [totalPosts, totalCategorias, totalComentarios] = await Promise.all([
      postRepository.contar(),
      categoriaRepository.contar(),
      comentarioRepository.contar(),
    ]);
  } catch {
    // Banco ainda nao migrado/seedado: mantem zeros.
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <span className={styles.badge}>Projeto de Portfolio Full-Stack</span>
        <h1 className={styles.titulo}>Portal Corporativo</h1>
        <p className={styles.descricao}>
          Plataforma interna construida com Next.js (App Router), autenticacao via
          NextAuth (JWT), camada de dados com Prisma + SQLite e API REST
          documentada com Swagger.
        </p>
        <div className={styles.acoes}>
          <Link href="/login" className={styles.botaoPrimario}>
            Acessar Dashboard
          </Link>
          <Link href="/api-docs" className={styles.botaoSecundario}>
            Documentacao da API
          </Link>
        </div>
      </section>

      <section className={styles.cards}>
        <div className={styles.card}>
          <p className={styles.cardNumero}>{totalPosts}</p>
          <p className={styles.cardLabel}>Artigos</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardNumero}>{totalCategorias}</p>
          <p className={styles.cardLabel}>Categorias</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardNumero}>{totalComentarios}</p>
          <p className={styles.cardLabel}>Comentarios</p>
        </div>
      </section>

      <section className={styles.recursos}>
        <article className={styles.recurso}>
          <h3>Next.js App Router</h3>
          <p>Server Components, Route Handlers e renderizacao no servidor.</p>
        </article>
        <article className={styles.recurso}>
          <h3>NextAuth (JWT)</h3>
          <p>Provider Credentials e sessao baseada em JWT.</p>
        </article>
        <article className={styles.recurso}>
          <h3>Prisma + SQLite</h3>
          <p>Quatro entidades com seed e repositorios desacoplados.</p>
        </article>
        <article className={styles.recurso}>
          <h3>Swagger / OpenAPI</h3>
          <p>API REST documentada e exploravel em /api-docs.</p>
        </article>
      </section>

      <div className={styles.demoBox}>
        Login de demonstracao: <code>admin@demo.com</code> /{" "}
        <code>123456</code>
      </div>
    </main>
  );
}
