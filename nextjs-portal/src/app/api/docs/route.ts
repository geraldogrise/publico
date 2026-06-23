import { NextResponse } from "next/server";
import { getApiDocs } from "@/lib/swagger";

/**
 * Serve o documento OpenAPI (JSON) gerado a partir das anotacoes @swagger.
 */
export async function GET() {
  const spec = await getApiDocs();
  return NextResponse.json(spec);
}
