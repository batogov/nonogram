import { Game } from './game';
import { View } from './view';
import { Field } from './types';

const element = document.querySelector('#field');
const formElement = document.querySelector('#form');
const lifeCounterElement = document.querySelector('#life-counter');
const endGameElement = document.querySelector('#end-game');

const data = {
    'lion': {
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
        ]
    }
};

const view = new View(element, formElement, lifeCounterElement, endGameElement);
const game = new Game(data['lion'].picture, data['lion'].field, view);

game.init();