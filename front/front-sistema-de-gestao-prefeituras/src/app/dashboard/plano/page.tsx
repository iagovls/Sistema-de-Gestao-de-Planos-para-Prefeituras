"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePropostas, usePrefeituras } from "@/app/hooks/usePropostas";

import PrefeituraTitle from "@/app/components/prefeituraTitle";
import BotaoIncluir from "@/app/components/botoes/botaoIncluir";
import Title from "@/app/components/title";
import Info from "@/app/components/info";
import { Proposta, Prefeitura } from "@/app/types/proposta";

interface EixoData {
  nome: string;
  totalPropostas: number;
  cumpridas: number;
  emAndamento: number;
  vencidas: number;
}

export default function Eixos() {
  const searchParams = useSearchParams();

  const prefeituraId = Number(searchParams.get("prefeituraId"));
  const planoName = searchParams.get("planoName");

  const { prefeituras } = usePrefeituras();
  const prefeitura = prefeituras?.find(
    (p: Prefeitura) => p.id === prefeituraId
  );

  const router = useRouter();
  const handleEixoClick = (eixo: EixoData) => {
    router.push(
      `/dashboard/plano/eixo?prefeituraId=${
        prefeitura.id
      }&prefeituraName=${encodeURIComponent(
        prefeitura.name
      )}&planoName=${planoName}&eixoName=${eixo.nome}`
    );
  };
  const handleNewEixoClick = () => {
    router.push(
      `/dashboard/plano/eixo/criar-eixo?prefeituraId=${prefeituraId}`
    );
  };

  const { propostas, isLoading, isError } = usePropostas(prefeituraId);

  // Processar dados das propostas para agrupar por eixo
  const eixosData = useMemo(() => {
    if (!propostas) return [];

    const eixosMap = new Map<string, EixoData>();

    propostas
      .filter((proposta: Proposta) => proposta.ativa)
      .forEach((proposta: Proposta) => {
        if (proposta.plano.titulo == planoName) {
          const eixoNome = proposta.eixo.titulo || "Eixo não definido";
          if (!eixosMap.has(eixoNome)) {
            eixosMap.set(eixoNome, {
              nome: eixoNome,
              totalPropostas: 0,
              cumpridas: 0,
              emAndamento: 0,
              vencidas: 0,
            });
          }

          const eixo = eixosMap.get(eixoNome)!;
          eixo.totalPropostas++;

          switch (proposta.status?.toLowerCase()) {
            case "concluída":
              eixo.cumpridas++;
              break;
            case "em andamento":
              if (proposta.meta > new Date().getFullYear().toString()) {
                eixo.emAndamento++;
              }
              if (proposta.meta < new Date().getFullYear().toString()) {
                eixo.vencidas++;
              }
              break;
            default:
              eixo.emAndamento++; // Status não reconhecido vai para em andamento
          }
        }
      });

    return Array.from(eixosMap.values());
  }, [propostas, planoName]);

  if (!prefeituraId) return <p>ID da prefeitura não fornecido.</p>;
  if (isLoading) return <p>Carregando propostas...</p>;
  if (isError) return <p>Erro ao carregar propostas.</p>;

  return (
    <div className="w-full flex flex-col place-items-center">
      <PrefeituraTitle />

      <Title titulo={"Eixos"} />
      <BotaoIncluir onClick={handleNewEixoClick} titulo="eixo" />

      <Info statusData={eixosData} onClick={handleEixoClick} />
    </div>
  );
}
