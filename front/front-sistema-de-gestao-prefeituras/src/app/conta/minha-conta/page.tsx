"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Title from "@/app/components/title";
import BotaoComun from "@/app/components/botoes/botaoComun";




export default function MinhaConta() {
    const [user, setUser] = useState<{ nomeCompleto: string; email: string; role: string } | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setErro("Token não encontrado");
                    return;
                }
                
                const res = await fetch("http://localhost:8080/auth/me", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                
                if (!res.ok) {
                    throw new Error("Falha ao buscar usuário: " + res.statusText);
                }

                const data = await res.json();
                console.log(data)
                

                // Ajuste para o campo retornado pelo backend (userName ou nomeCompleto)
                setUser({
                    nomeCompleto: data.completeName, // ou data.user.nomeCompleto
                    email: data.email,
                    role: data.role
                });

            } catch (error: any) {
                console.error("Erro ao buscar usuário:", error);
                setErro(error.message);
            }
        };

        fetchUser();
    }, []);

    return (
        <main className="flex flex-col items-center gap-10">
            
            <Title titulo={"Minha conta"}/>
            <div className="md:w-96 gap-2 flex flex-col text-start bg-white rounded-2xl shadow-sm w-10/12 h-auto p-5">

                {erro && <div className="text-red-600">{erro}</div>}

                {!user && !erro && <div>Carregando...</div>}

                {user && (
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-3">
                            <div>{user.nomeCompleto}</div>
                            {user.role === "MASTER" ? <div className="bg-verde text-white text-xs rounded-full font-bold px-3 pt-1 text-center w-auto">Usuário administrador</div> : ""}
                        </div>
                        <div>{user.email}</div>
                        <div className="flex flex-col items-center">
                            <Link href="/conta/redefinicao-senha" className="cursor-pointer">
                                <BotaoComun titulo="Alterar senha"/>
                            </Link>
                            {user.role === "ADMIN" ? (
                            <Link href="/conta/gerenciar-usuarios" className="cursor-pointer">
                                <BotaoComun titulo="Gerenciar usuários"/>   
                            </Link>
                            ) : ""}
                        </div>  
                    </div>
                )}
            </div>
        </main>
    );
}
