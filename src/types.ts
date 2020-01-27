export type Mode = 'coloring' | 'crossing';

export type Picture = Array<string[]>;
export type Field = Array<number[]>;

export type State = Array<Cell[]>;
export type Cell = 'colored' | 'crossed' | 'empty';

export type Data = Array<{ title: string, picture: Picture, field: Field }>

export interface BasicView {
    render(params: {
        state: State,
        lifeCounter: number,
        horizontalSequences: Array<number[]>,
        verticalSequences: Array<number[]>,
    }): void;

    renderPicture(params: {
        state: State,
        picture: Picture,
        lifeCounter: number,
        horizontalSequences: Array<number[]>,
        verticalSequences: Array<number[]>,
    }): void;

    renderEndGame(isEndGameShown: boolean): void;

    renderVictoryView(isVictoryViewShown: boolean, picture?: Picture): void;

    initHandlers(params: {
        handleCellClick: (i: number, j: number) => void,
        handleModeChange: (mode: Mode) => void,
        handleNewGameButtonClick: () => void,
        handleNextLevelButtonClick: () => void,
    }): void;
}

