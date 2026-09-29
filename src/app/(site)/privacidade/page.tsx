import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  robots: { index: false, follow: true },
  description: "Como tratamos dados de contato, preferências de marketing e seus direitos de privacidade.",
  alternates: { canonical: "/privacidade" },
  openGraph: {
    title: "Política de privacidade",
    description: "Como tratamos dados de contato, preferências de marketing e seus direitos de privacidade.",
    url: "/privacidade",
    locale: "pt_BR",
    siteName: site.nome,
    type: "website",
    images: [{ url: "/opengraph-image" }],
  },
};

export default function PaginaPrivacidade() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-noite-50 text-[length:var(--text-h1)] font-semibold">Política de privacidade</h1>
      <div className="text-noite-300 mt-8 space-y-6 leading-relaxed">
        <section>
          <h2 className="text-noite-50 text-lg font-semibold">Contato solicitado por você</h2>
          <p className="mt-2">O formulário coleta nome, WhatsApp e e-mail opcional para o corretor responder sobre imóveis e financiamento. A autorização de contato é obrigatória para enviar o formulário; a autorização de marketing é separada e opcional. Recusar marketing não impede a solicitação de contato.</p>
          <p className="mt-2">O cadastro guarda a página pública de origem, sem query ou fragmento, a data da autorização de contato, um identificador do cadastro e a escolha de marketing declarada neste envio, com versão do termo e data. Com marketing autorizado, também pode guardar a origem do anúncio: plataforma, meio, IDs de campanha/anúncio previamente aprovados e identificador de clique. Termos de busca, textos livres de campanha e IDs não aprovados são descartados.</p>
        </section>
        <section>
          <h2 className="text-noite-50 text-lg font-semibold">Armazenamento e operadores</h2>
          <p className="mt-2">Os cadastros são gravados como documentos privados de rascunho no Sanity, acessíveis com autenticação. Se a integração de e-mail estiver configurada, o Resend processa nome, contato, imóvel e página de origem para notificar o corretor. Ao continuar no WhatsApp, você passa a usar esse serviço e suas regras de privacidade. O site não comprova entrega ou leitura da mensagem no WhatsApp.</p>
          <p className="mt-2">Para proteger o formulário contra abuso, há limites de envio com um identificador derivado do IP por HMAC e registros com expiração. Essa proteção é independente da escolha de marketing. A infraestrutura de hospedagem também processa informações técnicas das requisições.</p>
        </section>
        <section>
          <h2 className="text-noite-50 text-lg font-semibold">Marketing opcional e Meta</h2>
          <p className="mt-2">Somente com autorização de marketing e integrações configuradas, usamos Pixel e API de Conversões da Meta para medir anúncios. O Pixel pode usar cookies como _fbp e _fbc e transmitir informações de navegação. Permitimos apenas rotas públicas conhecidas e parâmetros de campanha aprovados em formato limitado. Query desconhecida, fragmento ou referência de navegação insegura impedem o carregamento e os eventos Pixel deste site, para evitar envio de dados pessoais em URLs. Referências externas só são permitidas na raiz, sem query, de domínios de anúncios aprovados.</p>
          <p className="mt-2">Após o cadastro autorizado, a API pode enviar à Meta telefone e e-mail transformados por SHA-256, além de IP, identificação do navegador, cookies de publicidade, página limpa e identificador do evento. Hash não é anonimização: a Meta pode associar esses identificadores às suas contas. IP, navegador e cookies não são enviados como hashes. Não vendemos seus dados.</p>
          <p className="mt-2">A escolha é salva neste navegador. Você pode recusá-la ou alterá-la nas preferências de privacidade exibidas no site ou na opção do formulário. Recusar interrompe novos eventos de marketing e remove a atribuição local e os cookies Meta acessíveis neste domínio. Isso não apaga informações já transmitidas nem muda a escolha em outro navegador. Se o armazenamento local não funcionar, marketing fica desautorizado.</p>
        </section>
        <section>
          <h2 className="text-noite-50 text-lg font-semibold">Seus direitos e retenção</h2>
          <p className="mt-2">Para solicitar acesso, correção, exclusão, revogar o contato ou esclarecer compartilhamentos necessários a uma negociação, escreva para <a href={`mailto:${site.email}`} className="text-ouro-400 underline underline-offset-2">{site.email}</a>. Não há exclusão automática de cadastros por prazo implementada neste formulário; pedidos precisam ser tratados pelo responsável. Os prazos de retenção, as bases legais e os procedimentos de atendimento devem ser confirmados com o responsável antes da operação de campanhas.</p>
        </section>
        <p className="text-noite-400 border-noite-800 border-t pt-6 text-sm">{site.nome} — {site.creci}</p>
      </div>
    </div>
  );
}
