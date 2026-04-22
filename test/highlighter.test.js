import { assert, describe, it } from 'vitest';
import { Highlighter } from '../src/miniclue/highlighter.js';

describe('Highlighter', () => {
    it('does nothing to clue without markup', () => {
        const output = new Highlighter().process('test clue');

        assert.deepEqual(output, {
            cleaned: 'test clue',
            fodders: [],
            indicators: [],
            definition: undefined,
        });
    });

    it('identifies and cleans fodders', () => {
        const output = new Highlighter().process('this ((is)) a ((test)) clue');

        assert.deepEqual(output, {
            cleaned: 'this is a test clue',
            fodders: [
                [5, 7],
                [10, 14],
            ],
            indicators: [],
            definition: undefined,
        });
    });

    it('identifies and cleans indicators', () => {
        const output = new Highlighter().process('this is {{a}} test {{clue}}');

        assert.deepEqual(output, {
            cleaned: 'this is a test clue',
            fodders: [],
            indicators: [
                [8, 9],
                [15, 19],
            ],
            definition: undefined,
        });
    });

    it('identifies and cleans definitions', () => {
        const output = new Highlighter().process('[[this]] is a test clue');

        assert.deepEqual(output, {
            cleaned: 'this is a test clue',
            fodders: [],
            indicators: [],
            definition: [0, 4],
        });
    });
});
