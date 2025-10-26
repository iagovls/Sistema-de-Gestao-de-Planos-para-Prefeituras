"use client";

import BotaoComun from "@/app/components/botoes/botaoComun";
import Title from "@/app/components/title";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import axios from "axios";

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validações antes de enviar
    setError("");
    setLoading(true);
    
    if (!token) {
      alert("Token inválido ou ausente.");
      setLoading(false);
      return;
    }

    const cleanPassword = password.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    if (cleanPassword !== cleanConfirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          token,
          password: cleanPassword,
          confirmPassword: cleanConfirmPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        alert("Senha resetada com sucesso!");
        router.push("/conta/login");
      }
    } catch (err: unknown) {
      console.error("Erro ao resetar senha:", err);
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as any;
        const message =
          (data && (data.message || data.error || data.detail)) ||
          (Array.isArray(data?.errors) && data.errors[0]?.message) ||
          err.message ||
          "Erro ao resetar senha.";
        setError(message);
      } else {
        setError("Erro ao resetar senha.");
      }
    } finally {
      setLoading(false);
    }
    
  };
    
  
  return (
    <main className="flex flex-col justify-center items-center w-full gap-10">
      <Title titulo={"Criar nova senha"} />
      {error && (
        <p className="text-red-500" role="alert" aria-live="polite">
          {error}
        </p>
      )}
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
