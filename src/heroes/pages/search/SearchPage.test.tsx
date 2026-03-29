import { beforeEach, describe, expect, test, vi } from "vitest";
import SearchPage from "./SearchPage";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { searchHeroesAction } from "@/heroes/actions/search-heros.action";
import type { Hero } from "@/heroes/types/hero.interface";


vi.mock('@/heroes/actions/search-heros.action');

const mockSearchgHeroesAction = vi.mocked(searchHeroesAction);


vi.mock('@/components/custom/CustomJumbotron', () => ({
    CustomJumbotron: () => <div data-testid="custom-jumbotron"></div>
}))


vi.mock('./ui/SearchControls', () => ({
    SearchControls: () => <div data-testid="search-controls"></div>
}))

vi.mock('@/heroes/components/HeroGrid', () => ({
    HeroGrid: ({ heroes }: { heroes: Hero[] }) => (
        <div data-testid="hero-grid">
            {
                heroes.map(hero => (
                    <div key={hero.id}>
                        {hero.name}
                    </div>
                ))
            }
        </div>)
}))

const queryClient = new QueryClient();


const renderSearchPage = (initialEntries: string[] = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            {/* <FavoriteHeroProvider> */}
            <QueryClientProvider client={queryClient}>
                <SearchPage />
            </QueryClientProvider>
            {/* </FavoriteHeroProvider> */}
        </MemoryRouter>
    )

}



describe('SearchPage', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    })

    test('shludl render SearchPage with default values', () => {
        const { container } = renderSearchPage();

        expect(mockSearchgHeroesAction).toHaveBeenCalledWith({
            name: undefined,
            strength: undefined
        })

        expect(container).toMatchSnapshot();
    })

    test('should call search action with name parameter', () => {
        const { container } = renderSearchPage(['/search?name=superman']);

        expect(mockSearchgHeroesAction).toHaveBeenCalledWith({
            name: 'superman',
            strength: undefined
        })

        expect(container).toMatchSnapshot();
    })

    test('should call search action with strength parameter', () => {
        const { container } = renderSearchPage(['/search?strength=6']);

        expect(mockSearchgHeroesAction).toHaveBeenCalledWith({
            name: undefined,
            strength: '6'
        })

        expect(container).toMatchSnapshot();
    })

    test('should call search action with strength and name parameter', () => {
        const { container } = renderSearchPage(['/search?strength=8&name=batman']);

        expect(mockSearchgHeroesAction).toHaveBeenCalledWith({
            name: 'batman',
            strength: '8'
        })

        expect(container).toMatchSnapshot();
    })


    test('should render HeroGRid with search results', async () => {

        const mockHeroes = [
            {
                id: '1',
                name: 'Clark Kent'
            } as unknown as Hero,
            {
                id: '2',
                name: 'Bruce Wayne'
            } as unknown as Hero,
        ]

        mockSearchgHeroesAction.mockResolvedValue(mockHeroes);

        renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText('Clark Kent')).toBeDefined();
            expect(screen.getByText('Bruce Wayne')).toBeDefined();
        })
    })
})