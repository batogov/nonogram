import { BasicView, Field, State, Picture, Mode, Data } from './types';

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
    private level: number;
    private data: Data;

    private state: State;
    private field: Field;
    private picture: Picture;

    private view: BasicView;

    private mode: Mode = 'coloring';
    private lifeCounter: number = 3;

    private verticalSequences: Array<number[]>;
    private horizontalSequences: Array<number[]>;

    constructor(
        data: Data,
        view: BasicView,
    ) {
        this.data = data;
        this.level = 0;

        this.setLevel(0, data);

        this.view = view;
    }

    private setLevel(level: number, data: Data) {
        const picture = data[level].picture;
        const field = data[level].field;

        this.field = field;
        this.picture = picture;
        this.state = generateEmptyState(field.length, field[0].length);

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

    private renderPicture() {
        this.view.renderPicture({
            picture: this.picture,
            state: this.state,
            lifeCounter: this.lifeCounter,
            horizontalSequences: this.horizontalSequences,
            verticalSequences: this.verticalSequences
        })
    }

    private handleNewGameButtonClick() {
        this.lifeCounter = 3;
        this.state = generateEmptyState(this.field.length, this.field[0].length);

        this.view.renderEndGame(false);
        this.init();
    }

    private handleNextLevelButtonClick() {
        if (this.level + 1 < this.data.length) {
            this.level++;
            this.setLevel(this.level, this.data);

            this.view.renderVictoryView(false);
            this.render();
        }
    }

    private checkWin() {
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[0].length; j++) {
                if (this.field[i][j] === 1 && this.state[i][j] !== 'colored') {
                    return false;
                }
            }
        }

        return true;
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

        if (this.checkWin()) {
            this.view.renderVictoryView(true, this.picture);
            this.renderPicture();
        } else {
            this.render();
        }
    }

    private handleModeChange(mode: Mode) {
        this.mode = mode;
    }

    public init() {
        this.view.initHandlers({
            handleCellClick: (i, j) => this.handleCellClick(i, j),
            handleModeChange: (mode) => this.handleModeChange(mode),
            handleNewGameButtonClick: () => this.handleNewGameButtonClick(),
            handleNextLevelButtonClick: () => this.handleNextLevelButtonClick(),
        });

        this.render();
    }
}