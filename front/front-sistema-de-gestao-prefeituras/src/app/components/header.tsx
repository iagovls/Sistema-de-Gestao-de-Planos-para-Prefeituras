"use client"

import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
    const [firstNome, setFirstNome] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        // console.log("localStorage: ", localStorage)
        

        
        // Busca o nome do usuário na API
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {                               
                return res.json();
            })
            .then((data) => {
                console.log(data);
                if (data && data.completeName) {
                    setFirstNome(data.completeName.split(" ")[0]);
                } else if(data.status == 500) {   
                    localStorage.removeItem("token");                 
                    setFirstNome(null);
                }
            })
            .catch(() => setFirstNome(null));
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
        setFirstNome(null);
        setDropdownOpen(false);
        router.push("/conta/login");
    };

    return (
        <div className="w-full h-auto flex justify-between p-3 text-white">
            <Link href={"/"} className="bg-azulclaro w-24 h-10 rounded-2xl font-semibold cursor-pointer shadow-sm flex items-center justify-center text-white">
                Início
            </Link>
            {firstNome ? (
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="bg-azulclaro w-32 h-10 rounded-2xl font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2"
                        onClick={() => setDropdownOpen((open) => !open)}
                    >
                        <span>{firstNome}</span>
                        <IoIosArrowDown />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg z-10">
                            <Link
                                href={"/conta/minha-conta"}
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
                <Link href={"/conta/login"} className="bg-azulclaro w-24 h-10 rounded-2xl font-semibold cursor-pointer shadow-sm flex items-center justify-center gap-2 text-white">
                    Entrar
                </Link>
            )}
        </div>
    );
}