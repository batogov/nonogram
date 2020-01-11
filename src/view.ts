import { BasicView, Field, Mode } from './types';

export class View implements BasicView {
    private element: Element | null = null;
    private form: Element | null = null;

    constructor(
        element: Element | null,
        form: Element | null,
    ) {
        this.element = element;
        this.form = form;
    }

    public render(field: Field) {
        if (this.element) {
            this.element.innerHTML = '';

            for (let i = 0; i < field.length; i++) {
                for (let j = 0; j < field[0].length; j++) {
                    const cell = document.createElement('div');

                    cell.classList.add('cell');

                    if (field[i][j] === 'colored') {
                        cell.classList.add('cell_colored');
                    }

                    if (field[i][j] === 'crossed') {
                        cell.classList.add('cell_crossed');
                    }

                    cell.dataset.i = String(i);
                    cell.dataset.j = String(j);

                    this.element.appendChild(cell);
                }
            }
        }
    }

    public initHandlers({
        handleCellClick,
        handleModeChange,
    }: {
        handleCellClick: (i: number, j: number) => void,
        handleModeChange: (mode: Mode) => void,
    }) {
        if (this.element) {
            this.element.addEventListener('click', (event: Event) => {
                if (
                    !(
                        event.target instanceof HTMLDivElement &&
                        event.target.classList.contains('cell')
                    )
                ) {
                    return;
                }

                const i = Number(event.target.dataset.i);
                const j = Number(event.target.dataset.j);

                handleCellClick(i, j);
            });
        }

        if (this.form) {
            this.form.addEventListener('change', (event: Event) => {
                if (!(event.target instanceof HTMLInputElement)) {
                    return;
                }

                if (event.target.value === 'coloring') {
                    handleModeChange('coloring');
                }

                if (event.target.value === 'crossing') {
                    handleModeChange('crossing');
                }
            });
        }
    }
}