"use client"

import Image from "next/image"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { usePrefeituras } from "../hooks/usePropostas";


export default function PrefeituraTitle() {

    interface Prefeitura {
        id: number;
        name: string;
        logoPrefeitura: string;
        logoCMDCA: string;
    }

    
    const prefeituraName = useSearchParams().get("prefeituraName");
    const prefeituraId = Number(useSearchParams().get("prefeituraId"));
    const {prefeituras, isLoading, isError, error} = usePrefeituras();
    const prefeitura = prefeituras?.find((p: any) => p.id === prefeituraId);

    if(false){
      return (
        <div>

        </div>
      )
    }

    return (

        <div className="grid grid-cols-2 gap-2 justify-center text-center">
            <h1 className="col-span-2 text-center text-4xl text-black">
                Prefeitura de <strong>{prefeituraName}</strong>
            </h1>
            <Image
                src={prefeitura?.logoPrefeitura || "/noImage.png"}
                alt={`Logo Prefeitura Municipal de ${prefeituraName}`}
                width={100}
                height={100}
                className="justify-self-end"
            />
            <Image
                src={prefeitura?.logoCMDCA || "/noImage.png"}
                alt={`Logo CMDCA ${prefeituraName}`}
                width={100}
                height={100}
                className="justify-self-start"
            />
        </div>
    )
}
