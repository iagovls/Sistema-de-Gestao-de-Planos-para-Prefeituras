"use client"


import { useState, useEffect } from "react"; // Adicione o useEffect aqui
import { useRouter } from "next/navigation";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState(""); // Adicione este estado
    const router = useRouter();

    // Adicione este useEffect
    useEffect(() => {
        const name = localStorage.getItem("firstName");
        if (name) setFirstName(name);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("firstName", data.firstName);
                window.location.href = "/"; 
            } else {
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login.");
        }
    };

    return (
        <main className="flex flex-col justify-center items-center w-full gap-5 mt-10">
          
            <div className="md:w-96 text-center bg-white rounded-2xl shadow-sm w-10/12 h-auto p-10">
                <h1 className="pb-10">Acesso apenas para <strong className="text-verde">administradores</strong></h1>
                <form onSubmit={handleSubmit} className="flex flex-col mb-5">
                    <h1 className="text-start font-semibold">E-mail</h1>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 mb-3 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
                    />
                    <h1 className="text-start font-semibold">Senha</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="placeholder:italic placeholder:text-slate-400 border border-slate-300 rounded-md h-10 px-2 focus:outline-none focus:border-verde focus:ring-verde focus:ring-1"
                    />
                    <button
                        type="submit"
                        className="mt-5 text-white bg-verde w-24 h-10 rounded-2xl font-semibold cursor-pointer shadow-2xl self-center"
                    >
                        {"Entrar"} {/* Modifique esta linha */}
                    </button>
                </form>                
            </div>
        </main>
    );
}