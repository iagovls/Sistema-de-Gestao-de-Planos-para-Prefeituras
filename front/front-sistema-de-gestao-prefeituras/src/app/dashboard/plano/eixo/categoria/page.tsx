"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePropostas, usePrefeituras } from "@/app/hooks/usePropostas";
import PrefeituraTitle from "@/app/components/prefeituraTitle";
import BotaoIncluir from "@/app/components/botoes/botaoIncluir";
import Title from "@/app/components/title";
import { Proposta, Prefeitura } from "@/app/types/proposta";

export default function Propostas() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PropostasContent />
    </Suspense>
  )
}

function PropostasContent() {
  const searchParams = useSearchParams();

  const prefeituraId = Number(searchParams.get("prefeituraId"));
  const planoName = searchParams.get("planoName");
  const eixoName = searchParams.get("eixoName");
  const categoriaName = searchParams.get("categoriaName");

  const { prefeituras } = usePrefeituras();
  const prefeitura = prefeituras?.find(
    (p: Prefeitura) => p.id === prefeituraId
  );

  const router = useRouter();
  const handlePropostaClick = (proposta: Proposta) => {
    router.push(
      `/dashboard/plano/eixo/categoria/proposta?prefeituraId=${
        prefeitura.id
      }&propostaId=${
        proposta.id
      }`
    );
  };

  const { propostas, isLoading, isError } = usePropostas(prefeituraId);
  console.log("propostas: ", propostas);

  const propostasList = useMemo(() => {
    if (!propostas) return [];

    return propostas.filter(
      (proposta: Proposta) =>
        proposta.plano.titulo === planoName &&
        proposta.eixo.titulo === eixoName &&
        proposta.categoria.titulo === categoriaName
    );
  }, [propostas, planoName, eixoName, categoriaName]);

  if (!prefeituraId) return <p>ID da prefeitura não fornecido.</p>;
  if (isLoading) return <p>Carregando propostas...</p>;
  if (isError) return <p>Erro ao carregar propostas.</p>;

  const statusColor = (status: string) => {
    return status === "Em Andamento"
      ? "bg-blue-300"
      : status === "Vencida"
      ? "bg-red-300"
      : status === "Concluída"
      ? "bg-green-300"
      : "";
  };

  return (
    <div className="w-full place-items-center">
      <PrefeituraTitle />

      <Title titulo={"Propostas"} />

      <BotaoIncluir
        titulo="nova proposta"
        onClick={() =>
          router.push(
            `/dashboard/plano/eixo/categoria/proposta/criar-proposta?prefeituraId=${prefeituraId}`
          )
        }
      />

      {propostasList.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-600">
            Nenhuma proposta encontrada para esta categoria.
          </p>
        </div>
      ) : (
        <main className="w-full max-w-6xl mx-auto flex flex-col items-center">
          {propostasList
            .filter((proposta: Proposta) => proposta.ativa)
            .map((proposta: Proposta, id: number) => {
              return (
                <div
                  key={id}
                  className="w-8/12 bg-white shadow-sm rounded-2xl p-6 mt-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-101"
                  onClick={() => handlePropostaClick(proposta)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handlePropostaClick(proposta);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Acessar dashboard do Plano ${""}`}
                >
                  <h2 className=" text-justify mb-10">{proposta.titulo}</h2>
                  <div className="flex justify-between">
                    <h1 className="text-azulclaro">
                      <strong>Orgão Gestor: </strong>
                      {proposta.orgaoGestor.titulo}
                    </h1>
                    <div className="flex gap-10">
                      <div className="flex items-center gap-3">
                        <h1 className="font-bold">Meta:</h1>
                        <div className={`rounded-full bg-green-300 py-1 px-3`}>
                          { proposta.metaPermanente ? 
                          "Permanente" :
                          proposta.meta.substring(0, 4)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <h1 className="font-bold">Status:</h1>
                        <h1
                          className={`
                            rounded-full
                            ${statusColor(proposta.status === "Em Andamento" ? 
                            proposta.meta > new Date().getFullYear().toString() ? "Em Andamento" : "Vencida" :
                            proposta.status)}
                            py-1 px-3
                            `}
                        >
                          {proposta.status === "Em Andamento" ? 
                            proposta.meta > new Date().getFullYear().toString() ? "Em Andamento" : "Vencida" :
                            proposta.status
                          }
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </main>
      )}
      <Title titulo="Propostas Desativadas" />
      {propostasList.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-600">
            Nenhuma proposta encontrada para esta categoria.
          </p>
        </div>
      ) : (
        <main className="w-full text-gray-400 max-w-6xl mx-auto flex flex-col items-center">
          {propostasList
            .filter((proposta: Proposta) => !proposta.ativa)
            .map((proposta: Proposta, id: number) => {
              return (
                <div
                  key={id}
                  className="w-8/12 bg-gray-100 shadow-sm rounded-2xl p-6 mt-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-101"
                  onClick={() => handlePropostaClick(proposta)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handlePropostaClick(proposta);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Acessar dashboard do Plano ${""}`}
                >
                  <h2 className=" text-justify mb-10">{proposta.titulo}</h2>
                  <div className="flex justify-between">
                    <h1 className="text-azulclaro">
                      <strong>Orgão Gestor: </strong>
                      {proposta.orgaoGestor.titulo}
                    </h1>
                    <div className="flex gap-10">
                      <div className="flex items-center gap-3">
                        <h1 className="font-bold">Meta:</h1>
                        <div className={`rounded-full bg-green-300 py-1 px-3`}>
                          {proposta.meta.substring(0, 4)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <h1 className="font-bold">Status:</h1>
                        <h1
                          className={`
                            rounded-full
                            ${statusColor(proposta.status)}
                            py-1 px-3
                            `}
                        >
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
