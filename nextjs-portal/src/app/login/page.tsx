"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@demo.com");
  const [senha, setSenha] = useState("123456");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const resultado = await signIn("credentials", {
      email,
      senha,
      redirect: false,
    });

    setCarregando(false);

    if (resultado?.error) {
      setErro("Email ou senha invalidos.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.titulo}>Entrar</h1>
        <p className={styles.subtitulo}>Acesse o dashboard do portal.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {erro && <div className={styles.erro}>{erro}</div>}

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              className={styles.input}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button className={styles.botao} type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className={styles.demo}>
          Demo: <code>admin@demo.com</code> / <code>123456</code>
        </p>
        <Link href="/" className={styles.voltar}>
          Voltar ao inicio
        </Link>
      </div>
    </div>
  );
}
