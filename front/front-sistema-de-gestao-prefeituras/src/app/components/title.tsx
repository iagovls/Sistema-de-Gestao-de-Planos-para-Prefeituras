interface TitleProps {
    titulo: string;
}

export default function Title(props: TitleProps) {
    return (
        <h1 className="font-bold text-3xl mb-4 mt-6">{props.titulo}</h1>
    )
}