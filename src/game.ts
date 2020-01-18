import { BasicView, Field, State, Picture, Mode } from './types';

const generateEmptyState: (rows: number, cols: number) => State = (rows, cols) => {
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

export const getAllHorizontalSequences: (field: Field) => Array<number[]> = (field) => {
    const sequences = [];

    for (let i = 0; i < field.length; i++) {
        sequences.push(getSequences(field[i]));
    }

    return sequences;
}

export const getAllVerticalSequences: (field: Field) => Array<number[]> = (field) => {
    const sequences = [];

    for (let j = 0; j < field[0].length; j++) {
        const column = field.map(row => row[j]);

        sequences.push(getSequences(column));
    }

    return sequences;
}

export class Game {
    private picture: Picture;
    private view: BasicView;

    private field: Field;
    private state: State;

    private mode: Mode = 'coloring';
    private lifeCounter: number = 3;

    private verticalSequences: Array<number[]>;
    private horizontalSequences: Array<number[]>;

    constructor(
        picture: Picture,
        field: Field,
        view: BasicView,
    ) {
        this.picture = picture;
        this.field = field;

        this.state = generateEmptyState(field.length, field[0].length);

        this.view = view;

        this.verticalSequences = getAllVerticalSequences(field);
        this.horizontalSequences = getAllHorizontalSequences(field);
    }

    private render() {
        this.view.render({
            state: this.state,
            lifeCounter: this.lifeCounter,
            horizontalSequences: this.horizontalSequences,
            verticalSequences: this.verticalSequences
        });
    }

    private handleNewGameButtonClick() {
        this.lifeCounter = 3;
        this.state = generateEmptyState(this.field.length, this.field[0].length);

        this.view.renderEndGame(false);
        this.init();
    }

    private handleCellClick(i: number, j: number) {
        if (this.state[i][j] !== 'empty' || this.lifeCounter === 0) {
            return;
        }

        if (this.mode === 'coloring') {
            if (this.field[i][j] === 1) {
                this.state[i][j] = 'colored';
            } else {
                this.state[i][j] = 'crossed';
                this.lifeCounter -= 1;
            }
        }

        if (this.mode === 'crossing') {
            if (this.field[i][j] !== 1) {
                this.state[i][j] = 'crossed';
            } else {
                this.state[i][j] = 'colored';
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