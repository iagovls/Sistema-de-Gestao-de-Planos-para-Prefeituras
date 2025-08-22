"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AlterarSenha() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mensagem, setMensagem] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login"); // redireciona se não estiver logado
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMensagem("As senhas não coincidem.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setMensagem("Usuário não autenticado.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/auth/update-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
            });

            if (response.ok) {
                setMensagem("Senha alterada com sucesso!");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                const errorText = await response.text();
                setMensagem(errorText || "Erro ao alterar senha.");
            }
        } catch (error) {
            setMensagem("Erro ao conectar com o servidor.");
        }
    };

    return (
        <main className="flex flex-col items-center gap-10">
            <div className="md:w-96 gap-2 flex flex-col text-start bg-white rounded-2xl shadow-sm w-10/12 h-auto p-10 pb-5">
                <h1 className="text-2xl font-bold mb-4 text-center">Alterar senha</h1>
                {mensagem && <div className="text-center text-green-600 mb-2">{mensagem}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col mb-5">
                    <h1 className="text-start font-semibold">Senha atual</h1>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
                    />
                    <h1 className="text-start font-semibold">Nova senha</h1>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
                    />
                    <h1 className="text-start font-semibold">Confirme nova senha</h1>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
                    />
                    <button
                        type="submit"
                        className="mt-5 text-white bg-verde w-auto px-4 h-10 rounded-2xl font-semibold cursor-pointer shadow-2xl self-center"
                    >
                        Alterar senha
                    </button>
                </form>
            </div>
        </main>
    );
}
