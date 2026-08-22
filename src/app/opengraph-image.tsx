import { ImageResponse } from "next/og";

export const alt = "Cláudio Corretor — Apartamentos Minha Casa Minha Vida no Rio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 78% 20%, #4a3a0f 0%, #141311 38%, #0c0b0a 72%)",
        color: "#faf8f5",
        display: "flex",
        height: "100%",
        padding: "72px 84px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 880 }}>
        <div
          style={{
            color: "#dfb85c",
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          Minha Casa Minha Vida · Rio de Janeiro
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.02,
            marginTop: 28,
          }}
        >
          Cláudio Corretor
        </div>
        <div
          style={{
            color: "#d8d2c8",
            display: "flex",
            fontSize: 34,
            lineHeight: 1.3,
            marginTop: 24,
          }}
        >
          Apartamentos, lançamentos e atendimento direto para você sair do aluguel.
        </div>
        <div style={{ color: "#ecd08a", display: "flex", fontSize: 25, marginTop: 42 }}>
          CRECI 103666 · Grande Rio
        </div>
      </div>
    </div>,
    size,
  );
}
