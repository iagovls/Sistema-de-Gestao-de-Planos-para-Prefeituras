import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Variáveis de ambiente públicas (injetadas no bundle)
  // Define um padrão '/api' quando não houver NEXT_PUBLIC_API_URL definido
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  },

  // Em desenvolvimento (npm run dev), proxia chamadas para /api para o backend local
  async rewrites() {
    // Só aplica no modo de desenvolvimento para não conflitar com o Nginx em Docker/produção
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:8080/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
