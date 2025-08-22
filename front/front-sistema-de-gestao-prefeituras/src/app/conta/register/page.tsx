"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(password != confirmPassword){
                setMessage("As senhas não coincidem.");
                return;
        } else {
            setMessage("");
        } 
        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userName, email, password }),
            });

            
                
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("userName", data.userName);
                alert("Usuário registrado com sucesso!");
                router.push("/");
            } else {
                const error = await response.json();
                alert(error.error || "Erro ao registrar usuário.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("Ocorreu um erro durante o registro.");
        }
    };

    return (
        <main className="flex flex-col justify-center items-center w-full gap-5">
            
            <div className="md:w-96 text-center bg-white rounded-2xl shadow-sm w-10/12 h-auto p-10 pb-5">
                <h1 className="pb-10">Registrar novo <strong className="text-verde">Usuário</strong></h1>
                <form onSubmit={handleSubmit} className="flex flex-col mb-5">
                    <h1 className="text-red-500">{message}</h1>
                    <h1 className="text-start font-semibold">Nome</h1>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
                        required
                    />
                    <h1 className="text-start font-semibold">E-mail</h1>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
                        required
                    />
                    <h1 className="text-start font-semibold">Senha</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
                        required
                    />
                    <h1 className="text-start font-semibold">Confirmar senha</h1>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
                        required
                    />
                    <button
                        type="submit"
                        className="mt-5 text-white bg-verde w-32 h-10 rounded-2xl font-semibold cursor-pointer shadow-2xl self-center"
                        
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </main>
    );
} 