export type Mode = 'coloring' | 'crossing';

export type Picture = Array<number[]>;

export type Field = Array<Cell[]>;
export type Cell = 'colored' | 'crossed' | 'empty';

export interface BasicView {
    render({
        field,
        horizontalSequences,
        verticalSequences
    }: {
        field: Field,
        horizontalSequences: Array<number[]>,
        verticalSequences: Array<number[]>,
    }): void;

    initHandlers({
        handleCellClick,
        handleModeChange
    }: {
        handleCellClick: (i: number, j: number) => void,
        handleModeChange: (mode: Mode) => void,
    }): void;
}

