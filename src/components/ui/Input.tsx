"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Campo de formulario. Usado no LeadForm da Fase 6, que e o funil inteiro do
 * trafego pago — por isso label sempre visivel (placeholder sozinho e um classico
 * de queda de conversao) e erro amarrado por aria-describedby.
 *
 * Client component: depende de useId para ligar label/input/erro.
 */

/** Input "cru", quando o campo ja tem label proprio em outro lugar. */
export function Input({
  className,
  invalido,
  ...props
}: React.ComponentProps<"input"> & { invalido?: boolean }) {
  return (
    <input
      aria-invalid={invalido || undefined}
      className={cn(
        // h-12: campo confortavel no mobile, que e de onde vem o trafego do Meta.
        "text-sand-900 h-12 w-full rounded-xl bg-white px-4 font-sans text-base",
        "ring-sand-300 ring-1 transition-shadow ring-inset",
        "placeholder:text-sand-400",
        "focus:ring-brand-500 focus:ring-2 focus:outline-none",
        invalido && "ring-accent-500 focus:ring-accent-600",
        className,
      )}
      {...props}
    />
  );
}

type InputFieldProps = React.ComponentProps<"input"> & {
  label: string;
  erro?: string;
  dica?: string;
};

/** Label + input + mensagem de erro/dica, tudo ligado por id. Use este por padrao. */
export function InputField({
  label,
  erro,
  dica,
  required,
  className,
  ...props
}: InputFieldProps) {
  const id = useId();
  const descricaoId = erro || dica ? `${id}-desc` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sand-800 font-sans text-sm font-medium">
        {label}
        {required && (
          <span className="text-accent-600 ml-0.5" aria-hidden>
            *
          </span>
        )}
      </label>

      <Input
        id={id}
        required={required}
        invalido={Boolean(erro)}
        aria-describedby={descricaoId}
        className={className}
        {...props}
      />

      {(erro || dica) && (
        <p
          id={descricaoId}
          // aria-live: o erro vindo da Server Action e anunciado sem precisar refocar.
          aria-live={erro ? "polite" : undefined}
          className={cn("font-sans text-sm", erro ? "text-accent-700" : "text-sand-500")}
        >
          {erro ?? dica}
        </p>
      )}
    </div>
  );
}
