import { useQuery } from "@tanstack/react-query";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";


export const usePaginatedHero = (page: number, limit: number, category: string = 'all') => {

    return useQuery({
        queryKey: ['heroes', { page, limit, category }], //esto lo almacena en la caché 
        queryFn: () => getHeroesByPageAction(+page, +limit, category),
        staleTime: 1000 * 60 * 5, // por 5 minutos mantenemos fresca y no va hacer peticion de nuevo..
    });

}
