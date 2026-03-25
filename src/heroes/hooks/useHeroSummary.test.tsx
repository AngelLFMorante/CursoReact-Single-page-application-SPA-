import { describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from '@testing-library/react';
import { useHeroSummary } from "./useHeroSummary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { getSummaryAction } from "../actions/get-summary.action";
import type { SummaryInformationResponse } from "../types/summary-information.response";

//hay que tener una preparacion para tener el use client sino da error hook

//hay que utilizarlo como un wrapper para poder envolver el renderHook
const tanStackCustomProvider = () => {
    //este metodo se puede separar por si queremos reutilziarlo porque sino tendremos que armarlos siempre en los test necesarios
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}

vi.mock('../actions/get-summary.action', () => ({
    getSummaryAction: vi.fn(),
}));

//aqui tenemos mas facilmente poder manipular el mock
const mockGetSummaryAction = vi.mocked(getSummaryAction);


// test de hook
describe('useHeroSummary', () => {

    test('should return the initial state ( isLoading)', () => {
        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: tanStackCustomProvider()
        });

        // console.log(result.current);

        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.isError).toBe(false);
        expect(result.current.data).toBe(undefined);
        expect(result.current.data).toBeUndefined();
    })

    test('should return success state with data when API call succeeds', async () => {

        // const { result } = renderHook(() => useHeroSummary(), {
        //     wrapper: tanStackCustomProvider(),
        // });

        //vamos a poner el mock para asi poder hacer lo que queramos
        const mockSymmaryData = {
            totalHeroes: 10,
            strongestHero: {
                id: '1',
                name: 'Superman'
            },
            smartestHero: {
                id: '2',
                name: 'Batman'
            },
            heroCount: 18,
            villainCount: 7
        } as SummaryInformationResponse;

        mockGetSummaryAction.mockResolvedValue(mockSymmaryData);

        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(mockGetSummaryAction).toHaveBeenCalled();

        // console.log(result.current);
    })

    test('shloud return erropr state when API call fails', async () => {
        const mockError = new Error('Failed to fetch summary');

        mockGetSummaryAction.mockRejectedValue(mockError);


        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        // console.log(result);

        expect(result.current.error).toBeDefined();
        expect(result.current.isLoading).toBe(false);
        expect(mockGetSummaryAction).toHaveBeenCalled();
    })

})