"use client";

import BotaoComun from "@/app/components/botoes/botaoComun";
import PopUpConfirmation from "@/app/components/popupConfirmation";
import PrefeituraTitle from "@/app/components/prefeituraTitle";
import Title from "@/app/components/title";
import { usePrefeituras } from "@/app/hooks/usePropostas";
import { useSearchParams } from "next/navigation";
import { useState, useRef } from "react";

interface Prefeitura {
  id: number;
  name: string;
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

export default function CriarProposta() {
  const searchParams = useSearchParams();
  const prefeituraId = Number(searchParams.get("prefeituraId"));

  
  const { prefeituras } = usePrefeituras();
  const prefeitura = prefeituras?.find(
    (p: Prefeitura) => p.id === prefeituraId
  );
  const status: string[] = ["Em Andamento", "Concluída"];
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [metaPermanente, setMetaPermanente] = useState(false);

  const planos: Plano[] = prefeitura?.planos || [];
  const eixos: Eixo[] = prefeitura?.eixos || [];
  const categorias: Categoria[] = prefeitura?.categorias || [];
  const orgaos: OrgaoGestor[] = prefeitura?.orgaosGestores || [];

  


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
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === "status") {
      // Normaliza para o formato do enum do backend: UPPERCASE, com _ e sem acentos
      const normalized = value
        .replace(" ", "_")
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
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
        `http://localhost:8080/propostas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      console.log("formData: ", formData);

      if (response.ok) {
        alert("Proposta criada com sucesso!");
      } else {
        const error = await response.text();
        alert("Erro ao criar proposta: " + error);
      }
    } catch (error) {
      console.error("Erro ao criar proposta:", error);
      alert("Ocorreu um erro ao criar a proposta.");
    }
  };
  return (
    <div className="flex flex-col items-center gap-5">
      <PrefeituraTitle />
      <Title titulo={"Criar Proposta"} />
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
          placeholder={"Título da nova proposta"}
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
          <option value={0}>Selecione um plano</option>
          {planos
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
          <option value={0}>Selecione um eixo</option>
          {eixos
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
          <option value={0}>Selecione uma categoria</option>
          {categorias
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
          <option value={0}>Selecione um orgão gestor</option>
          {orgaos
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
          <option value="">Selecione um status</option>
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
          Motivo da criação	
        </label>
        <textarea
          name="motivo"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={formData.motivo}
          onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
          placeholder="Descreva o motivo da criação"
          rows={3}
          required
        />
        {showConfirmation && (
          <div>
            
            <PopUpConfirmation
              message={`Você tem certeza que deseja criar esta proposta?`}
              onConfirm={async () => await handleSubmit()}
              onCancel={() => setShowConfirmation(false)}
            />
          </div>
        )}
        <div className="flex justify-between mt-6 gap-4">
          <div onClick={() => setShowConfirmation(true)}>
            <BotaoComun titulo="Criar proposta" />
          </div>
          {/* Se proposta desativada, botao ativar proposta, se ativa, botao desativar proposta, status desativada em vermelho, ativa em verde */}
          
        </div>
      </form>
      
    </div>
  );
}
