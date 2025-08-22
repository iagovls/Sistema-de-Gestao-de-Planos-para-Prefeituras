"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePropostas, usePrefeituras } from "@/app/hooks/usePropostas";
import PrefeituraTitle from "@/app/components/prefeituraTitle";
import BotaoIncluir from "@/app/components/botoes/botaoIncluir";

interface Proposta {
    id: number;
    titulo: string;
    status: string;
    plano: string;
    eixo: string;
    categoria: string;
    orgaoGestor: string;
    meta: string;
}

export default function Propostas() {
    const searchParams = useSearchParams();

    const prefeituraId = Number(searchParams.get("prefeituraId"));
    const planoName = searchParams.get("planoName");
    const eixoName = searchParams.get("eixoName");
    const categoriaName = searchParams.get("categoriaName");

    const { prefeituras } = usePrefeituras();
    const prefeitura = prefeituras?.find((p: any) => p.id === prefeituraId);

    const router = useRouter();
    const handlePropostaClick = (proposta: Proposta) => {
        router.push(`/dashboard/plano/eixo/categoria/proposta?prefeituraId=${prefeitura.id}&prefeituraName=${encodeURIComponent(prefeitura.name)}&propostaId=${proposta.id}`);
    };

    const { propostas, isLoading, isError } = usePropostas(prefeituraId);
    console.log("propostas: ", propostas);

    const propostasList = useMemo(() => {
        if (!propostas) return [];

        return propostas.filter((proposta: Proposta) =>
            proposta.plano === planoName &&
            proposta.eixo === eixoName &&
            proposta.categoria === categoriaName &&
            proposta.status !== "Cancelada"
        );
    }, [propostas, planoName, eixoName, categoriaName]);



    if (!prefeituraId) return <p>ID da prefeitura não fornecido.</p>;
    if (isLoading) return <p>Carregando propostas...</p>;
    if (isError) return <p>Erro ao carregar propostas.</p>;

    const statusColor = (status: string) => {
        return (

            status === "Em Andamento" ?
            "blue-400" :
            status === "Vencida" ?
            "red-400" :
            status === "Cumprida" ?
            "green-400" :
            ""
        )
    }

    return (
        <div className="w-full place-items-center">
            <PrefeituraTitle />
            <BotaoIncluir titulo="proposta"/>   

            <h1 className="font-bold text-3xl mt-5">Propostas</h1>
            {propostasList.length === 0 ? (
                <div className="text-center mt-10">
                    <p className="text-gray-600">
                        Nenhuma proposta encontrada para esta categoria.
                    </p>
                </div>
            ) : (
                <main className="w-full max-w-6xl mx-auto flex flex-col items-center">
                    {propostasList.map((proposta: Proposta, id: number) => {

                        return (
                            <div
                                key={id}
                                className="w-8/12 bg-white shadow-sm rounded-2xl p-6 mt-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                                onClick={() => handlePropostaClick(proposta)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handlePropostaClick(proposta);
                                    }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={`Acessar dashboard do Plano ${""}`}
                            >

                                <h2 className=" text-justify mb-10">
                                    {proposta.titulo}
                                </h2>
                                <div className="flex justify-between">
                                    <h1 className="text-azulclaro">
                                        <strong>Orgão Gestor: </strong>
                                        {proposta.orgaoGestor}
                                    </h1>
                                    <div className="flex gap-10">
                                        <div className="flex items-center gap-3">
                                            <h1>Meta:</h1>
                                            <div className={`rounded-full bg-green-300 py-1 px-3`}>
                                                {proposta.meta.substring(0,4)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <h1>Status:</h1>
                                            <h1 className={`
                                                rounded-full
                                                bg-${statusColor(proposta.status)}
                                                py-1 px-3
                                                `}>
                                                {proposta.status}
                                            </h1>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        );
                    })}
                </main>
            )}
        </div>
    );
}
