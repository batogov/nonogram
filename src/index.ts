import { Game } from './game';
import { View } from './view';

const element = document.querySelector('#field');
const formElement = document.querySelector('#form');
const lifeCounterElement = document.querySelector('#life-counter');
const endGameElement = document.querySelector('#end-game');

const picture = [
    [0, 1, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1],
    [0, 1, 1, 0, 0],
];

const view = new View(element, formElement, lifeCounterElement, endGameElement);
const game = new Game(picture, view);

game.init();