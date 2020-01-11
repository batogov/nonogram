export type Field = Array<number[]>;

export interface BasicView {
    render(field: Field): void;
}

