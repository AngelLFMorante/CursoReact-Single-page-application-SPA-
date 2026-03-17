
import { AdminLayout } from "@/admin/layouts/AdminLayout";
import { AdminPage } from "@/admin/pages/AdminPage";
import { HeroesLayout } from "@/heroes/layouts/HeroesLayout";
import { HeroPage } from "@/heroes/pages/hero/HeroPage";
import { HomePage } from "@/heroes/pages/home/HomePage";
// import { SearchPage } from "@/heroes/pages/search/SearchPage";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";


// Lazy load 
// si sale error de promise podemos hacer un export defaul en la clase 
// Las lazy se hacen para paginas que no son muy necesarias o mas visitadas
const SearchPage = lazy(() => import('@/heroes/pages/search/SearchPage'))


export const appRouter = createBrowserRouter([
    // Para meter todo en el mismo layout
    {
        path: '/',
        element: <HeroesLayout />,
        // Cuando son rutas hijas no se pone el slash / porque ya esta dado por el padre
        children: [
            {
                // path: '', se puede poner asi tal cual pero se debe poner el index router
                index: true,
                element: <HomePage />
            },
            {
                path: 'heroes',
                element: <HeroPage />
            },
            {
                path: 'search',
                element: <SearchPage />
            },
        ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children:
            [
                {
                    index: true,
                    element: <AdminPage />
                }
            ]
    },
])