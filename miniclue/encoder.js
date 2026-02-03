import { enumerate } from './utils.js';

export class ClueEncoder {
    constructor(clue, answer, hint) {
        this.clue = clue;
        this.answer = answer;
        this.hint = hint;
    }

    fragment(baseUrl) {
        let clueString = `${this.clue.value}|${this.answer.value}`;

        if (this.hint.value) {
            clueString = `${clueString}|${this.hint.value}`;
        }

        return `${baseUrl}#${btoa(clueString)}`;
    }

    copyText(baseUrl) {
        return [
            `${this.clue.value} (${enumerate(this.answer.value)})`,
            this.fragment(baseUrl),
            'Solve it, and create your own!',
        ].join('\n\n');
    }
}
