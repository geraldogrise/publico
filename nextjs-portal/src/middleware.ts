export { default } from "next-auth/middleware";

/**
 * Middleware do NextAuth: protege /dashboard (e subrotas).
 * Usuarios nao autenticados sao redirecionados para /login.
 */
export const config = {
  matcher: ["/dashboard/:path*"],
};
