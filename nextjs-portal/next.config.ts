import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Gera servidor standalone para imagem Docker enxuta.
  output: "standalone",
  eslint: {
    // O lint pode ser executado separadamente com `npm run lint`.
    // Mantemos o build resiliente para o ambiente de demonstracao.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
