"use client";

import BotaoComun from "@/app/components/botoes/botaoComun";
import Title from "@/app/components/title";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import DOMPurify from "dompurify";

export default function ResetarSenha() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetarSenhaContent />
    </Suspense>
  );
}

function ResetarSenhaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState("");


  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validações antes de enviar
    
    if (!token) {
      alert("Token inválido ou ausente.");
      return;
    }

    const cleanPassword = DOMPurify.sanitize(password);
    const cleanConfirmPassword = DOMPurify.sanitize(confirmPassword);

    if (cleanPassword !== cleanConfirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
        confirmPassword,
      }),
    });
    router.push("/conta/login");

    
     
    
  };
    
  
  return (
    <main className="flex flex-col justify-center items-center w-full gap-10">
      <Title titulo={"Criar nova senha"} />
      <div className="md:w-96 flex flex-col gap-3 text-center bg-white rounded-2xl shadow-sm w-10/12 h-auto py-5 px-10">
        <form onSubmit={handleSubmit} className="flex flex-col mb-5">
          <h1 className="text-start font-semibold">Nova senha</h1>
          <input
            id="password"
            name="password"
            placeholder="Digite sua nova senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
            required
            maxLength={30}
          />
          <h1 className="text-start font-semibold">Confirme sua nova senha</h1>
          <input
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirme sua nova senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
            required
            maxLength={30}
          />
          <BotaoComun
            titulo={"Criar nova senha"}
            type="submit"
          />
        </form>
      </div>
    </main>
  );
}
