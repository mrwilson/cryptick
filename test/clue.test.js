import { assert, describe, it, beforeEach } from 'vitest';
import { CryptickClue } from '../miniclue/clue.js';

// @vitest-environment jsdom

describe('MiniClue', () => {
    let answer,
        clue,
        hint,
        explanation,
        revealLetter,
        revealWord,
        showHint,
        share,
        cryptickClue;

    beforeEach(() => {
        answer = document.createElement('form');
        clue = document.createElement('h1');
        hint = document.createElement('h4');
        explanation = document.createElement('h4');
        revealLetter = document.createElement('button');
        revealWord = document.createElement('button');
        showHint = document.createElement('button');
        share = document.createElement('button');

        cryptickClue = new CryptickClue(
            answer,
            clue,
            hint,
            explanation,
            revealLetter,
            revealWord,
            showHint,
            share,
        );

        cryptickClue.renderClue({
            clue: 'What time is it?',
            answer: 'aaaaaa',
            hint: 'this is a hint',
            explanation: 'this is an explanation',
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

    it('can display hint', () => {
        assert.isFalse(hint.classList.contains('hint--revealed'));
        showHint.click();
        assert.isTrue(hint.classList.contains('hint--revealed'));
    });

    it('displays explanation once word is complete', () => {
        revealWord.click();
        assert.equal(answerValue(), 'AAAAAA');
    });

    it('can copy share message to clipboard', () => {
        let output = '';

        let clipboard = {
            writeText: function (text) {
                output = text;
                return new Promise(() => text);
            },
        };

        cryptickClue.shareMessage('https://example.com', clipboard);

        assert.equal(
            'I solved a clue on Cryptick!\n\nWhat time is it? (6)\n\nhttps://example.com',
            output,
        );
    });

    function answerValue() {
        return [...new FormData(answer).values()].join('');
    }
});
