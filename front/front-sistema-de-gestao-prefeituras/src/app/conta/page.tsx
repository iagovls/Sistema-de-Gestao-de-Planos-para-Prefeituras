"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface AuthStatusResponse {
    authenticated: boolean;
    user?: {
        completeName: string;  // ou nomeCompleto, dependendo do backend
        email: string;
    };
}

export default function Conta() {
    const [user, setUser] = useState<{ nomeCompleto: string; email: string } | null>(null);
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
            <div className="md:w-96 gap-2 flex flex-col text-start bg-white rounded-2xl shadow-sm w-10/12 h-auto p-10">
                <h1 className="text-2xl font-bold mb-4 text-center">Minha Conta</h1>

                {erro && <div className="text-red-600">{erro}</div>}

                {!user && !erro && <div>Carregando...</div>}

                {user && (
                    <>
                        <div>{user.nomeCompleto}</div>
                        <div>{user.email}</div>
                        <Link href="/alterar-senha" className="cursor-pointer">
                            <button
                                type="submit"
                                className="mt-2 text-white bg-verde w-auto px-4 h-10 rounded-2xl font-semibold cursor-pointer shadow-2xl self-start"
                            >
                                Alterar senha
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}
