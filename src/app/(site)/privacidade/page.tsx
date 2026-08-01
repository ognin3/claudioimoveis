import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  robots: { index: false, follow: true },
};

/**
 * Exigencia da LGPD: o formulario de lead coleta dado pessoal e precisa apontar
 * para esta pagina. Revisar com o cliente antes do lancamento — o texto abaixo
 * descreve o que o site realmente faz, mas nao substitui revisao juridica.
 */
export default function PaginaPrivacidade() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-brand-900 text-[length:var(--text-h1)] font-semibold">
        Política de privacidade
      </h1>

      <div className="text-sand-700 mt-8 space-y-6 leading-relaxed">
        <section>
          <h2 className="text-brand-900 text-lg font-semibold">Quais dados coletamos</h2>
          <p className="mt-2">
            Quando você preenche um formulário neste site, guardamos o nome, o telefone de
            WhatsApp e, se você informar, o e-mail. Registramos também de qual anúncio ou
            página você veio, para entender o que funciona na divulgação.
          </p>
        </section>

        <section>
          <h2 className="text-brand-900 text-lg font-semibold">Para que usamos</h2>
          <p className="mt-2">
            Exclusivamente para entrar em contato sobre os imóveis do seu interesse. Não
            vendemos, alugamos nem cedemos seus dados para terceiros.
          </p>
        </section>

        <section>
          <h2 className="text-brand-900 text-lg font-semibold">Compartilhamento</h2>
          <p className="mt-2">
            Para medir o resultado dos anúncios, enviamos à Meta (Facebook e Instagram)
            uma versão <strong>criptografada e irreversível</strong> do seu contato. Isso
            permite saber que uma conversão aconteceu sem revelar quem você é. Quando você
            avança em uma negociação, seus dados são compartilhados com a construtora
            responsável pelo empreendimento.
          </p>
        </section>

        <section>
          <h2 className="text-brand-900 text-lg font-semibold">Seus direitos</h2>
          <p className="mt-2">
            Você pode pedir a qualquer momento para ver, corrigir ou apagar seus dados.
            Basta escrever para{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-brand-600 underline underline-offset-2"
            >
              {site.email}
            </a>
            .
          </p>
        </section>

        <p className="text-sand-500 border-sand-200 border-t pt-6 text-sm">
          {site.nome} — {site.creci}
        </p>
      </div>
    </div>
  );
}
