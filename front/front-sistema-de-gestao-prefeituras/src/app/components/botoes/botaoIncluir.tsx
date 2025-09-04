"use client";

import { FaPlus } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";

export default function BotaoIncluir({
    titulo,
    onClick,
}: {
    titulo: string;
    onClick: () => void;
}) {
    const searchParams = useSearchParams();
    const prefeituraId = Number(searchParams.get("prefeituraId"));

    const getUserPrefeituraIdFromToken = (): number | undefined => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return undefined;

        // Try JSON token structure first
        try {
            const parsed = JSON.parse(token);
            const id = parsed?.userPrefeituraId ?? parsed?.prefeituraId ?? parsed?.prefeituraID;
            return id !== undefined ? Number(id) : undefined;
        } catch {
            // Fallback: try decode as JWT
            try {
                const parts = token.split(".");
                if (parts.length < 2) return undefined;
                const base64Url = parts[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split("")
                        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                        .join("")
                );
                const payload = JSON.parse(jsonPayload);
                const id = payload?.userPrefeituraId ?? payload?.prefeituraId ?? payload?.prefeituraID;
                return id !== undefined ? Number(id) : undefined;
            } catch {
                return undefined;
            }
        }
    };

    const userPrefeituraId = getUserPrefeituraIdFromToken();

    const canShow = Number.isFinite(prefeituraId) && Number.isFinite(userPrefeituraId) && prefeituraId === userPrefeituraId;

    return (
        <div className="">
            {canShow ? (
                <button
                    className="bg-verde hover:cursor-pointer hover:scale-105 transition-transform text-white text-sm rounded-full px-3 py-1 text-center w-auto flex items-center gap-1"
                    onClick={onClick}
                >
                    <FaPlus size={16} color="white" />
                    Criar <strong>{titulo}</strong>
                </button>
            ) : null}
        </div>
    );
}