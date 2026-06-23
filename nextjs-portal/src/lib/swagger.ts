import { createSwaggerSpec } from "next-swagger-doc";

/**
 * Gera o documento OpenAPI a partir das anotacoes JSDoc (@swagger)
 * presentes nos route handlers em src/app/api.
 */
export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Portal Corporativo - API",
        version: "1.0.0",
        description:
          "API REST do Portal Corporativo. Recursos: Posts, Categorias, Comentarios e Usuarios.",
      },
      components: {
        schemas: {
          Post: {
            type: "object",
            properties: {
              id: { type: "string" },
              titulo: { type: "string" },
              slug: { type: "string" },
              resumo: { type: "string", nullable: true },
              conteudo: { type: "string" },
              publicado: { type: "boolean" },
              criadoEm: { type: "string", format: "date-time" },
            },
          },
          NovoPost: {
            type: "object",
            required: ["titulo", "conteudo", "autorId"],
            properties: {
              titulo: { type: "string" },
              conteudo: { type: "string" },
              resumo: { type: "string" },
              publicado: { type: "boolean" },
              autorId: { type: "string" },
              categoriaId: { type: "string", nullable: true },
            },
          },
          Categoria: {
            type: "object",
            properties: {
              id: { type: "string" },
              nome: { type: "string" },
              slug: { type: "string" },
              descricao: { type: "string", nullable: true },
            },
          },
          Comentario: {
            type: "object",
            properties: {
              id: { type: "string" },
              conteudo: { type: "string" },
              postId: { type: "string" },
              autorId: { type: "string" },
            },
          },
          Erro: {
            type: "object",
            properties: {
              erro: { type: "string" },
            },
          },
        },
      },
      tags: [
        { name: "Posts", description: "Gestao de artigos do portal" },
        { name: "Categorias", description: "Categorias de conteudo" },
        { name: "Comentarios", description: "Comentarios dos artigos" },
        { name: "Usuarios", description: "Usuarios do portal" },
      ],
    },
  });
  return spec;
};
