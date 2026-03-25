import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomJumbotron } from "@/components/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats"
import { HeroGrid } from "@/heroes/components/HeroGrid"
import { use, useMemo } from "react"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs"
import { useSearchParams } from "react-router"
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary"
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero"
import { FavoriteHeroContext } from "@/heroes/context/FAvoriteHeroContext"


export const HomePage = () => {

    //para tener parametros en la url
    const [searchParams, setSearchParams] = useSearchParams();

    //favorites 
    const { favoriteCount, favorites } = use(FavoriteHeroContext)

    const activeTab = searchParams.get('tab') ?? 'all';
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '6';
    const category = searchParams.get('category') ?? 'all';
    //con el memo ya podemos validar y asi no rompemos los params si alguien intenta manipularlo.
    const selectedTab = useMemo(() => {
        const validTabs = ['all', 'favorites', 'heroes', 'villains'];
        return validTabs.includes(activeTab) ? activeTab : 'all';
    }, [activeTab])

    // Se comenta para usar el useSearchParams
    // const [activeTab, setactiveTab] = useState<
    //     'all' |
    //     'favorites' |
    //     'heroes' |
    //     'villains'
    // >('all');

    //  con tanstack no hace falta que usemos el useEffect es de lo mejor
    // queryFn es lo que queremos lanzar a peticion
    //lo llevamos a un hook : usePaginatedHero
    // const { data: heroesResponse } = useQuery({
    //     queryKey: ['heroes', { page, limit }], //esto lo almacena en la caché 
    //     queryFn: () => getHeroesByPageAction(+page, +limit),
    //     staleTime: 1000 * 60 * 5, // por 5 minutos mantenemos fresca y no va hacer peticion de nuevo..
    // });

    const { data: heroesResponse } = usePaginatedHero(+page, +limit, category);

    const { data: summary } = useHeroSummary();

    return (
        <>
            <>
                {/* Header */}
                <CustomJumbotron
                    title="Universo de SuperHéroes"
                    description="Descubre, explora y administra super héroes y villanos"
                />

                <CustomBreadcrumbs currentPage="Super Heroes" />

                {/* Stats Dashboard */}
                <HeroStats />

                {/* Controls */}


                {/* Advanced Filters */}


                {/* Tabs */}
                <Tabs value={selectedTab} className="mb-8">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all"
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'all');
                                prev.set('category', 'all');
                                prev.set('page', '1');
                                return prev;
                            })}
                        >
                            All Characters ({summary?.totalHeroes})
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="flex items-center gap-2"
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'favorites');
                                return prev;
                            })}
                        >
                            Favorites ({favoriteCount})
                        </TabsTrigger>
                        <TabsTrigger value="heroes"
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'heroes');
                                prev.set('category', 'hero');
                                prev.set('page', '1');
                                return prev;
                            })}
                        >
                            Heroes ({summary?.heroCount})</TabsTrigger>
                        <TabsTrigger value="villains"
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'villains');
                                prev.set('category', 'villain');
                                prev.set('page', '1');
                                return prev;
                            })}
                        >
                            Villains ({summary?.villainCount})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        {/* Muestra todos los personajes Character Grid */}
                        < HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                    <TabsContent value="favorites">
                        {/* Muestra todos los favoritos */}
                        < HeroGrid heroes={favorites} />
                    </TabsContent>
                    <TabsContent value="heroes">
                        {/* Muestra todos los heroes */}
                        <h1>Heroes</h1>
                        < HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                    <TabsContent value="villains">
                        {/* Muestra todos los villanos */}
                        <h1>Villanos</h1>
                        < HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                </Tabs >

                {/* Character Grid */}
                {/* < HeroGrid /> */}

                {/* Pagination */}
                {
                    selectedTab !== 'favorites' && (
                        <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
                    )
                }

            </>
        </>
    )
}