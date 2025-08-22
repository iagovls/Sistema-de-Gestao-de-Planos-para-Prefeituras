export default function BotaoComun(props: any){
    return (
        <button className="hover:cursor-pointer transition-transform hover:scale-110 mt-2 text-white bg-verde w-auto py-1 px-4 h-auto rounded-2xl font-semibold cursor-pointer shadow-2xl self-start">

            {props.titulo}
        </button>
    )
}