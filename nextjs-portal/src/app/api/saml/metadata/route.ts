import { NextResponse } from "next/server";
import { getSaml, SAML_NOT_CONFIGURED } from "@/lib/saml";

export const runtime = "nodejs";

/** Metadados do SP SAML (para registrar este servico no IdP). */
export async function GET() {
  const saml = getSaml();
  if (!saml) return NextResponse.json(SAML_NOT_CONFIGURED, { status: 503 });

  const xml = saml.generateServiceProviderMetadata(null, null);
  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
