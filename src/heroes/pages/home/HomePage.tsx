import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomJumbotron } from "@/components/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats"
import { HeroGrid } from "@/heroes/components/HeroGrid"
import { useState } from "react"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs"

export const HomePage = () => {

    const [activeTab, setactiveTab] = useState<
        'all' |
        'favorites' |
        'heroes' |
        'villains'
    >('all')



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
                <Tabs value={activeTab} className="mb-8">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all" onClick={() => setactiveTab('all')}>All Characters (16)</TabsTrigger>
                        <TabsTrigger value="favorites" className="flex items-center gap-2" onClick={() => setactiveTab('favorites')}>
                            Favorites (3)
                        </TabsTrigger>
                        <TabsTrigger value="heroes" onClick={() => setactiveTab('heroes')}>Heroes (12)</TabsTrigger>
                        <TabsTrigger value="villains" onClick={() => setactiveTab('villains')}>Villains (2)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        {/* Muestra todos los personajes Character Grid */}
                        < HeroGrid />
                    </TabsContent>
                    <TabsContent value="favorites">
                        {/* Muestra todos los favoritos */}
                        <h1>Favoritos</h1>
                    </TabsContent>
                    <TabsContent value="heroes">
                        {/* Muestra todos los heroes */}
                        <h1>Heroes</h1>
                    </TabsContent>
                    <TabsContent value="villains">
                        {/* Muestra todos los villanos */}
                        <h1>Villanos</h1>
                    </TabsContent>
                </Tabs >

                {/* Character Grid */}
                {/* < HeroGrid /> */}

                {/* Pagination */}
                <CustomPagination totalPages={8} />
            </>
        </>
    )
}