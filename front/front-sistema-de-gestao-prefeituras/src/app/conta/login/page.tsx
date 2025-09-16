"use client"


import Link from "next/link";
import { useState } from "react"; // Adicione o useEffect aqui
import DOMPurify from "dompurify";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Use DOMPurify to sanitize email and password before sending
        const cleanEmail = DOMPurify.sanitize(email);
        const cleanPassword = DOMPurify.sanitize(password);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token); 
                
                window.location.href = "/"; 
            } else {
                alert("Login failed. Please check your credentials.");
                console.error("Login error:", response.status);
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login.");
        }
    };

    return (
        <main className="flex flex-col justify-center items-center w-full gap-5">
          
            <div className="md:w-96 text-center bg-white rounded-2xl shadow-sm w-10/12 h-auto p-10">
                <h1 className="pb-10">Acesso apenas para <strong className="text-verde">administradores</strong></h1>
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
                    <h1 className="text-start font-semibold">Senha</h1>
                    <input
                        id="password"
                        placeholder="Digite sua senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
                        required
                    />
                    <Link
                        href={"/conta/redefinicao-senha"}
                        className="text-verde font-bold text-end hover:text-green-700"

                    >
                        <h1>Esqueci a senha</h1>
                    </Link>
                    <button
                        type="submit"
                        className="mt-5 text-white bg-verde w-24 h-10 rounded-2xl font-semibold cursor-pointer shadow-2xl self-center"
                    >
                        {"Entrar"} 
                    </button>
                </form>                
            </div>
        </main>
    );
}