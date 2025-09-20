export default function BotaoComun(props: {
    type?: "button" | "submit" | "reset" | undefined;
    cor?: string;
    titulo: string;
    onClick?: () => void;
}){
    return (
        <button 
            type={props.type ? props.type : "button"} 
            onClick={props.onClick}
            className= {` ${props.cor ? props.cor : "bg-verde"} text-white text-center bg-verde w-auto px-4 py-6 h-10 rounded-2xl font-semibold cursor-pointer shadow-2xl self-center flex items-center justify-center gap-2`}
        >
            {props.titulo}
        </button>
    )
}
