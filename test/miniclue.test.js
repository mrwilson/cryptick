import { assert, describe, it, beforeEach } from 'vitest';
import { MiniClue } from '../miniclue';

// @vitest-environment jsdom

describe('MiniClue', () => {
    let answer, clue, revealLetter, revealWord, miniClue;

    beforeEach(() => {
        answer = document.createElement('form');
        clue = document.createElement('h1');
        revealLetter = document.createElement('button');
        revealWord = document.createElement('button');

        new MiniClue(answer, clue, revealLetter, revealWord).renderClue({
            clue: 'What time is it?',
            answer: 'aaaaaa',
        });
    });

    it('can render a clue', () => {
        assert.equal(clue.textContent, 'What time is it? (6)');
    });

    it('can reveal single letter', () => {
        assert.equal(answerValue(), '');
        revealLetter.click();
        assert.equal(answerValue(), 'A');
    });

    it('can reveal whole word', () => {
        assert.equal(answerValue(), '');
        revealWord.click();
        assert.equal(answerValue(), 'AAAAAA');
    });

    function answerValue() {
        return [...new FormData(answer).values()].join('');
    }
});
