import { Game } from './game';
import { View } from './view';
import { Data } from './types';

const element = document.querySelector('#field');
const formElement = document.querySelector('#form');
const lifeCounterElement = document.querySelector('#life-counter');
const endGameElement = document.querySelector('#end-game');
const victoryElement = document.querySelector('#victory')

const data = [
    {
        title: 'lion',
        picture: [
            ['#23A6FF', '#774218', '#774218', '#774218', '#23A6FF'],
            ['#F6B853', '#F6B853', '#F6B853', '#774218', '#23A6FF'],
            ['#F1B348', '#F1B348', '#F1B348', '#774218', '#23A6FF'],
            ['#23A6FF', '#633714', '#633714', '#774218', '#EEAF46'],
            ['#EEAF46', '#633714', '#EEAF46', '#EEAF46', '#F6B853'],
        ],
        field: [
            [0, 1, 1, 1, 0],
            [1, 1, 1, 1, 0],
            [1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ],
    },
    {
        title: 'rose',
        picture: [
            ['#9B001E', '#B90628', '#B90628', '#B90628', '#9B001E'],
            ['#9B001E', '#B90628', '#AD0B2A', '#CA0028', '#9B001E'],
            ['#9B001E', '#CA0028', '#CA0028', '#CA0028', '#9B001E'],
            ['#DF1FFE', '#9B001E', '#9B001E', '#9B001E', '#DF1FFE'],
            ['#DF1FFE', '#DF1FFE', '#77E916', '#DF1FFE', '#DF1FFE'],
        ],
        field: [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0],
        ],
    }
] as Data;

const view = new View(element, formElement, lifeCounterElement, endGameElement, victoryElement);
const game = new Game(data, view);

game.init();