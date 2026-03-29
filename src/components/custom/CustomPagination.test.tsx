import { describe, expect, test, vi } from "vitest";
import { CustomPagination } from "./CustomPagination";
import { fireEvent, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { PropsWithChildren } from "react";

//ya con esto se quitan todas las clases de shacdn
vi.mock('../ui/button', () => ({
    Button: ({ children, ...props }: PropsWithChildren) => (
        <button {...props}>{children}</button>
    )
}))


//hay que prepararlo para tener la renderizacion
const renderWithRouter = (
    component: React.ReactElement,
    initialEntries?: string[],
) => {

    return render(
        <MemoryRouter initialEntries={initialEntries}>
            {component}
        </MemoryRouter>
    )
}


describe('CustomPagination', () => {


    test('should render component with default values', () => {

        renderWithRouter(<CustomPagination totalPages={5} />)

        // screen.debug();

        expect(screen.getByText('Anteriores')).toBeDefined();
        expect(screen.getByText('Siguientes')).toBeDefined();
    });


    test('should disabled previous button when page is 1', () => {

        renderWithRouter(<CustomPagination totalPages={5} />);

        const previousButton = screen.getByText('Anteriores');

        // screen.debug(previousButton);
        expect(previousButton.getAttributeNames()).toContain('disabled');

    })


    test('should disabled next button when we are in the last page', () => {

        renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=5']);

        const nextButton = screen.getByText('Siguientes');

        // screen.debug(nextButton);
        expect(nextButton.getAttributeNames()).toContain('disabled');

    })


    test('should disabled  button 3 when we are in page 3', () => {

        renderWithRouter(<CustomPagination totalPages={10} />, ['/?page=3']);

        const button3 = screen.getByText('3');

        // screen.debug(button3);
        expect(button3.getAttribute('variant')).toBe('default');

    })


    test('should change page when click on number button', () => {
        renderWithRouter(<CustomPagination totalPages={10} />, ['/?page=3']);

        const button2 = screen.getByText('2');
        const button3 = screen.getByText('3');

        expect(button2.getAttribute('variant')).toBe('outline');
        expect(button3.getAttribute('variant')).toBe('default');

        //aqui tenemos el outline en button 2 pero cuando hagamos click ya pasa a default y button 3 pasa a outline
        fireEvent.click(button2);
        screen.debug();

        expect(button2.getAttribute('variant')).toBe('default');
        expect(button3.getAttribute('variant')).toBe('outline');
    })

})