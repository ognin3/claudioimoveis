/**
 * Configuracao compartilhada entre o Studio e o app.
 * Valores vem de .env.local — ver .env.example.
 */

function obrigatorio<T>(valor: T | undefined, nome: string): T {
  if (valor === undefined || valor === "") {
    throw new Error(
      `Variavel de ambiente ausente: ${nome}. Copie .env.example para .env.local e preencha.`,
    );
  }
  return valor;
}

export const projectId = obrigatorio(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = obrigatorio(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);

/**
 * Data fixa: a API do Sanity versiona por data. Mudar so conscientemente,
 * depois de ler o changelog — subir a versao pode alterar o retorno de GROQ.
 */
export const apiVersion = "2026-07-01";
