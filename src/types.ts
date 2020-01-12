export type Mode = 'coloring' | 'crossing';

export type Picture = Array<number[]>;

export type Field = Array<Cell[]>;
export type Cell = 'colored' | 'crossed' | 'empty';

export interface BasicView {
    render(params: {
        field: Field,
        lifeCounter: number,
        horizontalSequences: Array<number[]>,
        verticalSequences: Array<number[]>,
    }): void;

    renderEndGame(isEndGameShown: boolean): void;

    initHandlers(params: {
        handleCellClick: (i: number, j: number) => void,
        handleModeChange: (mode: Mode) => void,
        handleNewGameButtonClick: () => void,
    }): void;
}

