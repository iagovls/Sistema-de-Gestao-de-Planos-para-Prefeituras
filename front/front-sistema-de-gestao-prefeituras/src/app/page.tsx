

import Image from "next/image";
import { Title } from "./components/title";


export default function Home() {
  return (
    <div>
      <Title />
      <main className="w-full">
        <div className="max-w-max mx-auto grid grid-cols-3 gap-7 justify-center text-center mt-10">
          {data.map((d, index) => (
            <div
              key={index}
              className="w-auto p-8 h-auto gap-4 bg-white shadow-sm rounded-lg grid grid-cols-2 place-items-center hover:cursor-pointer"
              
            >
              <Image
                src={d.srcPM}
                alt={d.altPM}
                width={d.width}
                height={d.height}
                className=""
              >
              </Image>
              <Image
                src={d.srcCMDCA}
                alt={d.altCMDCA}
                width={d.width}
                height={d.height}
                className=""
              >
              </Image>
              <h1
                className="col-span-2 "
              >
                Prefeitura de <br />
                <strong className="text-lg">{d.h1}</strong>
              </h1>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


const data = [
  {

    srcPM: "/prefeituraPresidenteTancredoNevesLogo.jpg",
    srcCMDCA: "/cmdcaPresidenteTancredoNeves.jpg",
    altPM: "Logo Prefeitura Municipal de Presidente Tancredo Neves",
    altCMDCA: "Logo CMDCA Presidente Tancredo Neves",
    width: 100,
    height: 100,
    h1: "Presidente Tancredo Neves"
  },
  {
    srcPM: "/prefeituraPresidenteTancredoNevesLogo.jpg",
    srcCMDCA: "/cmdcaPresidenteTancredoNeves.jpg",
    altPM: "Logo Prefeitura Municipal de Presidente Tancredo Neves",
    altCMDCA: "Logo CMDCA Presidente Tancredo Neves",
    width: 100,
    height: 100,
    h1: "Ilhéus"
  },
  {
    srcPM: "/prefeituraPresidenteTancredoNevesLogo.jpg",
    srcCMDCA: "/cmdcaPresidenteTancredoNeves.jpg",
    altPM: "Logo Prefeitura Municipal de Presidente Tancredo Neves",
    altCMDCA: "Logo CMDCA Presidente Tancredo Neves",
    width: 100,
    height: 100,
    h1: "Presidente Tancredo Neves"
  },
  {
    srcPM: "/prefeituraPresidenteTancredoNevesLogo.jpg",
    srcCMDCA: "/cmdcaPresidenteTancredoNeves.jpg",
    altPM: "Logo Prefeitura Municipal de Presidente Tancredo Neves",
    altCMDCA: "Logo CMDCA Presidente Tancredo Neves",
    width: 100,
    height: 100,
    h1: "Presidente Tancredo Neves"
  },
  {
    srcPM: "/prefeituraPresidenteTancredoNevesLogo.jpg",
    srcCMDCA: "/cmdcaPresidenteTancredoNeves.jpg",
    altPM: "Logo Prefeitura Municipal de Presidente Tancredo Neves",
    altCMDCA: "Logo CMDCA Presidente Tancredo Neves",
    width: 100,
    height: 100,
    h1: "Presidente Tancredo Neves"
  },
  {
    srcPM: "/prefeituraPresidenteTancredoNevesLogo.jpg",
    srcCMDCA: "/cmdcaPresidenteTancredoNeves.jpg",
    altPM: "Logo Prefeitura Municipal de Presidente Tancredo Neves",
    altCMDCA: "Logo CMDCA Presidente Tancredo Neves",
    width: 100,
    height: 100,
    h1: "Presidente Tancredo Neves"
  },
  {
    srcPM: "/prefeituraPresidenteTancredoNevesLogo.jpg",
    srcCMDCA: "/cmdcaPresidenteTancredoNeves.jpg",
    altPM: "Logo Prefeitura Municipal de Presidente Tancredo Neves",
    altCMDCA: "Logo CMDCA Presidente Tancredo Neves",
    width: 100,
    height: 100,
    h1: "Presidente Tancredo Neves"
  },
]
