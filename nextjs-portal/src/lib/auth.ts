import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { usuarioRepository } from "@/server/repositories/usuarioRepository";

/**
 * Configuracao central do NextAuth.
 * - Provider: Credentials (email + senha)
 * - Estrategia de sessao: JWT
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          return null;
        }

        const usuario = await usuarioRepository.buscarPorEmail(credentials.email);
        if (!usuario) {
          return null;
        }

        const senhaValida = await bcrypt.compare(credentials.senha, usuario.senhaHash);
        if (!senhaValida) {
          return null;
        }

        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
          papel: usuario.papel,
        };
      },
    }),
    // OAuth 2.0 (habilitados automaticamente quando as variaveis de ambiente existem).
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.papel = user.papel;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.papel = token.papel as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
