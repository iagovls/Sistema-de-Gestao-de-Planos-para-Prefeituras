"use client"

import PrefeituraTitle from "@/app/components/prefeituraTitle";
import { usePrefeituras, usePropostas } from "@/app/hooks/usePropostas";
import { useSearchParams } from "next/navigation";



interface Prefeitura {
    id: number;
    titulo: string;
    status: string;
    plano: {
        titulo: string;
        id: number;
    };
    eixo: {
        titulo: string;
        id: number;
    };
    categoria: {
        titulo: string;
        id: number;
    };
    orgaoGestor: {
        titulo: string;
        id: number;
    };
    meta: string;
}

interface Plano {
    titulo: string;
    id: number
}
interface Eixo {
    titulo: string;
    id: number
}
interface Categoria {
    titulo: string;
    id: number
}
interface OrgaoGestor {
    titulo: string;
    id: number
}

export default function EditarProposta() {
    const searchParams = useSearchParams();
    const prefeituraId = Number(searchParams.get("prefeituraId")); 
    const propostaId = Number(searchParams.get("propostaId"));
    const { propostas, isLoading, isError } = usePropostas(prefeituraId);
    const { prefeituras, error } = usePrefeituras();
    const prefeitura = prefeituras?.find((p: any) => p.id === prefeituraId);
    const status: string[] = ["Em andamento", "Concluída", "Vencida"];

    {/*coletar propostas[propostaId]*/}
    const proposta = propostas?.find((p: any) => p.id === propostaId);

    return (
        <div className="flex flex-col items-center gap-5">
            <PrefeituraTitle />
            <h1 className="text-2xl font-bold">Alterar Proposta</h1>

            {/*Alterar proposta, Plano, Eixo, Categoria, Orgão Gestor*/}
            <div className="flex flex-col w-6/12 h-auto bg-white shadow-sm p-10 rounded-2xl mb-5">
                <label className="font-bold text-lg pl-4">Proposta</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    defaultValue={proposta?.titulo}
                />
                <label className="font-bold text-lg pl-4">Plano</label>
                <select
                    defaultValue={proposta?.plano}
                    className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={proposta?.plano} hidden>
                        {proposta?.plano}
                    </option>
                    {prefeitura?.planos
                        ?.filter((plano: Plano) => plano.titulo !== proposta?.plano)
                        .map((plano: Plano) => (
                            <option key={plano.id} value={plano.titulo}>
                                {plano.titulo}
                            </option>
                        ))}
                </select>
                <label className="font-bold text-lg mt-4 pl-4">Eixo</label>
                <select className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{proposta?.eixo}</option>
                    {prefeitura?.eixos?.filter((eixo: Eixo) => eixo.titulo !== proposta?.eixo)
                    .map((eixo: Eixo) => (
                        <option key={eixo.id} value={eixo.titulo}>{eixo.titulo}</option>
                    ))}
                </select>
                <label className="font-bold text-lg mt-4 pl-4">Categoria</label>
                <select className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{proposta?.categoria}</option>
                    {prefeitura?.categorias?.filter((categoria: Categoria) => categoria.titulo !== proposta?.categoria)
                    .map((categoria: Categoria) => (
                        <option key={categoria.id} value={categoria.titulo}>{categoria.titulo}</option>
                    ))}
                </select>
                <label className="font-bold text-lg mt-4 pl-4">Orgão Gestor</label>
                <select className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{proposta?.orgaoGestor}</option>
                    {prefeitura?.orgaosGestores?.filter((orgao: OrgaoGestor) => orgao.titulo !== proposta?.orgaoGestor)
                    .map((orgao: OrgaoGestor) => (
                        <option key={orgao.id} value={orgao.titulo}>{orgao.titulo}</option>
                    ))}
                </select>
                <label className="font-bold text-lg mt-4 pl-4">Status</label>
                <select className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">{proposta?.status}</option>
                    {status.filter((s: any) => s !== proposta?.status)
                    .map((s: any, id: number) => (
                        <option key={id} value={s}>{s}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}