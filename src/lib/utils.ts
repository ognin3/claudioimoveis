import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Junta classes condicionais e resolve conflitos do Tailwind
 * (a ultima vence: `cn("p-2", "p-4")` => "p-4").
 * Usar em todo componente que aceita `className` de fora.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "1, 2 e 3 quartos" — usado em card, filtro e mensagem de WhatsApp. */
export function listarEmPortugues(itens: readonly string[]): string {
  if (itens.length === 0) return "";
  if (itens.length === 1) return itens[0];
  return `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

/** `[0, 2, 3]` => "Studio, 2 e 3 quartos". Studio e representado por 0. */
export function descreverQuartos(quartos: readonly number[]): string {
  if (quartos.length === 0) return "";
  const rotulos = [...quartos]
    .sort((a, b) => a - b)
    .map((q) => (q === 0 ? "Studio" : String(q)));
  const temApenasStudio = rotulos.length === 1 && rotulos[0] === "Studio";
  return temApenasStudio ? "Studio" : `${listarEmPortugues(rotulos)} quartos`;
}
