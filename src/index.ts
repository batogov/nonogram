import { Game } from './game';
import { View } from './view';

const element = document.querySelector('#field');

const field = [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
];

const view = new View(element);
const game = new Game(field, view);

game.init();