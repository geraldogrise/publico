import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { postRepository } from "@/server/repositories/postRepository";
import { categoriaRepository } from "@/server/repositories/categoriaRepository";
import { comentarioRepository } from "@/server/repositories/comentarioRepository";
import LogoutButton from "./LogoutButton";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Protecao no server: sem sessao, redireciona para /login.
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const [posts, totalCategorias, totalComentarios] = await Promise.all([
    postRepository.listar(),
    categoriaRepository.contar(),
    comentarioRepository.contar(),
  ]);

  return (
    <main className={styles.container}>
      <header className={styles.topo}>
        <div>
          <h1 className={styles.saudacao}>
            Ola, {session.user?.name ?? "usuario"}
          </h1>
          <p className={styles.papel}>
            {session.user?.email} &middot; Papel: {session.user?.papel ?? "-"}
          </p>
        </div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.linkNav}>
            Inicio
          </Link>
          <Link href="/api-docs" className={styles.linkNav}>
            API Docs
          </Link>
          <LogoutButton />
        </nav>
      </header>

      <section className={styles.metricas}>
        <div className={styles.metrica}>
          <p className={styles.metricaNumero}>{posts.length}</p>
          <p className={styles.metricaLabel}>Artigos</p>
        </div>
        <div className={styles.metrica}>
          <p className={styles.metricaNumero}>{totalCategorias}</p>
          <p className={styles.metricaLabel}>Categorias</p>
        </div>
        <div className={styles.metrica}>
          <p className={styles.metricaNumero}>{totalComentarios}</p>
          <p className={styles.metricaLabel}>Comentarios</p>
        </div>
      </section>

      <section className={styles.secao}>
        <h2 className={styles.secaoTitulo}>Artigos recentes</h2>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Categoria</th>
              <th>Autor</th>
              <th>Comentarios</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.titulo}</td>
                <td>{post.categoria?.nome ?? "-"}</td>
                <td>{post.autor?.nome ?? "-"}</td>
                <td>{post._count.comentarios}</td>
                <td>
                  <span
                    className={`${styles.tag} ${
                      post.publicado ? styles.tagPublicado : styles.tagRascunho
                    }`}
                  >
                    {post.publicado ? "Publicado" : "Rascunho"}
                  </span>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5}>
                  Nenhum artigo. Rode o seed: <code>npm run prisma:seed</code>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
