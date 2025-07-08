"use client"

import { useState } from "react"
import Image from "next/image";
import Eixo1 from "../components/eixos/eixo1";
import Eixo2 from "../components/eixos/eixo2";
import Eixo3 from "../components/eixos/eixo3";
import Eixo4 from "../components/eixos/eixo4";
import Eixo5 from "../components/eixos/eixo5";

export default function Dashboard() {
    const [nomeDaPrefeitura, setNomeDaPrefeitura] = useState("Igrapiúna");
    const [totalDePropostas, setTotalDePropostas] = useState(3);
    const [propostasCumpridas, setPropostasCumpridas] = useState(8);
    const [propostasEmAndamento, setPropostasEmAndamento] = useState(9);
    const [propostasVencidas, setPropostasVencidas] = useState(6);

    return (
        <div className="w-full place-items-center">
            {/*colocar imagens juntas  */}
            <div className="grid grid-cols-2 gap-2 justify-center text-center">
                <h1 className="col-span-2 text-center text-4xl text-black">
                    Prefeitura de <strong>{nomeDaPrefeitura}</strong>
                </h1>
                <Image
                    src="/prefeituraPresidenteTancredoNevesLogo.jpg"
                    alt="Logo da prefeitura"
                    width={100}
                    height={100}
                    className="justify-self-end"
                />
                <Image
                    src="/cmdcaPresidenteTancredoNeves.jpg"
                    alt="Logo do CMDCA"
                    width={100}
                    height={100}
                    className="justify-self-start"
                />
            </div>
            <h1 className="text-4xl mt-10">Eixos</h1>
            <div className="flex flex-col w-auto justify-center items-center">
                <Eixo1 />
                <Eixo2 />
                <Eixo3 />
                <Eixo4 />
                <Eixo5 />
            </div>
        </div>
    )
}

const data = [
    {
        eixo: "Eixo 1",
        totalPropostas: 10,
        cumpridas: 5,
        andamento: 3,
        vencidas: 2
    },
    {
        eixo: "Eixo 2",
        totalPropostas: 8,
        cumpridas: 4,
        andamento: 2,
        vencidas: 2
    }
]