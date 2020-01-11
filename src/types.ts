export type Mode = 'coloring' | 'crossing';

export type Picture = Array<number[]>;

export type Field = Array<Cell[]>;
export type Cell = 'colored' | 'crossed' | 'empty';

export interface BasicView {
    render(field: Field): void;
    initHandlers({
        handleCellClick,
        handleModeChange
    }: {
        handleCellClick: (i: number, j: number) => void,
        handleModeChange: (mode: Mode) => void,
    }): void;
}

