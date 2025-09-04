
import Grafico from "./grafico";

interface StatusData {
  nome: string;
  totalPropostas: number;
  cumpridas: number;
  emAndamento: number;
  vencidas: number;
}


export default function Info(
  { 
    statusData, 
    onClick 
     
}: { 
    statusData: StatusData[]; 
    onClick: (item: StatusData) => void; 
}
) {

  const getChartData = (info: StatusData) => {
        return [
            { name: "Cumpridas", value: info.cumpridas },
            { name: "Em Andamento", value: info.emAndamento },
            { name: "Vencidas", value: info.vencidas },
        ];
    };
  
  return (
    <div className="">
      {statusData.length === 0 ? (
                <div className="text-center mt-10">
                    <p className="text-gray-600">
                        Nenhuma proposta encontrada para este eixo.
                    </p>
                </div>
            ) : (
                <main className="w-auto mx-auto flex flex-col items-center">
                    {statusData.map((eixo, id) => {
                        const chartData = getChartData(eixo);

                        return (
                            <div
                                key={id}
                                className="w-full bg-white shadow-sm rounded-2xl p-6 mt-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-102"
                                onClick={() => onClick(eixo)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onClick(eixo);
                                    }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={`Acessar dashboard do Plano ${""}`}
                            >
                                <h2 className="text-xl font-bold text-center mb-6">
                                    {eixo.nome}
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
                                </div>
                            </div>
                        );
                    })}
                </main>
            )}
    </div>
  );
}
