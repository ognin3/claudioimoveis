"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CHAVE_MARKETING, CHAVE_ATRIBUICAO, EVENTO_MARKETING, escolherMarketing, marketingAutorizado } from "@/lib/meta/consent";
import { limparAtribuicao, paginaSeguraParaPixel, referenciaSeguraParaPixel } from "@/lib/meta/attribution";
import { buttonClasses } from "@/components/ui/Button";
import "@/lib/meta/pixel";

export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pathname = usePathname();
  const [escolha, setEscolha] = useState<string | null>(null);
  const ultimaPaginaRastreada = useRef<string | null>(null);

  useEffect(() => {
    const atualizar = () => {
      try { setEscolha(localStorage.getItem(CHAVE_MARKETING) ?? "unknown"); }
      catch { setEscolha("denied"); }
    };
    atualizar();
    window.addEventListener(EVENTO_MARKETING, atualizar);
    window.addEventListener("storage", atualizar);
    return () => {
      window.removeEventListener(EVENTO_MARKETING, atualizar);
      window.removeEventListener("storage", atualizar);
    };
  }, []);

  useEffect(() => {
    if (escolha === null) return;
    if (!marketingAutorizado()) {
      window.fbq?.("consent", "revoke");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"].some((chave) => params.has(chave))) {
      const atribuicao = limparAtribuicao({
        utmSource: params.get("utm_source"), utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"), utmContent: params.get("utm_content"), fbclid: params.get("fbclid"),
      });
      try { sessionStorage.setItem(CHAVE_ATRIBUICAO, JSON.stringify(atribuicao)); }
      catch { /* Sem armazenamento, não persistir atribuição. */ }
    }
    // Pixel pode ler a URL inteira: permitir somente rotas e parâmetros aprovados.
    // Referrer também precisa ser seguro antes de carregar o SDK.
    if (!pixelId || !/^\d+$/.test(pixelId) || !referenciaSeguraParaPixel(document.referrer, location.origin) || !paginaSeguraParaPixel(location.href, location.origin)) {
      window.fbq?.("consent", "revoke");
      return;
    }
    if (!window.fbq) {
      const fila: unknown[][] = [];
      const fbq = Object.assign((...args: unknown[]) => {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fila.push(args);
      }, { queue: fila, loaded: true, version: "2.0", callMethod: undefined as ((...args: unknown[]) => void) | undefined });
      window.fbq = fbq;
      window._fbq = fbq;
      fbq("consent", "grant");
      fbq("set", "autoConfig", false, pixelId);
      fbq("init", pixelId);
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
    } else window.fbq("consent", "grant");
    if (ultimaPaginaRastreada.current !== location.href) {
      window.fbq("track", "PageView");
      ultimaPaginaRastreada.current = location.href;
    }
  }, [pathname, escolha, pixelId]);

  return (
    <aside aria-label="Preferências de privacidade" className="border-noite-800 bg-noite-900 border-t px-4 py-4 text-sm text-noite-300">
      <p>{escolha === null || escolha === "unknown" ? "Marketing opcional: autoriza a Meta a medir anúncios com cookies e dados de contato? Você pode solicitar contato sem autorizar." : `Marketing ${escolha === "granted" ? "autorizado" : "recusado"}. Altere sua escolha a qualquer momento.`} <a href="/privacidade" className="text-ouro-400 underline">Privacidade</a></p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" className={buttonClasses("primary", "md")} onClick={() => escolherMarketing(true)}>Autorizar marketing</button>
        <button type="button" className={buttonClasses("outline", "md")} onClick={() => escolherMarketing(false)}>Recusar marketing</button>
      </div>
    </aside>
  );
}
