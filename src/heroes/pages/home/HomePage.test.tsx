import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { HomePage } from "./HomePage";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroProvider } from "@/heroes/context/FAvoriteHeroContext";


vi.mock('@/heroes/hooks/usePaginatedHero')

const mockUsePaginatednHero = vi.mocked(usePaginatedHero);

mockUsePaginatednHero.mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
    isSuccess: false
} as unknown as ReturnType<typeof mockUsePaginatednHero>);


const queryClient = new QueryClient();

const renderHomePage = (initialEntries: string[] = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <FavoriteHeroProvider>
                <QueryClientProvider client={queryClient}>
                    <HomePage />
                </QueryClientProvider>
            </FavoriteHeroProvider>
        </MemoryRouter>
    )

}


describe('HomePage', () => {

    //siempre que usemos mock siempre beforeEach
    beforeEach(() => {
        vi.clearAllMocks();
    })

    test('should render homepage with default values', () => {
        const { container } = renderHomePage();
        expect(container).toMatchSnapshot();

    })

    test('should call usePaginatedHero with deafult values', () => {
        renderHomePage();
        expect(mockUsePaginatednHero).toHaveBeenCalledWith(1, 6, 'all');

    })

    test('should call usePaginatedHero with custom queries params', () => {
        renderHomePage(['/?page=2&limit=10&category=villains']);
        expect(mockUsePaginatednHero).toHaveBeenCalledWith(2, 10, 'villains');

    })

    test('should call usePaginationHEro with default page and same limit on tab ', () => {
        renderHomePage(['/?tab=favorites&page=2&limit=10']);

        const [, , , villainsTab] = screen.getAllByRole('tab');

        fireEvent.click(villainsTab);

        expect(mockUsePaginatednHero).toHaveBeenCalledWith(1, 10, 'villain');

    })
})