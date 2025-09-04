"use client";

import BotaoComun from "@/app/components/botoes/botaoComun";
import PopUpConfirmation from "@/app/components/popupConfirmation";
import PrefeituraTitle from "@/app/components/prefeituraTitle";
import Title from "@/app/components/title";
import { usePrefeituras, historicoProposta } from "@/app/hooks/usePropostas";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface Prefeitura {
  id: number;
  name: string;
}

interface Proposta {
  id: number;
  titulo: string;
  plano: Plano;
  eixo: Eixo;
  categoria: Categoria;
  orgaoGestor: OrgaoGestor; 
  status: string;
  meta: string;
  motivo: string;
  metaPermanente: boolean;
  ativa: boolean;
}

interface PropostaSnapshot {
  id: number;
  titulo: string;
  meta: string;
  planoTitulo: string;
  eixoTitulo: string;
  categoriaTitulo: string;
  orgaoGestorTitulo: string;
  status: string;
  motivo: string;
  modificadoPor: string;
  dataModificacao: string;
  metaPermanente: boolean;
}

interface Plano {
  titulo: string;
  id: number;
}
interface Eixo {
  titulo: string;
  id: number;
}
interface Categoria {
  titulo: string;
  id: number;
}
interface OrgaoGestor {
  titulo: string;
  id: number;
}

export default function EditarProposta() {
  const searchParams = useSearchParams();
  const prefeituraId = Number(searchParams.get("prefeituraId"));
  const propostaId = Number(searchParams.get("propostaId"));

  const {
    propostasSnapshots,
    isLoading: isLoadingSnapshots,
    isError: isErrorSnapshots,
  } = historicoProposta(propostaId);
  const { prefeituras, error } = usePrefeituras();
  const prefeitura = prefeituras?.find(
    (p: Prefeitura) => p.id === prefeituraId
  );
  const status: string[] = ["Em Andamento", "Concluída"];
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showActivate, setShowActivate] = useState(false);
  const [proposta, setProposta] = useState<Proposta | null>(null);
  console.log("proposta: ", proposta);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [metaPermanente, setMetaPermanente] = useState(false);

  const planos: Plano[] = prefeitura?.planos || [];
  const eixos: Eixo[] = prefeitura?.eixos || [];
  const categorias: Categoria[] = prefeitura?.categorias || [];
  const orgaos: OrgaoGestor[] = prefeitura?.orgaosGestores || [];

  const fetchProposta = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/propostas/${propostaId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProposta(data);
      setMetaPermanente(data.metaPermanente || false);
      setIsError(false);
    } catch (error) {
      console.error("Erro ao buscar proposta:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (propostaId) {
      fetchProposta();
    }
  }, [propostaId]);

  const [formData, setFormData] = useState({
    titulo: "",
    planoId: 0,
    eixoId: 0,
    categoriaId: 0,
    orgaoGestorId: 0,
    status: "",
    meta: "",
    metaPermanente: false,
    ativa: true,
    motivo: "",
    prefeituraId: prefeituraId,
  });

console.log("meta: ", formData.meta);
console.log("metaPermanente: ", formData.metaPermanente);

  useEffect(() => {
    if (proposta) {
      setFormData({
        titulo: proposta.titulo || "",
        planoId: proposta.plano.id || 0,
        eixoId: proposta.eixo.id || 0,
        categoriaId: proposta.categoria.id || 0,
        orgaoGestorId: proposta.orgaoGestor.id || 0,
        status: proposta.status
          ? proposta.status
              .toUpperCase()
              .replace(" ", "_")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          : "",
        meta: proposta.meta || "",
        metaPermanente: proposta.metaPermanente || false,
        ativa: proposta.ativa !== undefined ? proposta.ativa : true,
        motivo: "",
        prefeituraId: prefeituraId,
      });
      console.log("formData: ", formData);
    }
  }, [proposta]);

  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === "status") {
      const normalized = value
        .replace(" ", "_")
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      setFormData({ ...formData, [name]: normalized });
    } else if (name === "meta") {
      // transformar 1970 em formato java datetime
      const normalized = value + "-12-31T00:00:00.000Z" ;
      setFormData({ ...formData, [name]: normalized });
    } else {
      // Converter para número se for um campo de ID
      const finalValue = name.endsWith("Id") ? Number(value) : value;
      setFormData({ ...formData, [name]: finalValue });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setShowConfirmation(false);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token não encontrado");
      return;
    }

    try {
      // Enviar alteração para o back-end (editar proposta)
      const response = await fetch(
        `http://localhost:8080/propostas?id=${propostaId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      console.log("formData: ", formData);

      if (response.ok) {
        alert("Proposta atualizada com sucesso!");
        await fetchProposta(); // Recarrega os dados atualizados
      } else {
        const error = await response.text();
        alert("Erro ao atualizar proposta: " + error);
      }
    } catch (error) {
      console.error("Erro ao atualizar proposta:", error);
      alert("Ocorreu um erro ao atualizar a proposta.");
    }
  };

  const handleConfirmCancel = () => {
    setShowCancel(true);
  };

  const handleConfirmActivate = () => {
    setShowActivate(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-5">
        <PrefeituraTitle />
        <h1 className="text-2xl font-bold">Alterar Proposta</h1>
        <div className="w-6/12 h-32 flex items-center justify-center bg-white shadow-sm p-10 rounded-2xl mb-5">
          Carregando dados...
        </div>
      </div>
    );
  }

  if (isError || error) {
    return (
      <div className="flex flex-col items-center gap-5">
        <PrefeituraTitle />
        <h1 className="text-2xl font-bold">Alterar Proposta</h1>
        <div className="w-6/12 h-32 flex items-center justify-center bg-white shadow-sm p-10 rounded-2xl mb-5 text-red-600">
          Ocorreu um erro ao carregar os dados.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <PrefeituraTitle />
      <Title titulo={"Alterar Proposta"} />
      <form
        ref={formRef}
        className="flex flex-col w-6/12 h-auto bg-white shadow-sm p-10 rounded-2xl mb-5"
        onSubmit={handleSubmit}
      >
        <label className="font-bold text-lg pl-4">Proposta</label>
        <input
          type="text"
          name="titulo"
          className="w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          defaultValue={proposta?.titulo || ""}
          placeholder={proposta?.titulo || "Digite o novo título"}
          onChange={handleChange}
        />
        <label className="font-bold text-lg pl-4">Plano</label>
        <select
          id="plano-select"
          aria-label="Selecione o plano"
          name="planoId"
          value={formData.planoId}
          onChange={handleChange}
          className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={proposta?.plano.id}>{proposta?.plano.titulo}</option>
          {planos
            .filter((plano: Plano) => plano.id !== proposta?.plano.id)
            .map((plano: Plano) => (
              <option key={plano.id} value={plano.id}>
                {plano.titulo}
              </option>
            ))}
        </select>
        <label htmlFor="eixo-select" className="font-bold text-lg mt-4 pl-4">
          Eixo
        </label>
        <select
          id="eixo-select"
          name="eixoId"
          value={formData.eixoId}
          onChange={handleChange}
          className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={proposta?.eixo.id}>
            {proposta?.eixo.titulo}
          </option>
          {eixos
            .filter((eixo: Eixo) => eixo.id !== proposta?.eixo.id)
            .map((eixo: Eixo) => (
              <option key={eixo.id} value={eixo.id}>
                {eixo.titulo}
              </option>
            ))}
        </select>
        <label
          htmlFor="categoria-select"
          className="font-bold text-lg mt-4 pl-4"
        >
          Categoria
        </label>
        <select
          id="categoria-select"
          name="categoriaId"
          value={formData.categoriaId}
          onChange={handleChange}
          className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={proposta?.categoria.id}>
            {proposta?.categoria.titulo}
          </option>
          {categorias
            ?.filter(
              (categoria: Categoria) => categoria.id !== proposta?.categoria.id
            )
            .map((categoria: Categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.titulo}
              </option>
            ))}
        </select>
        <label
          htmlFor="orgao-gestor-select"
          className="font-bold text-lg mt-4 pl-4"
        >
          Orgão Gestor
        </label>
        <select
          id="orgao-gestor-select"
          name="orgaoGestorId"
          value={formData.orgaoGestorId}
          onChange={handleChange}
          className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={proposta?.orgaoGestor.id}>
            {proposta?.orgaoGestor.titulo}
          </option>
          {orgaos
            ?.filter(
              (orgao: OrgaoGestor) => orgao.id !== proposta?.orgaoGestor.id
            )
            .map((orgao: OrgaoGestor) => (
              <option key={orgao.id} value={orgao.id}>
                {orgao.titulo}
              </option>
            ))}
        </select>
        <label htmlFor="status-select" className="font-bold text-lg mt-4 pl-4">
          Status
        </label>
        <select
          id="status-select"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {status.map((s: string, id: number) => (
            <option
              key={id}
              value={s
                .toUpperCase()
                .replace(" ", "_")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")}
            >
              {s}
            </option>
          ))}
        </select>
        <label className="font-bold text-lg pl-4 mt-4">Meta</label>
        <div className="flex items-center gap-4 ">
          <input
            type="text"
            name="meta"
            className={`w-24 border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              metaPermanente ? "bg-gray-100 text-gray-300" : ""
            }`}
            value={formData.meta.split("-")[0]}
            onChange={handleChange}
            placeholder="YYYY"
            maxLength={4}
            pattern="\d{4}"
            disabled={metaPermanente}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="metaPermanente"
              checked={metaPermanente}
              onChange={(e) => {
                setMetaPermanente(e.target.checked);
                setFormData({ ...formData, metaPermanente: e.target.checked });
              }}
            />
            Meta permanente
          </label>
        </div>
        <label className="font-bold text-lg pl-4 mt-4">
          Motivo da alteração
        </label>
        <textarea
          name="motivo"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={formData.motivo}
          onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
          placeholder="Descreva o motivo da alteração"
          rows={3}
          required
        />
              <div className="flex justify-between mt-6 gap-4">
                <div onClick={() => {
                  if (!metaPermanente && formData.meta == "") {
                    alert("Se a meta não for permanente, informe a meta.")
                    setShowConfirmation(false)
                  } else {
                    setShowConfirmation(true)
                  }
                  }}>
                  <BotaoComun titulo="Salvar alterações" />
                </div>
                {/* Se proposta desativada, botao ativar proposta, se ativa, botao desativar proposta, status desativada em vermelho, ativa em verde */}
                {!proposta?.ativa ? (
                  <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold mt-5">
                      Proposta: <span className="text-vermelho">Desativada</span>
                    </h1>
                    <div onClick={() => handleConfirmActivate()}>
                      <BotaoComun titulo="Ativar proposta" cor="bg-verde" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold mt-5">
                      Proposta: <span className="text-verde">Ativa</span>
                    </h1>
                    <div onClick={() => handleConfirmCancel()}>
                      <BotaoComun titulo="Desativar proposta" cor="bg-vermelho" />
                    </div>
                  </div>
                )}
              </div>
        {showConfirmation && (
          <PopUpConfirmation
            message="Você tem certeza que deseja salvar as alterações nesta proposta?"
            onConfirm={async () => await handleSubmit()}
            onCancel={() => setShowConfirmation(false)}
          />
        )}
        {showCancel && (
          <PopUpConfirmation
            message="Ao confirmar, a proposta não será excluída. Ela, apenas, não estará mais visível nas métricas e não será vista por usuários não logados. Você tem certeza que deseja desativar esta proposta?"
            onConfirm={async () => {
              const updatedFormData = {
                ...formData,
                ativa: false,
                motivo: formData.motivo || "Proposta desativada",
              };
              setFormData(updatedFormData);

              const token = localStorage.getItem("token");
              if (!token) {
                alert("Token não encontrado");
                return;
              }

              try {
                const response = await fetch(
                  `http://localhost:8080/propostas?id=${propostaId}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedFormData),
                  }
                );

                if (response.ok) {
                  alert("Proposta desativada com sucesso!");
                  await fetchProposta(); // Recarrega os dados
                } else {
                  const error = await response.text();
                  alert("Erro ao desativar proposta: " + error);
                }
              } catch (error) {
                console.error("Erro ao desativar proposta:", error);
                alert("Ocorreu um erro ao desativar a proposta.");
              }

              setShowCancel(false);
            }}
            onCancel={() => setShowCancel(false)}
          />
        )}
        {showActivate && (
          <PopUpConfirmation
            message="Você tem certeza que deseja ativar esta proposta?"
            onConfirm={async () => {
              const updatedFormData = {
                ...formData,
                ativa: true,
                motivo: formData.motivo || "Proposta ativada",
              };
              setFormData(updatedFormData);
              const token = localStorage.getItem("token");
              if (!token) {
                alert("Token não encontrado");
                return;
              }

              try {
                const response = await fetch(
                  `http://localhost:8080/propostas?id=${propostaId}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedFormData),
                  }
                );

                if (response.ok) {
                  alert("Proposta ativada com sucesso!");
                  await fetchProposta(); // Recarrega os dados
                } else {
                  const error = await response.text();
                  alert("Erro ao ativar proposta: " + error);
                }
              } catch (error) {
                console.error("Erro ao ativar proposta:", error);
                alert("Ocorreu um erro ao ativar a proposta.");
              }

              setShowActivate(false);
            }}
            onCancel={() => setShowActivate(false)}
          />
        )}
      </form>
      <Title titulo="Histórico" />
      {isLoadingSnapshots && (
        <div className="w-full h-32 flex items-center justify-center bg-white shadow-sm p-10 rounded-2xl mb-5">
          Carregando histórico...
        </div>
      )}
      {isErrorSnapshots && (
        <div className="w-full h-32 flex items-center justify-center bg-white shadow-sm p-10 rounded-2xl mb-5 text-red-600">
          Ocorreu um erro ao carregar o histórico.
        </div>
      )}
      <div className="flex flex-col gap-4">
        {!isLoadingSnapshots && propostasSnapshots.length == 0 ? (
          <div className="w-auto h-auto flex items-center justify-center bg-white shadow-sm p-3 rounded-2xl mb-5">
            Nenhum histórico encontrado
          </div>
        ) : (
        // ordem decrescente
          propostasSnapshots.sort((a: PropostaSnapshot, b: PropostaSnapshot) => new Date(b.dataModificacao).getTime() - new Date(a.dataModificacao).getTime()).map((snapshot: PropostaSnapshot, index: number) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <p className="font-bold">{index == propostasSnapshots.length - 1 ? `Proposta criada por ${
                snapshot.modificadoPor
              } em ${
                // Ajustar para horário de Brasília (UTC-3)
                new Date(new Date(snapshot.dataModificacao).getTime() - 3 * 60 * 60 * 1000).toISOString().split("T")[0]
              } às ${
                new Date(new Date(snapshot.dataModificacao).getTime() - 3 * 60 * 60 * 1000).toISOString().split("T")[1].substring(0, 5)
              }` : `Proposta alterada por ${
                snapshot.modificadoPor
              } em ${
                // Ajustar para horário de Brasília (UTC-3)
                new Date(new Date(snapshot.dataModificacao).getTime() - 3 * 60 * 60 * 1000).toISOString().split("T")[0]
              } às ${
                new Date(new Date(snapshot.dataModificacao).getTime() - 3 * 60 * 60 * 1000).toISOString().split("T")[1].substring(0, 5)
              }`}</p>
              {/* apenas Motivo: em negrito */}
              { index != propostasSnapshots.length - 1 ? 
                <p className="">
                <span className="font-bold">Motivo:</span> {snapshot.motivo}
              </p> : ""}
              <p className="">
                <span className="font-bold">Título:</span> {snapshot.titulo}
              </p>
              <p className="">
                <span className="font-bold">Plano:</span> {snapshot.planoTitulo}
              </p>
              <p className="">
                <span className="font-bold">Eixo:</span> {snapshot.eixoTitulo}
              </p>
              <p className="">
                <span className="font-bold">Categoria:</span>{" "}
                {snapshot.categoriaTitulo}
              </p>
              <p className="">
                <span className="font-bold">Orgão Gestor:</span>{" "}
                {snapshot.orgaoGestorTitulo}
              </p>
              <p className="">
                <span className="font-bold">Status:</span> {snapshot.status.replaceAll("_", " ")}
              </p>
              <p className="">
                <span className="font-bold">Meta:</span>{" "}
                {/* apenas o ano da meta */}
                {snapshot.meta
                  ? new Date(snapshot.meta).getFullYear()
                  : "Não definida"}
              </p>
              <p className="">
                <span className="font-bold">Meta Permanente:</span>{" "}
                {snapshot.metaPermanente ? "Sim" : "Não"}
              </p>
            </div>
          )))}
      </div>
    </div>
  );
}
