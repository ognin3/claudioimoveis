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
  "font-sans font-semibold whitespace-nowrap transition-colors duration-150 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-800 text-white hover:bg-brand-900 focus-visible:outline-brand-800",
  accent: "bg-accent-500 text-white hover:bg-accent-600 focus-visible:outline-accent-600",
  whatsapp:
    "bg-whatsapp text-white hover:bg-whatsapp-dark focus-visible:outline-whatsapp-dark",
  outline:
    "border border-sand-300 bg-transparent text-sand-800 hover:bg-sand-100 focus-visible:outline-brand-500",
  ghost: "bg-transparent text-sand-700 hover:bg-sand-100 focus-visible:outline-brand-500",
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
