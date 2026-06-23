import { SAML } from "@node-saml/node-saml";

/**
 * Cria um Service Provider (SP) SAML a partir das variaveis de ambiente.
 * Retorna null se nao estiver configurado (assim o app roda sem SAML).
 *
 * Para testar, registre este SP em um IdP de teste (ex.: https://samltest.id)
 * e preencha SAML_ENTRY_POINT e SAML_IDP_CERT no .env.local.
 */
export function getSaml(): SAML | null {
  const entryPoint = process.env.SAML_ENTRY_POINT;
  const idpCert = process.env.SAML_IDP_CERT;
  if (!entryPoint || !idpCert) return null;

  return new SAML({
    entryPoint,
    idpCert,
    issuer: process.env.SAML_ISSUER ?? "nextjs-portal-sp",
    callbackUrl:
      process.env.SAML_CALLBACK_URL ?? "http://localhost:3000/api/saml/acs",
    // Para a demo deixamos a validacao de assinatura mais permissiva.
    wantAssertionsSigned: false,
    wantAuthnResponseSigned: false,
  });
}

export const SAML_NOT_CONFIGURED = {
  error:
    "SAML nao configurado. Defina SAML_ENTRY_POINT e SAML_IDP_CERT (veja .env.example).",
};
