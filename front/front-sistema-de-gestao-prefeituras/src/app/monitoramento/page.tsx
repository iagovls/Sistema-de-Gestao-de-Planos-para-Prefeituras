"use client";

import { useState, useMemo, useEffect } from "react";
import { usePrefeituras, useTodasPropostas } from "../hooks/usePropostas";

interface Prefeitura {
  id: number;
  name: string; 
  logoPrefeitura: string;
  logoCMDCA: string;
}

interface Proposta {
  id: number;
  titulo: string;
  status: string;
  prefeituraId: number;
  plano: string;
  eixo: string;
  categoria: string;
  orgaoGestor: string;
}

interface Filtros {
  prefeitura: string;
  plano: string;
  eixo: string;
  categoria: string;
  orgaoGestor: string;
  status: string;
  pesquisa: string;
}

interface OpcoesFiltros {
  prefeituras: string[];
  planos: string[];
  eixos: string[];
  categorias: string[];
  orgaosGestores: string[];
  status: string[];
}

export default function Monitoramento() {
  const { propostas, isLoading, isError } = useTodasPropostas();
  const { prefeituras: listaPrefeituras } = usePrefeituras();
  
  const [filtros, setFiltros] = useState<Filtros>({
    prefeitura: '',
    plano: '',
    eixo: '',
    categoria: '',
    orgaoGestor: '',
    status: '',
    pesquisa: ''
  });

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);

  // Extrair opções únicas para os filtros
  const opcoesFiltros = useMemo((): OpcoesFiltros => {
    if (!propostas) return {
      prefeituras: [],
      planos: [],
      eixos: [],
      categorias: [],
      orgaosGestores: [],
      status: []
    };

    const prefeituras = [...new Set(listaPrefeituras.map((p: Prefeitura) =>
       p.name)
       .filter(Boolean))] as string[];
    const planos = [...new Set(propostas.map((p: Proposta) => p.plano).filter(Boolean))] as string[];
    const eixos = [...new Set(propostas.map((p: Proposta) => p.eixo).filter(Boolean))] as string[];
    const categorias = [...new Set(propostas.map((p: Proposta) => p.categoria).filter(Boolean))] as string[];
    const orgaosGestores = [...new Set(propostas.map((p: Proposta) => p.orgaoGestor).filter(Boolean))] as string[];
    const status = [...new Set(propostas.map((p: Proposta) => p.status).filter(Boolean))] as string[];

    return {
      prefeituras,
      planos,
      eixos,
      categorias,
      orgaosGestores,
      status
    };
  }, [propostas]);

  // Filtrar propostas
  const propostasFiltradas = useMemo(() => {
    if (!propostas) return [];

    // Mapeia nome da prefeitura para id
    const prefeituraSelecionadaId = filtros.prefeitura
      ? listaPrefeituras.find((p: Prefeitura) => p.name === filtros.prefeitura)?.id
      : null;

    return propostas.filter((proposta: Proposta) => {
      const matchPrefeitura = !filtros.prefeitura || proposta.prefeituraId === prefeituraSelecionadaId;
      const matchPlano = !filtros.plano || proposta.plano === filtros.plano;
      const matchEixo = !filtros.eixo || proposta.eixo === filtros.eixo;
      const matchCategoria = !filtros.categoria || proposta.categoria === filtros.categoria;
      const matchOrgaoGestor = !filtros.orgaoGestor || proposta.orgaoGestor === filtros.orgaoGestor;
      const matchStatus = !filtros.status || proposta.status === filtros.status;
      const matchPesquisa = !filtros.pesquisa ||
        proposta.titulo.toLowerCase().includes(filtros.pesquisa.toLowerCase());

      return matchPrefeitura && matchPlano && matchEixo && matchCategoria &&
             matchOrgaoGestor && matchStatus && matchPesquisa;
    });
  }, [propostas, filtros, listaPrefeituras]);

  // Calcular paginação
  const totalItens = propostasFiltradas.length;
  const totalPaginas = Math.ceil(totalItens / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const propostasPaginadas = propostasFiltradas.slice(inicio, fim);

  // Resetar página quando filtros mudarem
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtros]);

  const handleFiltroChange = (campo: keyof Filtros, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({
      prefeitura: '',
      plano: '',
      eixo: '',
      categoria: '',
      orgaoGestor: '',
      status: '',
      pesquisa: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'cumprida':
        return 'bg-green-100 text-green-800';
      case 'em andamento':
      case 'andamento':
        return 'bg-orange-100 text-orange-800';
      case 'vencida':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="text-center mt-10">Carregando propostas...</div>;
  if (isError) return <div className="text-center mt-10 text-red-500">Erro ao carregar propostas.</div>;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Monitoramento de Propostas</h1>
          <p className="mt-2 text-gray-600">Acompanhe todas as propostas de todas as prefeituras</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prefeitura</label>
              <select
                value={filtros.prefeitura}
                onChange={(e) => handleFiltroChange('prefeitura', e.target.value)}
                className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as prefeituras</option>
                {opcoesFiltros.prefeituras.map(prefeitura => (
                  <option key={prefeitura} value={prefeitura}>{prefeitura}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plano</label>
              <select
                value={filtros.plano}
                onChange={(e) => handleFiltroChange('plano', e.target.value)}
                className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os planos</option>
                {opcoesFiltros.planos.map(plano => (
                  <option key={plano} value={plano}>{plano}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eixo</label>
              <select
                value={filtros.eixo}
                onChange={(e) => handleFiltroChange('eixo', e.target.value)}
                className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os eixos</option>
                {opcoesFiltros.eixos.map(eixo => (
                  <option key={eixo} value={eixo}>{eixo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={filtros.categoria}
                onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as categorias</option>
                {opcoesFiltros.categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Órgão Gestor</label>
              <select
                value={filtros.orgaoGestor}
                onChange={(e) => handleFiltroChange('orgaoGestor', e.target.value)}
                className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os órgãos</option>
                {opcoesFiltros.orgaosGestores.map(orgao => (
                  <option key={orgao} value={orgao}>{orgao}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filtros.status}
                onChange={(e) => handleFiltroChange('status', e.target.value)}
                className="select-with-arrow w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os status</option>
                {opcoesFiltros.status.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pesquisar por título</label>
              <input
                type="text"
                value={filtros.pesquisa}
                onChange={(e) => handleFiltroChange('pesquisa', e.target.value)}
                placeholder="Digite o título da proposta..."
                className="w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={limparFiltros}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Contadores */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalItens}</div>
              <div className="text-sm text-gray-600">Total de Propostas</div>
            </div>
                         <div>
               <div className="text-2xl font-bold text-green-600">
                 {propostasFiltradas.filter((p: Proposta) => p.status?.toLowerCase() === 'cumprida').length}
               </div>
               <div className="text-sm text-gray-600">Cumpridas</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-orange-600">
                 {propostasFiltradas.filter((p: Proposta) => 
                   p.status?.toLowerCase() === 'em andamento' || p.status?.toLowerCase() === 'andamento'
                 ).length}
               </div>
               <div className="text-sm text-gray-600">Em Andamento</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-red-600">
                 {propostasFiltradas.filter((p: Proposta) => p.status?.toLowerCase() === 'vencida').length}
               </div>
               <div className="text-sm text-gray-600">Vencidas</div>
             </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prefeitura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eixo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Órgão Gestor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {propostasPaginadas.map((proposta: Proposta) => (
                  <tr key={proposta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{proposta.titulo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{proposta.prefeituraId || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{proposta.plano || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{proposta.eixo || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{proposta.categoria || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{proposta.orgaoGestor || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(proposta.status)}`}>
                        {proposta.status || 'Não definido'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Itens por página:</span>
                <select
                  value={itensPorPagina}
                  onChange={(e) => {
                    setItensPorPagina(Number(e.target.value));
                    setPaginaAtual(1);
                  }}
                  className="select-with-arrow border border-gray-300 rounded-full px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="text-sm text-gray-700">
                Mostrando {inicio + 1} a {Math.min(fim, totalItens)} de {totalItens} resultados
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  const pagina = i + 1;
                  return (
                    <button
                      key={pagina}
                      onClick={() => setPaginaAtual(pagina)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-full ${
                        paginaAtual === pagina
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pagina}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}