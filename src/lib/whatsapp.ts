import { site } from "./site";

/**
 * Montagem de links do WhatsApp. Todo CTA do site passa por aqui — nunca montar
 * uma URL wa.me a mao, senao a mensagem sai despadronizada e o corretor perde a
 * referencia de qual imovel gerou o contato.
 */

type OrigemContato =
  | { tipo: "geral" }
  | { tipo: "imovel"; nome: string; bairro?: string }
  | { tipo: "catalogo"; filtroDescrito?: string };

function montarMensagem(origem: OrigemContato): string {
  switch (origem.tipo) {
    case "imovel": {
      const onde = origem.bairro ? ` (${origem.bairro})` : "";
      return `Olá, Cláudio! Vi o ${origem.nome}${onde} no site e queria saber mais sobre condições e disponibilidade.`;
    }
    case "catalogo": {
      const filtro = origem.filtroDescrito
        ? ` Estou procurando ${origem.filtroDescrito}.`
        : "";
      return `Olá, Cláudio! Vim pelo site e gostaria de ajuda para escolher um imóvel.${filtro}`;
    }
    case "geral":
    default:
      return "Olá, Cláudio! Vim pelo site e gostaria de mais informações sobre os imóveis.";
  }
}

/** URL pronta para `href`. Usa api.whatsapp.com, que abre app no mobile e web no desktop. */
export function linkWhatsApp(origem: OrigemContato = { tipo: "geral" }): string {
  const params = new URLSearchParams({
    phone: site.whatsapp,
    text: montarMensagem(origem),
  });
  return `https://api.whatsapp.com/send?${params.toString()}`;
}
