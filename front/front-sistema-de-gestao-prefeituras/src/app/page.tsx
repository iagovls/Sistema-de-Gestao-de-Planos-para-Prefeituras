"use client";

import Image from "next/image";
import { MainTitle } from "./components/mainTitle";
import { useRouter } from "next/navigation";
import { usePrefeituras } from "./hooks/usePropostas";
import BotaoComun from "./components/botoes/botaoComun";
import Link from "next/link";
import { Prefeitura } from "./types/proposta";


export default function Home() {
  const router = useRouter();
  
  const { prefeituras, isLoading, isError, error } = usePrefeituras();


  const handlePrefeituraClick = (prefeitura: Prefeitura) => {
    router.push(`/dashboard?prefeituraId=${prefeitura.id}`);
  };

  const handleMonitoramentoClick = () => {
    router.push('/monitoramento');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen ">
        <MainTitle />
        <main className="w-full px-4">
          <div className="max-w-6xl mx-auto text-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azulclaro mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Carregando prefeituras...</p>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen ">
        <MainTitle />
        <main className="w-full px-4">
          <div className="max-w-6xl mx-auto text-center mt-10">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Erro ao carregar prefeituras</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <MainTitle />
      <main className="w-full px-4">
        <div className="max-w-6xl mx-auto">
          {/* Grid responsivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {prefeituras.map((prefeitura: Prefeitura) => {
              return (
                <div
                key={prefeitura.id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handlePrefeituraClick(prefeitura)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePrefeituraClick(prefeitura);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Acessar dashboard da Prefeitura de ${prefeitura.name}`}
              >
                {/* Logos */}
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="flex flex-col items-center">
                    <Image
                      src={prefeitura.logoPrefeitura || "/noImage.png"}
                      alt={`Logo Prefeitura Municipal de ${prefeitura.name}`}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                    
                  </div>
                  <div className="flex flex-col items-center">
                    <Image
                      src={prefeitura.logoCMDCA || "/noImage.png"}
                      alt={`Logo CMDCA ${prefeitura.name}`}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                    
                  </div>
                </div>
                
                {/* Nome da Prefeitura */}
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Prefeitura de <br />
                    <span className="text-xl font-bold text-azulclaro">{prefeitura.name}</span>
                  </h2>
                </div>
              </div>
              )
            })}
          </div>
          
          {/* Botão de Monitoramento */}
          <div className="text-center mt-16 mb-10">
            <Link
              href="/monitoramento"
              aria-label="Acessar página de monitoramento"
              className="inline-block"
            >
              <BotaoComun titulo="Monitoramento" onClick={handleMonitoramentoClick} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
