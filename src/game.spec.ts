import { getSequences, getAllHorizontalSequences, getAllVerticalSequences } from './game';

describe('Game class', () => {
    test('test getSequences function', () => {
        expect(getSequences([1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1])).toEqual([1, 1, 3, 1, 1]);
        expect(getSequences([0, 0, 0, 0])).toEqual([0]);
        expect(getSequences([1, 0, 0, 0])).toEqual([1]);
        expect(getSequences([0, 0, 0, 1])).toEqual([1]);
    });

    test('test getAllHorizontalSequences function', () => {
        expect(
            getAllHorizontalSequences([
                [1, 1, 0, 0, 1, 1],
                [0, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1, 0],
            ])
        ).toEqual([[2, 2], [4], [0], [6], [0], [1, 1, 1]]);
    });

    test('test getAllVerticalSequences function', () => {
        expect(
            getAllVerticalSequences([
                [1, 1, 0, 0, 1, 1],
                [0, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 0],
                [1, 0, 1, 0, 1, 0],
            ])
        ).toEqual([[1, 1, 1], [2, 1], [1, 1, 1], [1, 1], [2, 1, 1], [1, 1]]);
    });
});