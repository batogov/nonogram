import { BasicView, Field } from './types';

export class Game {
    private field: Field;
    private view: BasicView;

    constructor(
        field: Field,
        view: BasicView,
    ) {
        this.field = field;
        this.view = view;
    }

    public init() {
        this.view.render(this.field);
    }
}