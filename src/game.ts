import { BasicView, Field, Picture, Mode } from './types';

export const generateEmptyField: (rows: number, cols: number) => Field = (rows, cols) => {
    return new Array(rows).fill(0).map(() => new Array(cols).fill('empty'));
}

export class Game {
    private picture: Picture;
    private view: BasicView;

    private field: Field;

    private mode: Mode = 'coloring';

    constructor(
        picture: Picture,
        view: BasicView,
    ) {
        this.picture = picture;
        this.view = view;

        this.field = generateEmptyField(picture.length, picture[0].length);
    }

    private handleCellClick(i: number, j: number) {
        if (this.field[i][j] !== 'empty') {
            return;
        }

        if (this.mode === 'coloring') {
            this.field[i][j] = 'colored';
        }

        if (this.mode === 'crossing') {
            this.field[i][j] = 'crossed';
        }

        this.view.render(this.field);
    }

    private handleModeChange(mode: Mode) {
        this.mode = mode;
    }

    public init() {
        this.view.initHandlers({
            handleCellClick: (i, j) => this.handleCellClick(i, j),
            handleModeChange: (mode) => this.handleModeChange(mode),
        });

        this.view.render(this.field);
    }
}