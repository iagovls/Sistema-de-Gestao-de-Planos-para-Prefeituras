"use client";

import Title from "@/app/components/title";
import { useState } from "react";

export default function EsqueciSenha() {
    
  const [email, setEmail] = useState("");
  const handleSubmit = () => {};
  return (
    <main className="flex flex-col justify-center items-center w-full gap-10">
      <Title titulo={"Redefinição de senha"} />
      <div className="md:w-96 flex flex-col gap-3 text-center bg-white rounded-2xl shadow-sm w-10/12 h-auto py-5 px-10">
        <h1>
          Insira seu endereço de e-mail e enviaremos para você um link para
          redefinir sua senha.
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col mb-5">
          <h1 className="text-start font-semibold">E-mail</h1>
          <input
            id="email"
            placeholder="Digite seu e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
            required
            maxLength={30}
          />

          <button
            type="submit"
            className="mt-5 text-white bg-verde w-auto px-4 h-10 rounded-2xl font-semibold cursor-pointer shadow-2xl self-center"
          >
            {"Redefinir a senha"}
          </button>
        </form>
      </div>
    </main>
  );
}
