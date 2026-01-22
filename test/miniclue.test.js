import { assert, describe, it } from 'vitest'
import { MiniClue } from '../miniclue'

// @vitest-environment jsdom

describe('MiniClue', () => {
    const answer = document.createElement('form'),
        validate = document.createElement('button'),
        clue = document.createElement('h1'),
        miniClue =  new MiniClue(answer, clue);

    it('can add validation class when required', () => {
        assert(!answer.classList.contains("validating"));

        miniClue.validate({target: validate})

        assert(answer.classList.contains("validating"));
    });

    it('can render a clue', () => {
        miniClue.renderClue({"c":"What time is it?", "a":"aaaaaa"});

        assert.equal(clue.textContent, "What time is it? (6)");
    });

})

