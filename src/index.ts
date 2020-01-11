import { Game } from './game';
import { View } from './view';

const element = document.querySelector('#field');
const form = document.querySelector('#form');

const picture = [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
];

const view = new View(element, form);
const game = new Game(picture, view);

game.init();