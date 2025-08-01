import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePropostas(prefeituraId?: number) {
  const shouldFetch = prefeituraId !== undefined;
  const { data, error } = useSWR(
    shouldFetch ? `http://localhost:8080/propostas/por-prefeitura?prefeituraId=${prefeituraId}` : null,
    fetcher
  );

  return {
    propostas: data,
    isLoading: !data && !error,
    isError: !!error,
  };
}

// Hook para buscar todas as propostas sem filtro
export function useTodasPropostas() {
  const { data, error } = useSWR("http://localhost:8080/propostas/todas", fetcher);

  return {
    propostas: data,
    isLoading: !data && !error,
    isError: !!error,
  };
}

export function usePrefeituras() {
  const { data, error } = useSWR("http://localhost:8080/prefeituras", fetcher);

  return {
    prefeituras: data,
    isLoading: !data && !error,
    isError: !!error,
    error: error
    
  };
}
