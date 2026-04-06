import { enumerate } from './utils.js';

export class CreateCryptick {
    constructor(clue, answer, hint, explanation, author) {
        this.clue = clue;
        this.answer = answer;
        this.hint = hint;
        this.explanation = explanation;
        this.author = author;
    }

    fragment(baseUrl) {
        let clueString = `${this.clue.value}|${this.answer.value}|${this.hint.value || ''}|${this.explanation.value || ''}|${this.author.value || ''}`;

        const encoder = new TextEncoder();

        let encoded = new Uint8Array(encoder.encode(clueString)).toBase64();
        return `${baseUrl}#${encoded}`;
    }

    copyText(baseUrl) {
        return [
            `${this.clue.value} (${enumerate(this.answer.value)})`,
            this.fragment(baseUrl),
            'Solve it, and create your own cryptic clue!',
        ].join('\n\n');
    }

    shareData(baseUrl) {
        return {
            title: 'Cryptick',
            text: `${this.clue.value} (${enumerate(this.answer.value)})\n\n`,
            url: this.fragment(baseUrl),
        };
    }
}
