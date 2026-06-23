import Link from "next/link";
import ReactSwagger from "./ReactSwagger";
import styles from "./apiDocs.module.css";

export const metadata = {
  title: "Documentacao da API | Portal Corporativo",
};

export default function ApiDocsPage() {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.titulo}>Documentacao da API</h1>
          <p className={styles.subtitulo}>
            Especificacao OpenAPI 3.0 gerada com next-swagger-doc e renderizada
            com Swagger UI.
          </p>
        </div>
        <Link href="/" className={styles.voltar}>
          &larr; Voltar ao inicio
        </Link>
      </div>
      <div className={styles.swaggerWrapper}>
        <ReactSwagger />
      </div>
    </main>
  );
}
