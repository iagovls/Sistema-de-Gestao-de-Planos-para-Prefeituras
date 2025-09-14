"use client";

import BotaoComun from "@/app/components/botoes/botaoComun";
import PopUpConfirmation from "@/app/components/popupConfirmation";
import Title from "@/app/components/title";
import { useState } from "react";

export default function CriarUsuario(){

    const [nomeCompleto, setNomeCompleto] = useState("");
    const [email, setEmail] = useState("");

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleConfirmation = () => {
        setShowConfirmation(true);
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Token não encontrado");
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({userName: nomeCompleto, email }),
            });

            if (response.ok) {
                alert("Usuário criado com sucesso!");
                window.location.href = "/conta/gerenciar-usuarios";
            } else {
                const error = await response.json();
                alert(error.error || "Erro ao criar usuário.");
            }
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            alert("Ocorreu um erro ao criar o usuário.");
        }
        setShowConfirmation(false);
    };


    return (
        <main className="flex flex-col items-center ">
            <Title titulo={"Criar usuário"} />
            <div className="md:w-96 text-center bg-white rounded-2xl shadow-sm w-10/12 h-auto p-10 pb-5">
                <form method="post" onSubmit={e => { e.preventDefault(); handleConfirmation(); }}>
                    {/* Nome completo e email apenas */}
                    <label htmlFor="nomeCompleto" className="block text-left mb-1">Nome</label>
                    <input
                        id="nomeCompleto"
                        type="text"
                        name="nomeCompleto"
                        value={nomeCompleto}
                        onChange={e => setNomeCompleto(e.target.value)}
                        placeholder="Digite o nome completo"
                        className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 w-full mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
                        required
                    />
                    <label htmlFor="email" className="block text-left mb-1">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Digite o email"
                        className="placeholder:italic placeholder:text-slate-400 w-full border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
                        required
                    />
                    <button type="submit">
                        <BotaoComun titulo="Criar usuário" />
                        {}
                    </button>
                </form>
                {showConfirmation && (
                    <PopUpConfirmation
                        message="Você tem certeza que deseja criar este usuário?"
                        onConfirm={handleSubmit}
                        onCancel={() => setShowConfirmation(false)}
                    />
                )}
                <p
                    className="text-xs text-gray-500 mt-3"
                >
                    Novos usuários recebem uma senha aleatória por e-mail. Uma redefinição de senha será solicitada no primeiro acesso.
                </p>
            </div>
        </main>
    )
}