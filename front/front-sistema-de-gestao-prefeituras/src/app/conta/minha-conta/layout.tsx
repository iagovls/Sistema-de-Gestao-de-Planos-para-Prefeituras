import React from "react";

export const metadata = {
    title: "Minha conta"
}

export default function MinhaContaLayout({ children }: { children: React.ReactNode }){
    return <div>{children}</div>
}