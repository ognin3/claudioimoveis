import { cn } from "@/lib/utils";

/**
 * Botao do projeto. Existe tambem `buttonClasses()` porque metade dos CTAs sao
 * links (`<a href="wa.me/...">`, `<Link href="/imoveis">`) — assim nao precisamos
 * de Slot/asChild so para pintar uma ancora.
 *
 * Alturas: `md` tem 44px, o minimo de alvo de toque exigido na meta de
 * acessibilidade 100 do Lighthouse. Nao criar tamanho menor para acao primaria.
 */

export type ButtonVariant = "primary" | "accent" | "whatsapp" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[length:var(--radius-pill)] " +
  "font-sans font-semibold whitespace-nowrap motion-button " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<ButtonVariant, string> = {
  // Ouro com texto ESCURO. Texto branco sobre dourado nao passa em contraste AA
  // e ainda por cima "suja" o dourado; o preto quente e o que da o ar caro.
  primary: "bg-ouro-400 text-noite-950 hover:bg-ouro-300 focus-visible:outline-ouro-400",
  // Secundario: contorno dourado sobre transparente, para dois CTAs lado a lado
  // nao brigarem entre si.
  accent:
    "border border-ouro-500/60 bg-ouro-950/40 text-ouro-200 hover:border-ouro-400 hover:bg-ouro-900/50 focus-visible:outline-ouro-400",
  whatsapp:
    "bg-whatsapp text-noite-950 hover:bg-whatsapp-dark hover:text-white focus-visible:outline-whatsapp",
  outline:
    "border border-noite-700 bg-transparent text-noite-200 hover:border-noite-600 hover:bg-noite-800 focus-visible:outline-ouro-400",
  ghost:
    "bg-transparent text-noite-300 hover:bg-noite-800 focus-visible:outline-ouro-400",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.9375rem]",
  lg: "h-13 px-8 text-base",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}
