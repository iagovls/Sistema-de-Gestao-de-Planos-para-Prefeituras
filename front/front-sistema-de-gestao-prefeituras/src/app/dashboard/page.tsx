"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { usePropostas, usePrefeituras } from "../hooks/usePropostas";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import PrefeituraTitle from "../components/prefeituraTitle";

interface Proposta {
  id: number;
  titulo: string;
  status: string;
  plano: string;
  eixo: string;
  categoria: string;
  orgaoGestor: string;
}

interface PlanoData {
  planoNome: string;
  totalPropostas: number;
  cumpridas: number;
  emAndamento: number;
  vencidas: number;
}

interface Eixo {
  eixoName: string;
  totalPropostas: number;
  cumpridas: number;
  emAndamento: number;
  vencidas: number;
}

const COLORS = ["#4CAF50", "#FF9800", "#F44336"];

export default function Dashboard() {
  const router = useRouter();
  const handlePrefeituraClick = () => {    
    router.push(`/dashboard/plano`);
  };
  const searchParams = useSearchParams();
  const prefeituraId = Number(searchParams.get("prefeituraId"));

  const { propostas, isLoading, isError } = usePropostas(prefeituraId);
  const {  prefeituras } = usePrefeituras();


  const prefeitura = prefeituras?.find((p: any) => p.id === prefeituraId);

  // Processar dados das propostas para agrupar por plano
  const planosData = useMemo(() => {
    if (!propostas) return [];

    const planosMap = new Map<string, PlanoData>();

    const planosList = new Map<string, string>();
    propostas.forEach((proposta: Proposta) => {
      const planoNome = proposta.plano;
      if (!planosList.has(planoNome)) {
        planosList.set(planoNome, planoNome);
      }
    });

    propostas.forEach((proposta: Proposta) => {
      const planoNome = proposta.plano || "Plano não definido";
      if (!planosMap.has(planoNome)) {
        planosMap.set(planoNome, {
          planoNome,
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
        case "andamento":
          plano.emAndamento++;
          break;
        case "vencida":
          plano.vencidas++;
          break;
        default:
          plano.emAndamento++; // Status não reconhecido vai para em andamento
      }
    });

    return Array.from(planosMap.values());
  }, [propostas]);

  // Função para gerar dados do gráfico
  const getChartData = (plano: PlanoData) => {
    return [
      { name: "Cumpridas", value: plano.cumpridas },
      { name: "Em Andamento", value: plano.emAndamento },
      { name: "Vencidas", value: plano.vencidas },
    ];
  };

  if (!prefeituraId) return <p>ID da prefeitura não fornecido.</p>;
  if (isLoading) return <p>Carregando propostas...</p>;
  if (isError) return <p>Erro ao carregar propostas.</p>;

  return (
    <div className="w-full place-items-center">
      <PrefeituraTitle/>
      <h1 className="text-4xl mt-10 font-bold text-center">Planos</h1>

      {planosData.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-600">
            Nenhuma proposta encontrada para esta prefeitura.
          </p>
        </div>
      ) : (
        <main className="w-full max-w-6xl mx-auto flex flex-col items-center">
          {planosData.map((plano, id) => {
            const chartData = getChartData(plano);

            return (
              <div
                key={id}
                className="w-8/12 bg-white shadow-sm rounded-2xl p-6 mt-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handlePrefeituraClick()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePrefeituraClick();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Acessar dashboard do Plano ${""}`}
              >
                <h2 className="text-xl font-bold text-center mb-6">
                  {plano.planoNome}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="h-64">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ percent }) =>
                              `${name} ${((percent || 0) * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell key={`cell-${0}`} fill={COLORS[0]} />
                            <Cell key={`cell-${1}`} fill={COLORS[1]} />
                            <Cell key={`cell-${2}`} fill={COLORS[2]} />
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        Nenhum dado para exibir
                      </div>
                    )}
                  </div>
                  {/* Estatísticas */}
                  <div className="space-y-4">
                  <h1 className="text-center font-bold ">Propostas</h1>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-100 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {plano.cumpridas}
                        </div>
                        <div className="text-sm text-green-700">Cumpridas</div>
                      </div>
                      <div className="bg-orange-100 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {plano.emAndamento}
                        </div>
                        <div className="text-sm text-orange-700">
                          Em Andamento
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-100 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {plano.vencidas}
                        </div>
                        <div className="text-sm text-red-700">Vencidas</div>
                      </div>
                      <div className="bg-blue-100 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {plano.totalPropostas}
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
