"use client";

import BotaoComun from "@/app/components/botoes/botaoComun";
import PopUpConfirmation from "@/app/components/popupConfirmation";
import PrefeituraTitle from "@/app/components/prefeituraTitle";
import Title from "@/app/components/title";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, Suspense } from "react";




export default function CriarPlano() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CriarPlanoContent />
    </Suspense>
  );
}

function CriarPlanoContent() {
  const searchParams = useSearchParams();
  const prefeituraId = Number(searchParams.get("prefeituraId"));
  const router = useRouter();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    prefeituraId: prefeituraId,
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setShowConfirmation(false);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token não encontrado");
      return;
    }

    try {
      // Enviar alteração para o back-end (editar proposta)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/planos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      console.log("formData: ", formData);

      if (response.ok) {
        alert("Plano criado com sucesso!");
      } else {
        const error = await response.text();
        alert("Erro ao criar plano: " + error);
      }
    } catch (error) {
      console.error("Erro ao criar plano:", error);
      alert("Ocorreu um erro ao criar o plano.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <PrefeituraTitle />
      <Title titulo={"Criar Plano"} />
      <form
        ref={formRef}
        className="flex flex-col w-6/12 h-auto bg-white shadow-sm p-10 rounded-2xl mb-5"
        onSubmit={handleSubmit}
      >
        <label className="font-bold text-lg pl-4">Plano</label>
        <input
          type="text"
          name="titulo"
          className="w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder={"Título do novo plano"}
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
        />
       
        {showConfirmation && (
          <div>
            
            <PopUpConfirmation
              message={`Você tem certeza que deseja criar este plano?`}
              onConfirm={async () => await handleSubmit()}
              onCancel={() => setShowConfirmation(false)}
            />
          </div>
        )}
        <div className="flex justify-between mt-6 gap-4">
          <div onClick={() => setShowConfirmation(true)}>
            <BotaoComun titulo="Criar plano" />
          </div>
          {/* retornar uma página anterior */}
          <div onClick={() => router.push(`/dashboard?prefeituraId=${prefeituraId}`)}>
            <BotaoComun  titulo="Cancelar" />
          </div>
          {/* Se proposta desativada, botao ativar proposta, se ativa, botao desativar proposta, status desativada em vermelho, ativa em verde */}
          
        </div>
      </form>
      
    </div>
  );
}
