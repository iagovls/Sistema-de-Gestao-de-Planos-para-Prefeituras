"use client"

import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
    const [firstName, setFirstName] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Busca o nome do usuário na API
            fetch("http://localhost:8080/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.completeName) {
                        setFirstName(data.completeName.split(" ")[0]);
                    } else {
                        setFirstName(null);
                    }
                })
                .catch(() => setFirstName(null));
        } else {
            setFirstName(null);
        }
    }, []);

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setFirstName(null);
        setDropdownOpen(false);
        router.push("/login");
    };

    return (
        <div className="w-full h-auto flex justify-between p-3 text-white">
            <Link href={"/"}>
                <button className="bg-azulclaro w-24 h-10 rounded-2xl font-semibold cursor-pointer shadow-sm">Início</button>
            </Link>
            {firstName ? (
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="bg-azulclaro w-32 h-10 rounded-2xl font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2"
                        onClick={() => setDropdownOpen((open) => !open)}
                    >
                        <span>{firstName}</span>
                        <IoIosArrowDown />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg z-10">
                            <Link
                                href={"/conta"}
                                className="w-full px-10 py-2 hover:font-bold cursor-pointer"    
                                onClick={() => setDropdownOpen((open) => !open)}                            
                            >
                                Conta
                            </Link>
                            <button
                                className="w-full px-4 py-2 hover:font-bold cursor-pointer"
                                onClick={handleLogout}
                            >
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <Link href={"/login"}>
                    <button className="bg-azulclaro w-24 h-10 rounded-2xl font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2">
                        <h1>Entrar</h1>
                    </button>
                </Link>
            )}
        </div>
    );
}