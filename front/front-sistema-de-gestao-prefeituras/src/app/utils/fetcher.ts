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

export default fetcher;