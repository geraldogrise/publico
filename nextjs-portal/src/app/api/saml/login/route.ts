import { NextRequest, NextResponse } from "next/server";
import { getSaml, SAML_NOT_CONFIGURED } from "@/lib/saml";

export const runtime = "nodejs";

/** Inicia o login SAML: redireciona o usuario para o IdP (SSO). */
export async function GET(req: NextRequest) {
  const saml = getSaml();
  if (!saml) return NextResponse.json(SAML_NOT_CONFIGURED, { status: 503 });

  const host = req.headers.get("host") ?? undefined;
  const url = await saml.getAuthorizeUrlAsync("", host, {});
  return NextResponse.redirect(url);
}
