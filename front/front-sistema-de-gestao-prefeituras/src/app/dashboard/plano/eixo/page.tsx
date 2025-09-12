"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePropostas, usePrefeituras } from "@/app/hooks/usePropostas";
import PrefeituraTitle from "@/app/components/prefeituraTitle";
import BotaoIncluir from "@/app/components/botoes/botaoIncluir";
import Title from "@/app/components/title";
import Info from "@/app/components/info";
import { Proposta, Prefeitura } from "@/app/types/proposta";




interface CategoriaData {
  nome: string;
  totalPropostas: number;
  cumpridas: number;
  emAndamento: number;
  vencidas: number;
}

export default function Categorias(){
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CategoriasContent />
    </Suspense>
  )
}

function CategoriasContent() {
  const searchParams = useSearchParams();
  
  const prefeituraId = Number(searchParams.get("prefeituraId"));
  const planoName = searchParams.get("planoName");
  const eixoName = searchParams.get("eixoName");
  
  const { prefeituras } = usePrefeituras();
  const prefeitura = prefeituras?.find((p: Prefeitura) => p.id === prefeituraId);
  
  const router = useRouter();
  const handlePropostasClick = (categoria: CategoriaData) => {
        router.push(`/dashboard/plano/eixo/categoria?prefeituraId=${prefeitura.id}&prefeituraName=${encodeURIComponent(prefeitura.name)}&planoName=${planoName}&eixoName=${eixoName}&categoriaName=${categoria.nome}`);
    };

  const { propostas, isLoading, isError } = usePropostas(prefeituraId);

  // Processar dados das propostas para agrupar por categoria
  const categoriasData = useMemo(() => {
    if (!propostas) return [];

    const categoriasMap = new Map<string, CategoriaData>();

    propostas.filter((proposta: Proposta) => proposta.ativa).forEach((proposta: Proposta) => {
      if (proposta.plano.titulo == planoName && proposta.eixo.titulo == eixoName) {

        const nome = proposta.categoria.titulo || "categoria não definido";
        if (!categoriasMap.has(nome)) {
          categoriasMap.set(nome, {
            nome,
            totalPropostas: 0,
            cumpridas: 0,
            emAndamento: 0,
            vencidas: 0,
          });
        }

        const categoria = categoriasMap.get(nome)!;
        categoria.totalPropostas++;

        switch (proposta.status?.toLowerCase()) {
          case "concluída":
            categoria.cumpridas++;
            break;
          case "em andamento":
          if (proposta.meta > new Date().getFullYear().toString()) {
            categoria.emAndamento++;
          }
          if (proposta.meta < new Date().getFullYear().toString()) {
            categoria.vencidas++;
          }
          break;   
          default:
            categoria.emAndamento++; // Status não reconhecido vai para em andamento
        }
      }
    });

    return Array.from(categoriasMap.values());
  }, [propostas, planoName, eixoName]);



  // if (!prefeituraId) return <p>ID da prefeitura não fornecido.</p>;
  if (isLoading) return <p>Carregando propostas...</p>;
  if (isError) return <p>Erro ao carregar propostas.</p>;

  return (
    <div className="w-full place-items-center">
      <PrefeituraTitle />   
      <Title titulo={"Categorias"}/>
      <BotaoIncluir 
        titulo="categoria"
        onClick={() => router.push(`/dashboard/plano/eixo/categoria/criar-categoria?prefeituraId=${prefeituraId}`)}
      />
      <Info
        statusData={categoriasData}
        onClick={handlePropostasClick}
      />
    </div>
  );
}
