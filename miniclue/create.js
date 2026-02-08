import { enumerate } from './utils.js';

export class CreateCryptick {
    constructor(clue, answer, hint, explanation) {
        this.clue = clue;
        this.answer = answer;
        this.hint = hint;
        this.explanation = explanation;
    }

    fragment(baseUrl) {
        let clueString = `${this.clue.value}|${this.answer.value}|${this.hint.value || ''}|${this.explanation.value || ''}`;

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
