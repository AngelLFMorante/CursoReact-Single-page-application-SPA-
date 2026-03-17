import { useParams } from "react-router"


// hay que poner los parametros lo mismo que en el router :idSlug
export const HeroPage = () => {
    const { idSlug = '' } = useParams();

    return (
        <div>HeroPage</div>
    )
}
