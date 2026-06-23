import { NextRequest, NextResponse } from "next/server";
import { getSaml, SAML_NOT_CONFIGURED } from "@/lib/saml";

export const runtime = "nodejs";

/**
 * Assertion Consumer Service (ACS): recebe o POST do IdP, valida a assercao
 * SAML e cria uma sessao simples (cookie) redirecionando ao dashboard.
 */
export async function POST(req: NextRequest) {
  const saml = getSaml();
  if (!saml) return NextResponse.json(SAML_NOT_CONFIGURED, { status: 503 });

  const form = await req.formData();
  const container: Record<string, string> = {
    SAMLResponse: String(form.get("SAMLResponse") ?? ""),
  };
  const relayState = form.get("RelayState");
  if (relayState) container.RelayState = String(relayState);

  try {
    const { profile } = await saml.validatePostResponseAsync(container);
    const email = profile?.nameID ?? "saml-user";

    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    res.cookies.set("saml_user", email, { httpOnly: true, path: "/" });
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Falha ao validar a assercao SAML.", detail: String(err) },
      { status: 401 },
    );
  }
}
