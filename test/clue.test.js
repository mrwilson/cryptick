import { assert, describe, it, beforeEach } from 'vitest';
import { CryptickClue } from '../src/miniclue/clue.js';
import { FULL_PAYLOAD, NO_EXPLANATION, NO_HINT } from './test-examples.js';

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
    });

    it('can render a clue', () => {
        cryptickClue.renderClue(FULL_PAYLOAD);
        assert.equal(clue.textContent, 'What time is it? (6)');
    });

    it('can reveal single letter', () => {
        cryptickClue.renderClue(FULL_PAYLOAD);
        assert.equal(answerValue(), '');
        revealLetter.click();
        assert.equal(answerValue(), 'A');
    });

    it('can reveal whole word', () => {
        cryptickClue.renderClue(FULL_PAYLOAD);
        assert.equal(answerValue(), '');
        revealWord.click();
        assert.equal(answerValue(), 'AAAAAA');
    });

    it('can display hint', () => {
        cryptickClue.renderClue(FULL_PAYLOAD);
        assert.isFalse(hint.classList.contains('hint--revealed'));
        showHint.click();
        assert.isTrue(hint.classList.contains('hint--revealed'));
    });

    it('does not fill out hint if not present', () => {
        cryptickClue.renderClue(NO_HINT);
        assert.isEmpty(hint.textContent);
    });

    it('does not fill out explanation if not present', () => {
        cryptickClue.renderClue(NO_EXPLANATION);
        assert.isEmpty(explanation.textContent);
    });

    it('can copy share message to clipboard', () => {
        cryptickClue.renderClue(FULL_PAYLOAD);
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
