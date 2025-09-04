"use client"

import Image from "next/image"
import { useSearchParams } from "next/navigation";
import { usePrefeituras } from "../hooks/usePropostas";


export default function PrefeituraTitle() {

    const prefeituraName = useSearchParams().get("prefeituraName");
    const prefeituraId = Number(useSearchParams().get("prefeituraId"));
    const { prefeituras, isLoading, isError, error } = usePrefeituras();
    const prefeitura = prefeituras?.find((p: { id: number }) => p.id === prefeituraId);
    const searchParams = useSearchParams();

    const planoName = searchParams.get("planoName");
    const eixoName = searchParams.get("eixoName");
    const categoriaName = searchParams.get("categoriaName");

    const info = (title: string, subTitle: string | null) => {
    return (
        <div className="flex flex-col items-start w-auto mb-3 ">
            <h1 className="text-lg font-bold w-full rounded-md">{title}</h1>
            
            <h1 className="text-base">{subTitle}</h1>
            
        </div>
    );
}


    const plano = () => {
        const title = "Plano:"
        const subTitle = planoName;

        if (planoName) {
            return (
                <div className="">
                    {info(title, subTitle)}
                </div>
            )
        }
    }

    const eixo = () => {
        const title = "Eixo:"
        const subTitle = eixoName;

        if (eixoName) {
            return (
                <div className="">
                    {info(title, subTitle)}
                </div>
            )
        }
    }

    const categoria = () => {
        const title = "Categoria:"
        const subTitle = categoriaName;

        if (categoriaName) {
            return (
                <div className="">
                    {info(title, subTitle)}
                </div>
            )
        }
    }
    if (isLoading) {
        return (
            <div>
                <p>Carregando prefeitura...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div>
                <p>Erro ao carregar prefeitura: {error?.message}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full items-center gap-5">
            <div className="grid grid-cols-2 gap-2 justify-center text-center">
                {/* Nome da prefeitura e logos */}

                <h1 className="col-span-2 text-center text-4xl text-black">
                    Prefeitura de <strong>{prefeitura?.name}</strong>
                </h1>
                <Image
                    src={prefeitura?.logoPrefeitura || "/noImage.png"}
                    alt={`Logo Prefeitura Municipal de ${prefeituraName}`}
                    width={100}
                    height={100}
                    className="justify-self-end"
                />
                <Image
                    src={prefeitura?.logoCMDCA || "/noImage.png"}
                    alt={`Logo CMDCA ${prefeituraName}`}
                    width={100}
                    height={100}
                    className="justify-self-start"
                />

            </div>

            <div className={planoName ? `flex flex-col items-start w-auto h-auto bg-white rounded-2xl px-5 py-2 mb-5 shadow-sm` : ``}
            >
                {plano()}
                {eixo()}
                {categoria()}
            </div>



        </div>
    )
}
