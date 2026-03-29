import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, test } from "vitest";
import { SearchControls } from "./SearchControls";

//esto es algo mas lioso es video 246 
//sobreescribiendo a nivel flobal
if (typeof window.ResizeObserver === 'undefined') {
    class ResizeObserver {
        observe() { }
        unobserve() { }
        disconnect() { }
    }
    window.ResizeObserver = ResizeObserver;
}



const queryClient = new QueryClient();

const renderSearchControls = (initialEntries: string[] = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            {/* <FavoriteHeroProvider> */}
            <QueryClientProvider client={queryClient}>
                <SearchControls />
            </QueryClientProvider>
            {/* </FavoriteHeroProvider> */}
        </MemoryRouter>
    )

}


describe('SearchControls', () => {


    test('should render SearchControls with default values', () => {
        const { container } = renderSearchControls();

        expect(container).toMatchSnapshot();
        // screen.debug();
    })

    test('should set inpunt value when search param name is set', () => {
        renderSearchControls(['/?name=Batman']);
        const inpunt = screen.getByPlaceholderText('Search heroes, villains, powers, teams...');
        expect(inpunt.getAttribute('value')).toBe('Batman')
    });

    test('should change params when input is changed and enter is pressed', () => {
        renderSearchControls(['/?name=Batman']);
        const input = screen.getByPlaceholderText(
            'Search heroes, villains, powers, teams...'
        );
        expect(input.getAttribute('value')).toBe('Batman')

        fireEvent.change(input, { target: { value: 'Superman' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        // screen.debug(input);

        expect(input.getAttribute('value')).toBe('Superman');

    });

    test('should change params strength when slider is changed', () => {
        renderSearchControls(['/?name=Batman&active-accordion=advance-filters']);

        const slider = screen.getByRole('slider');

        expect(slider.getAttribute('aria-valuenow')).toBe('0');
        // screen.debug(slider);

        fireEvent.keyDown(slider, { key: 'ArrowRight' });

        expect(slider.getAttribute('aria-valuenow')).toBe('1');
        // screen.debug(slider);

    })

    test('should accordion be open when active-accordion param is set', () => {
        renderSearchControls(['/?name=Batman&active-accordion=advance-filters']);

        const accordion = screen.getByTestId('accordion');
        const accordionItem = accordion.querySelector('div');

        expect(accordionItem?.getAttribute('data-state')).toBe('open');

    })

    test('should accordion be closed when active-accordion param is not set', () => {
        renderSearchControls(['/?name=Batman']);

        const accordion = screen.getByTestId('accordion');
        const accordionItem = accordion.querySelector('div');

        expect(accordionItem?.getAttribute('data-state')).toBe('closed');

    })

})