import { describe, expect, test, vi } from "vitest";
import { appRouter } from "./app.router";
import { createMemoryRouter, Outlet, RouterProvider, useParams } from "react-router";
import { render, screen } from "@testing-library/react";

vi.mock('@/heroes/layouts/HeroesLayout', () => ({
    HeroesLayout: () => (
        <div data-testid="heroes-layout">
            <Outlet />
        </div>
    )
}));

vi.mock('@/heroes/pages/home/HomePage', () => ({
    HomePage: () => <div data-testid="home-page"></div>,
}));

vi.mock('@/heroes/pages/hero/HeroPage', () => ({
    HeroPage: () => {
        const { idSlug = '' } = useParams();

        return (
            <div data-testid="hero-page">
                HeroPage -{idSlug}
            </div>
        )
    }
}))


vi.mock('@/heroes/pages/search/SearchPage', () => ({
    default: () => <div data-testid="search-page"></div>
}))

describe('appRouter', () => {

    test('should be configured as expected', () => {
        console.log(appRouter.routes);

        expect(appRouter.routes).toMatchSnapshot(); //una preuba rapida y facil para ver si esta todo correcto.
    });


    test('should render home page at root path', () => {
        const router = createMemoryRouter(appRouter.routes, {
            //objeto de configuracion
            initialEntries: ['/']
        })
        render(<RouterProvider router={router} />);

        // screen.debug();
    })

    test('should render hero page at /heroes/:idSlug path', () => {
        const router = createMemoryRouter(appRouter.routes, {
            //objeto de configuracion
            initialEntries: ['/heroes/superman']
        })
        render(<RouterProvider router={router} />);

        // screen.debug();
        expect(screen.getByTestId('hero-page').innerHTML).toContain('superman');

    })


    test('should render search page at /search path', async () => {
        const router = createMemoryRouter(appRouter.routes, {
            //objeto de configuracion
            initialEntries: ['/search']
        })
        render(<RouterProvider router={router} />);


        //sencillo cuando tenemos un lazy 
        // expect(await screen.findByText('Busqueda de SuperHerores')).toBeDefined();
        expect(await screen.findByTestId('search-page')).toBeDefined();

        // screen.debug();
    })

    test('should redirect to home page for unknown routes', () => {
        const router = createMemoryRouter(appRouter.routes, {
            //objeto de configuracion
            initialEntries: ['/otra-pagina-rara']
        })
        render(<RouterProvider router={router} />);

        screen.debug();
        expect(screen.getByTestId('home-page')).toBeDefined();
    })
})