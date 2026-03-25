import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { usePaginatedHero } from "./usePaginatedHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";


vi.mock('../actions/get-heroes-by-page.action', () => ({
    getHeroesByPageAction: vi.fn()
}))

const mockGetHeroesByPageAction = vi.mocked(getHeroesByPageAction);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});


const tanStackCustomProvider = () => {
    //este metodo se puede separar por si queremos reutilziarlo porque sino tendremos que armarlos siempre en los test necesarios


    return ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}

describe('usePaginatedHero', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    test('should return the initial state ( isLoading)', () => {
        const { result } = renderHook(() => usePaginatedHero(1, 6), {
            wrapper: tanStackCustomProvider()
        });

        // console.log(result.current);

        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.isError).toBe(false);
        expect(result.current.data).toBe(undefined);
        expect(result.current.data).toBeUndefined();
    });


    test('should return success state with data when API call succeeds', async () => {


        const mockHeroesData = {
            total: 20,
            pages: 4,
            heroes: [],
        };

        mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData);

        // PRIMERO SIEMPRE HACER LOS MOCK Y LUEGO LA LLAMADA

        const { result } = renderHook(() => usePaginatedHero(1, 6), {
            wrapper: tanStackCustomProvider()
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        })

        // console.log(result.current);
        expect(result.current.status).toBe('success');
        expect(mockGetHeroesByPageAction).toHaveBeenCalled();
        expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, 'all');
    });

})