"use client";

import { marketingAutorizado } from "./consent";
import { paginaSeguraParaPixel, referenciaSeguraParaPixel } from "./attribution";
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

export function dispararLeadMeta(eventId: string, imovel?: string) {
  if (!marketingAutorizado() || !referenciaSeguraParaPixel(document.referrer, location.origin) || !paginaSeguraParaPixel(location.href, location.origin)) return;
  window.fbq?.(
    "track",
    "Lead",
    { content_category: "Real Estate", ...(imovel ? { content_name: imovel } : {}) },
    { eventID: eventId },
  );
}
