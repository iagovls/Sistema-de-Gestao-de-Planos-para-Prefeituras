import React, { useState } from 'react';

export default function Eixo1() {
    const [totalDePropostasEixo1, setTotalDePropostasEixo1] = useState(10);
    const [propostasCumpridasEixo1, setPropostasCumpridasEixo1] = useState(5);
    const [propostasVencidasEixo1, setPropostasVencidasEixo1] = useState(2);
    const [propostasEmAndamentoEixo1, setPropostasEmAndamentoEixo1] = useState(3);

    const [propostasVencidasEixo2, setPropostasVencidasEixo2] = useState(2);
    const [totalDePropostasEixo2, setTotalDePropostasEixo2] = useState(20);
    const [propostasCumpridasEixo2, setPropostasCumpridasEixo2] = useState(5);
    const [propostasEmAndamentoEixo2, setPropostasEmAndamentoEixo2] = useState(3);

    const [propostasVencidasEixo3, setPropostasVencidasEixo3] = useState(2);
    const [totalDePropostasEixo3, setTotalDePropostasEixo3] = useState(30);
    const [propostasCumpridasEixo3, setPropostasCumpridasEixo3] = useState(5);
    const [propostasEmAndamentoEixo3, setPropostasEmAndamentoEixo3] = useState(3);

    const [propostasVencidasEixo4, setPropostasVencidasEixo4] = useState(2);
    const [totalDePropostasEixo4, setTotalDePropostasEixo4] = useState(40);
    const [propostasCumpridasEixo4, setPropostasCumpridasEixo4] = useState(5);
    const [propostasEmAndamentoEixo4, setPropostasEmAndamentoEixo4] = useState(3);

    const [propostasVencidasEixo5, setPropostasVencidasEixo5] = useState(2);
    const [totalDePropostasEixo5, setTotalDePropostasEixo5] = useState(50);
    const [propostasCumpridasEixo5, setPropostasCumpridasEixo5] = useState(5);
    const [propostasEmAndamentoEixo5, setPropostasEmAndamentoEixo5] = useState(3);



    const data = [
        {
            eixo: "Eixo 1 - ",
            titulo: "Promoção dos Direitos de Crianças e Adolescentes",
            descricao: "Este eixo abrange as propostas relacionadas à promoção dos direitos de crianças e adolescentes",
            totalPropostas: totalDePropostasEixo1,
            cumpridas: propostasCumpridasEixo1,
            andamento: propostasEmAndamentoEixo1,
            vencidas: propostasVencidasEixo1
        },
        {
            eixo: "Eixo 2 - ",
            titulo: "Proteção e Defesa dos Direitos de Crianças e Adolescentes",
            descricao: "Este eixo abrange as propostas relacionadas à proteção e defesa dos direitos de crianças e adolescentes",
            totalPropostas: totalDePropostasEixo2,
            cumpridas: propostasCumpridasEixo2,
            andamento: propostasEmAndamentoEixo2,
            vencidas: propostasVencidasEixo2
        },
        {
            eixo: "Eixo 3 - ",
            titulo: "Promoção dos Direitos de Crianças e Adolescentes",
            descricao: "Este eixo abrange as propostas relacionadas à promoção dos direitos de crianças e adolescentes",
            totalPropostas: totalDePropostasEixo3,
            cumpridas: propostasCumpridasEixo3,
            andamento: propostasEmAndamentoEixo3,
            vencidas: propostasVencidasEixo3
        },
        {
            eixo: "Eixo 4 - ",
            titulo: "Promoção dos Direitos de Crianças e Adolescentes",
            descricao: "Este eixo abrange as propostas relacionadas à promoção dos direitos de crianças e adolescentes",
            totalPropostas: totalDePropostasEixo4,
            cumpridas: propostasCumpridasEixo4,
            andamento: propostasEmAndamentoEixo4,
            vencidas: propostasVencidasEixo4
        },
        {
            eixo: "Eixo 5 - ",
            titulo: "Promoção dos Direitos de Crianças e Adolescentes",
            descricao: "Este eixo abrange as propostas relacionadas à promoção dos direitos de crianças e adolescentes",
            totalPropostas: totalDePropostasEixo5,
            cumpridas: propostasCumpridasEixo5,
            andamento: propostasEmAndamentoEixo5,
            vencidas: propostasVencidasEixo5
        }
    ]


    return (
        <main className='w-dvh place-items-center'>
            {data.map((d, index) => (
                <div key={index} className="w-full h-96 bg-white shadow-sm rounded-2xl p-5 mt-5 flex flex-col justify-center items-center">
                    <h1 className='text-xl'>{d.eixo}<strong className="">{d.titulo}</strong></h1>
                    {/* <p className='text-sm text-gray-600'>{d.descricao}</p> */}
                    <div className="w-full h-64 mt-5 rounded-lg flex justify-center items-center">
                        {/* gráfico */}
                        <div>
                            <h1>Total de propostas: {d.totalPropostas}</h1>
                            <h1>Cumpridas: {d.cumpridas}</h1>
                            <h1>Em andamento: {d.andamento}</h1>
                            <h1>Vencidas: {d.vencidas}</h1>
                        </div>
                    </div>
                </div>
            ))}

        </main>
    )

}

