import useSWR from "swr";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());
async function fetcher(url:string) {

  const token = localStorage.getItem("token");  
  const headers: HeadersInit = {}; 
  if(token){
    headers.Authorization = `Bearer ${token}`;
  }
  // validateToken(headers);

  const res = await fetch(url, { headers });
  return res.json();
}

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

export function useHistoricoProposta(propostaId?: number) {
  const shouldFetch = propostaId !== undefined;
  const { data, error } = useSWR(
    shouldFetch ? `http://localhost:8080/propostas/historico/${propostaId}` : null,
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




