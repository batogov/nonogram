import { BasicView, State, Mode, Picture } from './types';

export class View implements BasicView {
    private element: Element | null = null;
    private form: Element | null = null;
    private lifeCounterElement: Element | null = null;
    private endGameElement: Element | null = null;
    private victoryElement: Element | null = null;

    constructor(
        element: Element | null,
        form: Element | null,
        lifeCounterElement: Element | null,
        endGameElement: Element | null,
        victoryElement: Element | null,
    ) {
        this.element = element;
        this.form = form;
        this.lifeCounterElement = lifeCounterElement;
        this.endGameElement = endGameElement;
        this.victoryElement = victoryElement;
    }

    getAllVerticalSequencesElement(verticalSequences: Array<number[]>, state: State) {
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < verticalSequences.length; i++) {
            const element = document.createElement('div');
            element.classList.add('vertical-seqs');

            const sequencesSum = verticalSequences[i].reduce((sum, current) => sum + current, 0);
            const coloredCellCount = state.reduce((sum, row) => row[i] === 'colored' ? sum + 1 : sum, 0);

            if (sequencesSum === coloredCellCount) {
                element.classList.add('vertical-seqs_done');
            }

            for (let j = 0; j < verticalSequences[i].length; j++) {
                const item = document.createElement('span');

                item.classList.add('vertical-seqs__item');
                item.textContent = String(verticalSequences[i][j]);

                element.appendChild(item);
            }

            fragment.appendChild(element);
        }

        return fragment;
    }

    getHorizontalSequencesElement(i: number, horizontalSequences: Array<number[]>, state: State) {
        const element = document.createElement('div');
        element.classList.add('horizontal-seqs');

        const sequencesSum = horizontalSequences[i].reduce((sum, current) => sum + current, 0);
        const coloredCellCount = state[i].reduce((sum, current) => current === 'colored' ? sum + 1 : sum, 0);

        if (sequencesSum === coloredCellCount) {
            element.classList.add('horizontal-seqs_done');
        }

        for (let j = 0; j < horizontalSequences[i].length; j++) {
            const item = document.createElement('span');

            item.classList.add('horizontal-seqs__item');
            item.textContent = String(horizontalSequences[i][j]);

            element.appendChild(item);
        }

        return element;
    }

    getCornerCell() {
        const cornerCell = document.createElement('div');
        cornerCell.classList.add('corner-cell');

        return cornerCell;
    }

    public renderEndGame(isEndGameShown: boolean) {
        if (this.endGameElement) {
            if (isEndGameShown) {
                this.endGameElement.classList.remove('end-game_hidden');
            } else {
                this.endGameElement.classList.add('end-game_hidden');
            }
        }
    }

    public renderVictoryView(isVictoryViewShown: boolean) {
        if (this.victoryElement) {
            if (isVictoryViewShown) {
                this.victoryElement.classList.remove('victory_hidden');
            } else {
                this.victoryElement.classList.add('victory_hidden');
            }
        }
    }

    public renderPicture({
        picture,
        state,
        horizontalSequences,
        verticalSequences,
    }: {
        picture: Picture,
        state: State,
        horizontalSequences: Array<number[]>,
        verticalSequences: Array<number[]>,
    }) {
        if (this.element) {
            this.element.innerHTML = '';

            this.element.appendChild(this.getCornerCell());
            this.element.appendChild(this.getAllVerticalSequencesElement(verticalSequences, state));

            for (let i = 0; i < state.length; i++) {
                this.element.appendChild(this.getHorizontalSequencesElement(i, horizontalSequences, state));

                for (let j = 0; j < state[0].length; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.style.backgroundColor = picture[i][j];

                    this.element.appendChild(cell);
                }
            }
        }
    }

    public render({
        state,
        horizontalSequences,
        verticalSequences,
        lifeCounter,
    }: {
        state: State,
        horizontalSequences: Array<number[]>,
        verticalSequences: Array<number[]>,
        lifeCounter: number,
    }) {
        if (this.lifeCounterElement) {
            this.lifeCounterElement.textContent = `Lives: ${lifeCounter}`;
        }

        if (this.element) {
            this.element.innerHTML = '';

            this.element.appendChild(this.getCornerCell());

            // Render vertical sequences row
            this.element.appendChild(this.getAllVerticalSequencesElement(verticalSequences, state));

            for (let i = 0; i < state.length; i++) {
                // Render horizontal sequences cell
                this.element.appendChild(this.getHorizontalSequencesElement(i, horizontalSequences, state));

                for (let j = 0; j < state[0].length; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');

                    if (state[i][j] === 'colored') {
                        cell.classList.add('cell_colored');
                    }

                    if (state[i][j] === 'crossed') {
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
        handleNewGameButtonClick,
    }: {
        handleCellClick: (i: number, j: number) => void,
        handleModeChange: (mode: Mode) => void,
        handleNewGameButtonClick: () => void,
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

        if (this.endGameElement) {
            const newGameButton = this.endGameElement.querySelector('button');

            if (newGameButton) {
                newGameButton.addEventListener('click', () => {
                    handleNewGameButtonClick();
                });
            }
        }
    }
}