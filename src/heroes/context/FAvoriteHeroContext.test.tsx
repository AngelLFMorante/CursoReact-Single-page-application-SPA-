import { beforeEach, describe, expect, test } from "vitest";
import { FavoriteHeroContext, FavoriteHeroProvider } from "./FAvoriteHeroContext";
import { fireEvent, render, screen } from "@testing-library/react";
import { use } from "react";
import type { Hero } from "../types/hero.interface";

const mockHero = {
    id: '1',
    name: 'batman'
} as Hero;


const TestComponent = () => {


    const { favoriteCount, favorites, isFavorite, toggleFavorite } = use(FavoriteHeroContext)

    return (
        <div>
            <div data-testid="favorite-count">{favoriteCount}</div>
            <div data-testid="favorite-list">
                {
                    favorites.map((hero) => (
                        <div key={hero.id} data-testid={`hero-${hero.id}`}>
                            {hero.name}
                        </div>
                    ))
                }
            </div>

            <button data-testid="toggle-favorite" onClick={() => toggleFavorite(mockHero)}>
                Toggle Favorite
            </button>

            <div data-testid="is-favorite">
                {/* para que renderize los booleanos */}
                {isFavorite(mockHero).toString()}
            </div>
        </div >
    )
}


const renderContextTest = () => {

    return render(
        <FavoriteHeroProvider>
            <TestComponent />
        </FavoriteHeroProvider>
    )
}

describe('FavoriteHeroContext', () => {

    beforeEach(() => {
        localStorage.clear();
    })

    test('should initialize with defautl values', () => {
        renderContextTest();

        screen.debug();

        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        expect(screen.getByTestId('favorite-list').children.length).toBe(0)
    })


    test('should add hero to favorites when toggleFavorite is called with new Hero', () => {

        renderContextTest();

        const button = screen.getByTestId('toggle-favorite');

        //disparar evento onclick
        fireEvent.click(button);

        screen.debug()

        //si no existe se agrege
        expect(screen.getByTestId('is-favorite').textContent).toBe('true');
        expect(screen.getByTestId('favorite-count').textContent).toBe('1');
        expect(screen.getByTestId('hero-1').textContent).toBe('batman');

        expect(localStorage.getItem('favorites')).toBe(
            '[{"id":"1","name":"batman"}]'
        );
        // console.log(localStorage.getItem('favorites'));
    })

    test('should remove hero to favorites when toggleFavorite is called ', () => {
        // console.log(localStorage.getItem('favorites'));
        localStorage.setItem('favorites', JSON.stringify([mockHero]))
        renderContextTest();

        //comprobanmos primero que tiene todo 
        expect(screen.getByTestId('is-favorite').textContent).toBe('true');
        expect(screen.getByTestId('favorite-count').textContent).toBe('1');
        expect(screen.getByTestId('hero-1').textContent).toBe('batman');

        const button = screen.getByTestId('toggle-favorite');

        //disparar evento onclick
        fireEvent.click(button);
        screen.debug()

        //saqui ya devolvemos que no es favorito
        expect(screen.getByTestId('is-favorite').textContent).toBe('false');
        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        //para devolver el elemento null porque con byunifined o bynull no funciona
        expect(screen.queryByTestId('hero-1')).toBeNull();

    })


})