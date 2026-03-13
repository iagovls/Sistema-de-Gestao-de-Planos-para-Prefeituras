"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePropostas } from "../hooks/usePropostas";
import PrefeituraTitle from "../components/prefeituraTitle";
import BotaoIncluir from "../components/botoes/botaoIncluir";
import Title from "../components/title";
import Info from "../components/info";
import { Proposta } from "../types/proposta";

interface PlanoData {
  id: number;
  nome: string;
  totalPropostas: number;
  cumpridas: number;
  emAndamento: number;
  vencidas: number;
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DashboardContent />
    </Suspense>
  )}

function DashboardContent() {
  const router = useRouter();
  const handleNewPlanoClick = () => {
    router.push(`/dashboard/plano/criar-plano?prefeituraId=${prefeituraId}`);
  }
  const searchParams = useSearchParams();
  const prefeituraId = Number(searchParams.get("prefeituraId"));

  const { propostas, isLoading, isError } = usePropostas(prefeituraId);
  const handlePlanoClick = (plano: PlanoData) => {
    const planoId = propostas?.find
    (
      (proposta: Proposta) => proposta.plano.id === plano.id
    )
    ?.plano.id;
    router.push(`/dashboard/plano?prefeituraId=${prefeituraId}&planoName=${plano.nome}&planoId=${planoId}`);
  };



  // Processar dados das propostas para agrupar por plano
  const planosData = useMemo(() => {
    if (!propostas) return [];

    const planosMap = new Map<number, PlanoData>();
    propostas.filter((proposta: Proposta) => proposta.ativa).forEach((proposta: Proposta) => {
      const planoId = proposta.plano.id || 0;
      if (!planosMap.has(planoId)) {
        planosMap.set(planoId, {
          id: proposta.plano.id,
          nome: proposta.plano.titulo || "Plano não definido",
          totalPropostas: 0,
          cumpridas: 0,
          emAndamento: 0,
          vencidas: 0,
        });
      }

      const plano = planosMap.get(planoId)!;
      plano.totalPropostas++;

      switch (proposta.status?.toLowerCase()) {
        case "concluída":
          plano.cumpridas++;
          break;
        case "em andamento":
          if (proposta.meta > new Date().getFullYear().toString()) {
            plano.emAndamento++;
          }
          if (proposta.meta < new Date().getFullYear().toString()) {
            plano.vencidas++;
          }
          break;        
        default:
          plano.emAndamento++; // Status não reconhecido vai para em andamento
      }
    });
    console.log(planosMap)
    return Array.from(planosMap.values());
  }, [propostas]);



  if (!prefeituraId) return <p>ID da prefeitura não fornecido.</p>;
  if (isLoading) return <p>Carregando propostas...</p>;
  if (isError) return <p>Erro ao carregar propostas.</p>;

  return (
    <div className="w-full place-items-center">
      <PrefeituraTitle/>


      <Title titulo={"Planos"}/>
      <BotaoIncluir onClick={handleNewPlanoClick} titulo="plano"/>

      <Info statusData={planosData} onClick={handlePlanoClick} />
    </div>
  );
}
