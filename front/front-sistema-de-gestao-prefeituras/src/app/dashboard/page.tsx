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
  const handlePlanoClick = (plano: PlanoData) => {    
    router.push(`/dashboard/plano?prefeituraId=${prefeituraId}&planoName=${plano.nome}`);
  };
  const handleNewPlanoClick = () => {
    router.push(`/dashboard/plano/criar-plano?prefeituraId=${prefeituraId}`);
  }
  const searchParams = useSearchParams();
  const prefeituraId = Number(searchParams.get("prefeituraId"));

  const { propostas, isLoading, isError } = usePropostas(prefeituraId);
  // console.log("propostas: ", propostas);



  // Processar dados das propostas para agrupar por plano
  const planosData = useMemo(() => {
    if (!propostas) return [];

    const planosMap = new Map<string, PlanoData>();
    propostas.filter((proposta: Proposta) => proposta.ativa).forEach((proposta: Proposta) => {
      console.log(proposta.meta < new Date().getFullYear().toString())
      const planoNome = proposta.plano.titulo || "Plano não definido";
      if (!planosMap.has(planoNome)) {
        planosMap.set(planoNome, {
          nome: planoNome,
          totalPropostas: 0,
          cumpridas: 0,
          emAndamento: 0,
          vencidas: 0,
        });
      }

      const plano = planosMap.get(planoNome)!;
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
    console.log("PlanosMap",planosMap)
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
