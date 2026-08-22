"use client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function dispararLeadMeta(eventId: string, imovel?: string) {
  window.fbq?.(
    "track",
    "Lead",
    { content_category: "Real Estate", ...(imovel ? { content_name: imovel } : {}) },
    { eventID: eventId },
  );
}
