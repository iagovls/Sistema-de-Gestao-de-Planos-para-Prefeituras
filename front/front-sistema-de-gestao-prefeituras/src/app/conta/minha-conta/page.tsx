"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Title from "@/app/components/title";
import BotaoComun from "@/app/components/botoes/botaoComun";
import { Erro } from "@/app/types/proposta";



export default function MinhaConta() {
    const [user, setUser] = useState<{ nomeCompleto: string; email: string; role: string; prefeituraId: number } | null>(null);
    const [erro, setErro] = useState<Erro | null>(null);

    useEffect(() => {
        
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setErro({ message: "Token não encontrado" });
                    return;
                }
                
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                
                if (!res.ok) {
                    throw new Error("Falha ao buscar usuário: " + res.statusText);
                }

                const data = await res.json();
                

                // Ajuste para o campo retornado pelo backend (userName ou nomeCompleto)
                setUser({
                    nomeCompleto: data.completeName, // ou data.user.nomeCompleto
                    email: data.email,
                    role: data.role,
                    prefeituraId: data.prefeituraId || null,
                });

            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Erro desconhecido ao buscar usuário";
                setErro({ message });
            }
        };

        fetchUser();
    }, []);

    return (
        <main className="flex flex-col items-center gap-10">
            
            <Title titulo={"Minha conta"}/>
            <div className="md:w-auto gap-2 flex flex-col text-start bg-white rounded-2xl shadow-sm w-10/12 h-auto p-5">

                {erro && <div className="text-red-600">{erro.message}</div>}

                {!user && !erro && <div>Carregando...</div>}

                {user && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-3 justify-center items-center flex-nowrap">
                            <div className="w-auto whitespace-nowrap">{user.nomeCompleto}</div>
                            {user.role === "ADMIN" ? <div className="bg-verde text-white text-xs rounded-full font-bold px-3 py-1 text-center whitespace-nowrap w-auto">Usuário administrador</div> : ""}
                        </div>
                        <div>{user.email}</div>
                        <div className="flex flex-col gap-2 items-center">
                            <Link href="/conta/redefinicao-senha" className="cursor-pointer">
                                <BotaoComun titulo="Alterar senha"/>
                            </Link>
                            {user.role === "ADMIN" && (
                                <Link href={`/conta/gerenciar-usuarios?prefeituraId=${user.prefeituraId}`} className="cursor-pointer">
                                    <BotaoComun titulo="Gerenciar usuários"/>   
                                </Link>
                            )}
                        </div>  
                    </div>
                )}
            </div>
        </main>
    );
}
