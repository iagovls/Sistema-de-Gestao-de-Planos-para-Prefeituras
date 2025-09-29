"use client";

import BotaoComun from "@/app/components/botoes/botaoComun";
import Title from "@/app/components/title";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EsqueciSenha() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/send-reset-password-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
          credentials: "include",
          mode: "cors"
        }
      );
      if (response.ok) {
        router.push("/conta/login");
      }
    } catch (error) {
      console.error("Erro ao enviar email de redefinição de senha:", error);
      alert("Erro ao enviar email de redefinição de senha. Tente novamente.");
    }
  };
    
  return (
    <main className="flex flex-col justify-center items-center w-full gap-10">
      <Title titulo={"Redefinição de senha"} />
      <div className="md:w-96 flex flex-col gap-3 text-center bg-white rounded-2xl shadow-sm w-10/12 h-auto py-5 px-10">
        <h1>
          Insira seu endereço de e-mail e enviaremos para você, um link para
          redefinir sua senha.
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col mb-5">
          <h1 className="text-start font-semibold">E-mail</h1>
          <input
            id="email"
            name="email"
            placeholder="Digite seu e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
            required
            maxLength={30}
          />          
          <BotaoComun
            titulo={"Enviar link"}
            type="submit"
          />
        </form>
      </div>
    </main>
  );
}
