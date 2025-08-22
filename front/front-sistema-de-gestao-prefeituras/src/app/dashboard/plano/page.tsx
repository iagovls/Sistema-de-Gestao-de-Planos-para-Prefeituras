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

interface EixoData {
    eixoNome: string;
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
    const prefeitura = prefeituras?.find((p: any) => p.id === prefeituraId);

    const router = useRouter();
    const handleEixoClick = (eixo: EixoData) => {
        router.push(`/dashboard/plano/eixo?prefeituraId=${prefeitura.id}&prefeituraName=${encodeURIComponent(prefeitura.name)}&planoName=${planoName}&eixoName=${eixo.eixoNome}`);
    };

    const { propostas, isLoading, isError } = usePropostas(prefeituraId);

    // Processar dados das propostas para agrupar por eixo
    const eixosData = useMemo(() => {
        if (!propostas) return [];

        const eixosMap = new Map<string, EixoData>();

        propostas.forEach((proposta: Proposta) => {
            if (proposta.plano == planoName) {

                const eixoNome = proposta.eixo || "Eixo não definido";
                if (!eixosMap.has(eixoNome)) {
                    eixosMap.set(eixoNome, {
                        eixoNome,
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
                    case "andamento":
                        eixo.emAndamento++;
                        break;
                    case "vencida":
                        eixo.vencidas++;
                        break;
                    default:
                        eixo.emAndamento++; // Status não reconhecido vai para em andamento
                }
            }
        });

        return Array.from(eixosMap.values());
    }, [propostas]);

    // Função para gerar dados do gráfico
    const getChartData = (eixo: EixoData) => {
        return [
            { name: "Cumpridas", value: eixo.cumpridas },
            { name: "Em Andamento", value: eixo.emAndamento },
            { name: "Vencidas", value: eixo.vencidas },
        ];
    };

    // if (!prefeituraId) return <p>ID da prefeitura não fornecido.</p>;
    if (isLoading) return <p>Carregando propostas...</p>;
    if (isError) return <p>Erro ao carregar propostas.</p>;

    return (
        <div className="w-full place-items-center">
            <PrefeituraTitle />
            <BotaoIncluir titulo="eixo"/>

            <h1 className="font-bold text-3xl">Eixos</h1>
            

            {eixosData.length === 0 ? (
                <div className="text-center mt-10">
                    <p className="text-gray-600">
                        Nenhuma proposta encontrada para este eixo.
                    </p>
                </div>
            ) : (
                <main className="w-full max-w-6xl mx-auto flex flex-col items-center">
                    {eixosData.map((eixo, id) => {
                        const chartData = getChartData(eixo);

                        return (
                            <div
                                key={id}
                                className="w-8/12 bg-white shadow-sm rounded-2xl p-6 mt-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                                onClick={() => handleEixoClick(eixo)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleEixoClick(eixo);
                                    }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={`Acessar dashboard do Plano ${""}`}
                            >
                                <h2 className="text-xl font-bold text-center mb-6">
                                    {eixo.eixoNome}
                                </h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Grafico chartData={chartData} />
                                    {/* Estatísticas */}
                                    <div className="space-y-4">
                                        <h1 className="text-center font-bold ">Propostas</h1>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-green-100 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {eixo.cumpridas}
                                                </div>
                                                <div className="text-sm text-green-700">Cumpridas</div>
                                            </div>
                                            <div className="bg-orange-100 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-orange-600">
                                                    {eixo.emAndamento}
                                                </div>
                                                <div className="text-sm text-orange-700">
                                                    Em Andamento
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-red-100 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {eixo.vencidas}
                                                </div>
                                                <div className="text-sm text-red-700">Vencidas</div>
                                            </div>
                                            <div className="bg-blue-100 p-4 rounded-lg text-center">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {eixo.totalPropostas}
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
