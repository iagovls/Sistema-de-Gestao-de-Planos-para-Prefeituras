import { FaPlus } from "react-icons/fa6";


export default function BotaoIncluir(props: any) {

    return (
        <button className="bg-verde hover:cursor-pointer hover:scale-105 transition-transform text-white text-sm rounded-full px-3 py-1 text-center w-auto flex items-center gap-1">
            <FaPlus
                size={16}
                color="white"
            />
            Criar novo <strong>{props.titulo}</strong>

        </button>
    )
}