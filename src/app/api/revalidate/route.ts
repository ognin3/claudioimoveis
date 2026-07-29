import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { NextResponse, type NextRequest } from "next/server";
import { tagsParaDocumento } from "@/lib/sanity/tags";

/**
 * Webhook do Sanity: chamado quando o corretor publica algo no Studio.
 *
 * `revalidateTag` e nao `updateTag` — `updateTag` so funciona dentro de Server
 * Action e lancaria erro aqui. Ver CLAUDE.md secao 2.
 *
 * A assinatura do corpo e conferida com SANITY_REVALIDATE_SECRET; sem isso
 * qualquer um poderia derrubar o cache do site em looping.
 */

type CorpoWebhook = {
  _type: string;
  slug?: { current?: string };
};

export async function POST(requisicao: NextRequest) {
  const segredo = process.env.SANITY_REVALIDATE_SECRET;
  if (!segredo) {
    return NextResponse.json(
      { erro: "SANITY_REVALIDATE_SECRET nao configurado" },
      { status: 500 },
    );
  }

  let corpo: CorpoWebhook | null;
  let assinaturaValida: boolean;
  try {
    const resultado = await parseBody<CorpoWebhook>(requisicao, segredo);
    corpo = resultado.body;
    assinaturaValida = resultado.isValidSignature === true;
  } catch (erro) {
    return NextResponse.json(
      { erro: erro instanceof Error ? erro.message : "corpo invalido" },
      { status: 400 },
    );
  }

  if (!assinaturaValida) {
    return NextResponse.json({ erro: "assinatura invalida" }, { status: 401 });
  }
  if (!corpo?._type) {
    return NextResponse.json({ erro: "corpo sem _type" }, { status: 400 });
  }

  const tags = tagsParaDocumento(corpo._type, corpo.slug?.current);
  // `{ expire: 0 }` e o padrao que a doc indica para webhook externo: expira na
  // hora, entao o corretor abre o site logo apos publicar e ja ve a mudanca.
  // `"max"` (stale-while-revalidate) serviria a um site de trafego alto, mas aqui
  // deixaria ele achando que a publicacao nao funcionou.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return NextResponse.json({
    revalidado: true,
    tipo: corpo._type,
    tags,
    em: Date.now(),
  });
}
