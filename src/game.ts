import { BasicView, Field, Picture, Mode } from './types';

const generateEmptyField: (rows: number, cols: number) => Field = (rows, cols) => {
    return new Array(rows).fill(0).map(() => new Array(cols).fill('empty'));
}

export const getSequences: (array: number[]) => number[] = (array) => {
    const result: number[] = [];

    for (let i = 0; i < array.length; i++) {
        if (array[i] === 1) {
            if (i === 0) {
                result.push(1);
            } else {
                if (array[i - 1] === 1) {
                    result[result.length - 1] = result[result.length - 1] + 1;
                } else {
                    result.push(1);
                }
            }
        }
    }

    return result.length === 0 ? [0] : result;
}

export const getAllHorizontalSequences: (picture: Picture) => Array<number[]> = (picture) => {
    const sequences = [];

    for (let i = 0; i < picture.length; i++) {
        sequences.push(getSequences(picture[i]));
    }

    return sequences;
}

export const getAllVerticalSequences: (picture: Picture) => Array<number[]> = (picture) => {
    const sequences = [];

    for (let j = 0; j < picture[0].length; j++) {
        const column = picture.map(row => row[j]);

        sequences.push(getSequences(column));
    }

    return sequences;
}

export class Game {
    private picture: Picture;
    private view: BasicView;

    private field: Field;

    private mode: Mode = 'coloring';
    private lifeCounter: number = 3;

    private verticalSequences: Array<number[]>;
    private horizontalSequences: Array<number[]>;

    constructor(
        picture: Picture,
        view: BasicView,
    ) {
        this.picture = picture;
        this.view = view;

        this.field = generateEmptyField(picture.length, picture[0].length);

        this.verticalSequences = getAllVerticalSequences(picture);
        this.horizontalSequences = getAllHorizontalSequences(picture);
    }

    private render() {
        this.view.render({
            field: this.field,
            lifeCounter: this.lifeCounter,
            horizontalSequences: this.horizontalSequences,
            verticalSequences: this.verticalSequences
        });
    }

    private handleNewGameButtonClick() {
        this.lifeCounter = 3;
        this.field = generateEmptyField(this.picture.length, this.picture[0].length);

        this.view.renderEndGame(false);
        this.init();
    }

    private handleCellClick(i: number, j: number) {
        if (this.field[i][j] !== 'empty' || this.lifeCounter === 0) {
            return;
        }

        if (this.mode === 'coloring') {
            if (this.picture[i][j] === 1) {
                this.field[i][j] = 'colored';
            } else {
                this.field[i][j] = 'crossed';
                this.lifeCounter -= 1;
            }
        }

        if (this.mode === 'crossing') {
            if (this.picture[i][j] !== 1) {
                this.field[i][j] = 'crossed';
            } else {
                this.field[i][j] = 'colored';
                this.lifeCounter -= 1;
            }
        }

        if (this.lifeCounter === 0) {
            this.view.renderEndGame(true);
        }

        this.render();
    }

    private handleModeChange(mode: Mode) {
        this.mode = mode;
    }

    public init() {
        this.view.initHandlers({
            handleCellClick: (i, j) => this.handleCellClick(i, j),
            handleModeChange: (mode) => this.handleModeChange(mode),
            handleNewGameButtonClick: () => this.handleNewGameButtonClick(),
        });

        this.render();
    }
}