"use client";

export const CHAVE_MARKETING = "claudio-marketing-v1";
export const EVENTO_MARKETING = "claudio-marketing-change";
const CHAVE_ATRIBUICAO = "claudio-attribution-v1";

export function marketingAutorizado() {
  try { return localStorage.getItem(CHAVE_MARKETING) === "granted"; }
  catch { return false; }
}

export function escolherMarketing(autoriza: boolean) {
  try { localStorage.setItem(CHAVE_MARKETING, autoriza ? "granted" : "denied"); }
  catch { autoriza = false; }
  if (!autoriza) {
    window.fbq?.("consent", "revoke");
    try {
      sessionStorage.removeItem(CHAVE_ATRIBUICAO);
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"].forEach((chave) => sessionStorage.removeItem(chave));
    } catch { /* Armazenamento indisponível: nenhuma atribuição será usada. */ }
    for (const nome of ["_fbp", "_fbc"]) {
      document.cookie = `${nome}=; Max-Age=0; Path=/; SameSite=Lax`;
      const partes = location.hostname.split(".");
      for (let i = 0; i < partes.length - 1; i++) {
        document.cookie = `${nome}=; Max-Age=0; Path=/; Domain=.${partes.slice(i).join(".")}; SameSite=Lax`;
      }
    }
  }
  window.dispatchEvent(new Event(EVENTO_MARKETING));
}

export { CHAVE_ATRIBUICAO };
