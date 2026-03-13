"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePropostas, usePrefeituras } from "@/app/hooks/usePropostas";

import PrefeituraTitle from "@/app/components/prefeituraTitle";
import BotaoIncluir from "@/app/components/botoes/botaoIncluir";
import BotaoComun from "@/app/components/botoes/botaoComun";
import Title from "@/app/components/title";
import Info from "@/app/components/info";
import { Proposta, Prefeitura } from "@/app/types/proposta";

interface EixoData {
  id: number;
  nome: string;
  totalPropostas: number;
  cumpridas: number;
  emAndamento: number;
  vencidas: number;
}

interface PlanoResumo {
  id: number;
  prefeituraId: number;
}

export default function Eixos() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <EixosContent />
    </Suspense>
  )
}   

function EixosContent() {
  const searchParams = useSearchParams();

  const prefeituraId = Number(searchParams.get("prefeituraId"));
  const planoName = searchParams.get("planoName");
  const planoId = Number(searchParams.get("planoId"));
  const [baixandoRelatorio, setBaixandoRelatorio] = useState(false);

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
  const handleDownloadRelatorio = async () => {
    if (!planoId || Number.isNaN(planoId)) return;
    setBaixandoRelatorio(true);
    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const planosResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/planos`,
        { headers }
      );
      if (!planosResponse.ok) {
        throw new Error("Falha ao validar plano");
      }
      const planos = (await planosResponse.json()) as PlanoResumo[];
      const planoSelecionado = planos.find((p) => p.id === planoId);
      if (!planoSelecionado) {
        throw new Error("Plano não encontrado");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/planos/${planoId}/relatorio.pdf?prefeituraId=${planoSelecionado.prefeituraId}`,
        { headers }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Falha ao baixar relatório");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `plano-${planoId}-relatorio.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "Falha ao baixar relatório";
      alert(mensagem);
    } finally {
      setBaixandoRelatorio(false);
    }
  };

  const { propostas, isLoading, isError } = usePropostas(prefeituraId);

  // Processar dados das propostas para agrupar por eixo
  const eixosData = useMemo(() => {
    if (!propostas) return [];

    const eixosMap = new Map<string, EixoData>();

    propostas
      .filter((proposta: Proposta) => proposta.ativa)
      .forEach((proposta: Proposta) => {
        if (proposta.plano.id === planoId) {
          const eixoNome = proposta.eixo.titulo || "Eixo não definido";
          if (!eixosMap.has(eixoNome)) {
            eixosMap.set(eixoNome, {
              id: proposta.eixo.id || 0,
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
  }, [propostas, planoId]);

  if (!prefeituraId) return <p>ID da prefeitura não fornecido.</p>;
  if (isLoading) return <p>Carregando propostas...</p>;
  if (isError) return <p>Erro ao carregar propostas.</p>;

  return (
    <div className="w-full flex flex-col place-items-center">
      <PrefeituraTitle />

      <BotaoComun
        onClick={handleDownloadRelatorio}
        titulo={baixandoRelatorio ? "baixando relatório..." : "Baixar relatório"}
      />
      <Title titulo={"Eixos"} />
      <BotaoIncluir onClick={handleNewEixoClick} titulo="eixo" />

      <Info statusData={eixosData} onClick={handleEixoClick} />
    </div>
  );
}
