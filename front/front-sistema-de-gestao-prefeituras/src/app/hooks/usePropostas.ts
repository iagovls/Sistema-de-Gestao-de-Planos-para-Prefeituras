import useSWR from "swr";
import fetcher from "../utils/fetcher";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());


export function usePropostas(prefeituraId?: number) {
  const shouldFetch = prefeituraId !== undefined;
  const { data, error } = useSWR(
    shouldFetch ? `${process.env.NEXT_PUBLIC_API_URL}/propostas/por-prefeitura?prefeituraId=${prefeituraId}` : null,
    fetcher
  );
  
    return {
    propostas: data,
    isLoading: !data && !error,
    isError: !!error,
  };

}

export function useHistoricoProposta(propostaId?: number) {
  const shouldFetch = propostaId !== undefined;
  const { data, error } = useSWR(
    shouldFetch ? `${process.env.NEXT_PUBLIC_API_URL}/propostas/historico/${propostaId}` : null,
    fetcher
  );
  return {
    propostasSnapshots: data,
    isLoading: !data && !error,
    isError: !!error,
  }
}

// Hook para buscar todas as propostas sem filtro
export function useTodasPropostas() {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/propostas/todas`, fetcher);

  return {
    propostas: data,
    isLoading: !data && !error,
    isError: !!error,
  };
}

export function usePrefeituras() {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/prefeituras`, fetcher);
  return {
    prefeituras: data,
    isLoading: !data && !error,
    isError: !!error,
    error: error
    
  };
}




