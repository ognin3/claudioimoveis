"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { LeadForm } from "@/components/conversao/LeadForm";
import { buttonClasses } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type ImovelLead = {
  id: string;
  nome: string;
  bairro: string;
};

export function LeadCaptureButton({
  imovel,
  rotulo = "Receber condições",
  className,
}: {
  imovel: ImovelLead;
  rotulo?: string;
  className?: string;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className={buttonClasses("primary", "md", className)}
      >
        {rotulo}
        <ArrowRight className="size-4" aria-hidden />
      </button>

      <Modal
        open={aberto}
        onOpenChange={setAberto}
        titulo={`Condições do ${imovel.nome}`}
        tituloOculto
        descricao="Informe seus dados para o Cláudio verificar disponibilidade, entrada e financiamento."
        className="max-w-xl"
      >
        <div className="p-3 sm:p-5">
          <LeadForm compacto imovel={imovel} className="border-noite-700" />
        </div>
      </Modal>
    </>
  );
}
