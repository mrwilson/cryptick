import { assert, beforeEach, describe, it } from 'vitest';
import { History } from '../src/miniclue/history.js';

describe('History', () => {
    let localStorage, history;

    beforeEach(() => {
        localStorage = {};
        localStorage.getItem = (key) => localStorage[key];
        localStorage.setItem = (key, item) => (localStorage[key] = item);

        history = new History(localStorage);
    });

    describe('#get', () => {
        it('returns empty list if empty', () => {
            assert.isEmpty(history.get());
        });

        it('returns empty list if set to null', () => {
            localStorage.setItem('cryptick', null);
            assert.isEmpty(history.get());
        });

        it('returns list if set to valid JSON', () => {
            localStorage.setItem('cryptick', `{"history":["a","b","c"]}`);
            assert.deepEqual(history.get(), ['a', 'b', 'c']);
        });

        it('returns empty list if set to valid JSON without history', () => {
            localStorage.setItem('cryptick', '{}');
            assert.isEmpty(history.get());
        });

        it('returns empty list if set to invalid JSON', () => {
            localStorage.setItem('cryptick', 'not-json');
            assert.isEmpty(history.get());
        });
    });

    describe('#add', () => {
        it('adds to empty history', () => {
            history.add('this-is-a-hash');

            assert.deepEqual(history.get(), ['this-is-a-hash']);
        });

        it('appends to non-empty history', () => {
            history.add('a');
            history.add('b');

            assert.deepEqual(history.get(), ['a', 'b']);
        });

        it('replaces existing entry as most recent', () => {
            history.add('a');
            history.add('b');
            history.add('c');
            history.add('b');

            assert.deepEqual(history.get(), ['a', 'c', 'b']);
        });

        it('enforces size limit', () => {
            for (let i = 0; i < 10; i++) {
                history.add(`${i}`);
            }

            history.add('a');

            assert.equal(history.get().join(''), '123456789a');
        });
    });
});
