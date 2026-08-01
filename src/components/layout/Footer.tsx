import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { linkWhatsApp } from "@/lib/whatsapp";
import { construtoras, site } from "@/lib/site";

/**
 * O lucide-react v1 removeu os icones de marca (Instagram, Facebook...) por
 * questao de licenca, entao o glifo vai inline. Mesmo caso do WhatsAppFAB.
 */
function IconeInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0m0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881" />
    </svg>
  );
}

/**
 * Rodape. O CRECI e OBRIGATORIO em todas as paginas — exigencia do conselho.
 * Nao remover, nao esconder atras de accordion. Ver CLAUDE.md secao 5.7.
 *
 * `use cache` por causa do ano no copyright: sob Cache Components, `new Date()`
 * num Server Component e considerado nao-deterministico e quebra o prerender.
 * Cachear e o caminho que a doc indica — todo mundo ve o mesmo ano, que muda
 * na proxima revalidacao. A alternativa (`connection()`) tornaria o rodape
 * dinamico em TODAS as paginas, o que seria absurdo por causa de um numero.
 */
export async function Footer() {
  "use cache";
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-brand-900 text-sand-200 mt-24">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-xl font-semibold text-white">
              Cláudio Corretor
            </p>
            <p className="text-sand-300 mt-3 max-w-sm text-sm leading-relaxed">
              {site.bio}
            </p>
          </div>

          <div>
            <p className="font-sans text-sm font-semibold text-white">Contato</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={linkWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-whatsapp text-sand-300 inline-flex items-center gap-2 transition-colors"
                >
                  <MessageCircle className="size-4 shrink-0" aria-hidden />
                  {site.whatsappExibicao}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sand-300 inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <IconeInstagram className="size-4 shrink-0" />
                  {site.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sand-300 inline-flex items-center gap-2 break-all transition-colors hover:text-white"
                >
                  <Mail className="size-4 shrink-0" aria-hidden />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-sans text-sm font-semibold text-white">Construtoras</p>
            <ul className="text-sand-300 mt-3 space-y-1.5 text-sm">
              {construtoras.map((c) => (
                <li key={c.slug}>{c.nome}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {/* CRECI: obrigatorio, sempre visivel. */}
          <p className="text-sand-200 font-sans text-sm font-medium">{site.creci}</p>
          <div className="text-sand-400 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs">
            <Link href="/privacidade" className="transition-colors hover:text-white">
              Política de privacidade
            </Link>
            <span>© {ano} Cláudio Corretor</span>
          </div>
        </div>

        <p className="text-sand-500 mt-6 font-sans text-xs leading-relaxed">
          Imagens meramente ilustrativas. Os empreendimentos apresentados são de
          responsabilidade das respectivas construtoras e estão sujeitos a alteração e à
          disponibilidade de unidades.
        </p>
      </div>
    </footer>
  );
}
