import React, { useState } from 'react';

export default function Eixo5() {
    const [totalDePropostas, setTotalDePropostas] = useState(10);
    const [propostasCumpridas, setPropostasCumpridas] = useState(5);
    const [propostasEmAndamento, setPropostasEmAndamento] = useState(3);
    const [propostasVencidas, setPropostasVencidas] = useState(2);
    return (
        <main className='w-dvh place-items-center'>
            <div className="w-full h-96 bg-white shadow-sm rounded-2xl p-5 mt-5 flex flex-col justify-center items-center">
                <h1 className='text-xl'>Eixo 1 - <strong className="">Promoção dos Direitos de Crianças e Adolescentes</strong></h1>
                <div className="w-full h-64 mt-5 rounded-lg flex justify-center items-center">
                    {/* gráfico */}
                    <div>
                        <h1>Total de propostas: {totalDePropostas}</h1>
                        <h1>Cumpridas: {propostasCumpridas}</h1>
                        <h1>Em andamento: {propostasEmAndamento}</h1>
                        <h1>Vencidas: {propostasVencidas}</h1>
                    </div>
                </div>
            </div>
        </main>
    )
}