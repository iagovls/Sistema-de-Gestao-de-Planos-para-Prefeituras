"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePropostas, usePrefeituras } from "@/app/hooks/usePropostas";
import PrefeituraTitle from "@/app/components/prefeituraTitle";
import Grafico from "@/app/components/grafico";
import BotaoIncluir from "@/app/components/botoes/botaoIncluir";

interface Proposta {
  id: number;
  titulo: string;
  status: string;
  plano: string;
  eixo: string;
  categoria: string;
  orgaoGestor: string;
}

interface CategoriaData {
  nome: string;
  totalPropostas: number;
  cumpridas: number;
  emAndamento: number;
  vencidas: number;
}

export default function Categorias() {
  const searchParams = useSearchParams();
  
  const prefeituraId = Number(searchParams.get("prefeituraId"));
  const planoName = searchParams.get("planoName");
  const eixoName = searchParams.get("eixoName");
  
  const { prefeituras } = usePrefeituras();
  const prefeitura = prefeituras?.find((p: any) => p.id === prefeituraId);
  
  const router = useRouter();
  const handlePropostasClick = (categoria: CategoriaData) => {
        router.push(`/dashboard/plano/eixo/categoria?prefeituraId=${prefeitura.id}&prefeituraName=${encodeURIComponent(prefeitura.name)}&planoName=${planoName}&eixoName=${eixoName}&categoriaName=${categoria.nome}`);
    };

  const { propostas, isLoading, isError } = usePropostas(prefeituraId);

  // Processar dados das propostas para agrupar por categoria
  const categoriasData = useMemo(() => {
    if (!propostas) return [];

    const categoriasMap = new Map<string, CategoriaData>();

    propostas.forEach((proposta: Proposta) => {
      if (proposta.plano == planoName && proposta.eixo == eixoName) {

        const nome = proposta.categoria || "categoria não definido";
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
          case "andamento":
            categoria.emAndamento++;
            break;
          case "vencida":
            categoria.vencidas++;
            break;
          default:
            categoria.emAndamento++; // Status não reconhecido vai para em andamento
        }
      }
    });

    return Array.from(categoriasMap.values());
  }, [propostas]);

  // Função para gerar dados do gráfico
  const getChartData = (categoria: CategoriaData) => {
    return [
      { name: "Cumpridas", value: categoria.cumpridas },
      { name: "Em Andamento", value: categoria.emAndamento },
      { name: "Vencidas", value: categoria.vencidas },
    ];
  };

  // if (!prefeituraId) return <p>ID da prefeitura não fornecido.</p>;
  if (isLoading) return <p>Carregando propostas...</p>;
  if (isError) return <p>Erro ao carregar propostas.</p>;

  return (
    <div className="w-full place-items-center">
      <PrefeituraTitle />   
      <BotaoIncluir titulo="categoria"/>
      <h1 className="font-bold text-3xl mt-5">Categorias</h1>
      {categoriasData.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-600">
            Nenhuma proposta encontrada para esta categoria.
          </p>
        </div>
      ) : (
        <main className="w-full max-w-6xl mx-auto flex flex-col items-center">
          {categoriasData.map((categoria, id) => {
            const chartData = getChartData(categoria);

            return (
              <div
                key={id}
                className="w-8/12 bg-white shadow-sm rounded-2xl p-6 mt-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handlePropostasClick(categoria)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePropostasClick(categoria);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Acessar dashboard do Plano ${""}`}
              >
                <h2 className="text-xl font-bold text-center mb-6">
                  {categoria.nome}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Grafico chartData={chartData}/>
                  {/* Estatísticas */}
                  <div className="space-y-4">
                    <h1 className="text-center font-bold ">Propostas</h1>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-100 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {categoria.cumpridas}
                        </div>
                        <div className="text-sm text-green-700">Cumpridas</div>
                      </div>
                      <div className="bg-orange-100 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {categoria.emAndamento}
                        </div>
                        <div className="text-sm text-orange-700">
                          Em Andamento
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-100 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {categoria.vencidas}
                        </div>
                        <div className="text-sm text-red-700">Vencidas</div>
                      </div>
                      <div className="bg-blue-100 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {categoria.totalPropostas}
                        </div>
                        <div className="text-sm text-blue-700">Total</div>
                      </div>
                    </div>
                  </div>

                  {/* Gráfico */}
                </div>
              </div>
            );
          })}
        </main>
      )}
    </div>
  );
}
