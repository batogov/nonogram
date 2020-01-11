import { BasicView, Field } from './types';

export class View implements BasicView {
    private element: Element | null = null;

    constructor(element: Element | null) {
        this.element = element;
    }

    public render(field: Field) {
        if (this.element) {
            this.element.innerHTML = '';

            for (let i = 0; i < field.length; i++) {
                for (let j = 0; j < field[0].length; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');

                    this.element.appendChild(cell);
                }
            }
        }
    }
}