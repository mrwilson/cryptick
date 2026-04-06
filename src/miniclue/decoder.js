import { CryptickError } from './errors.js';
import { enumerate } from './utils.js';

export class ClueDecoder {
    constructor(examples) {
        this.examples = examples;
    }

    #decodeJson(input) {
        let data = JSON.parse(input);

        let clue = {
            clue: data.c,
            answer: data.a,
        };

        if (data.h) {
            clue.hint = data.h;
        }

        if (data.e) {
            clue.explanation = data.e;
        }

        if (data.u) {
            clue.author = data.u;
        }

        clue.enumeration = enumerate(clue.answer);

        return clue;
    }

    #decodeString(input) {
        let data = input.split('|');

        let clue = {
            clue: data[0],
            answer: data[1],
        };

        if (data.length >= 3 && data[2]) {
            clue.hint = data[2];
        }

        if (data.length >= 4 && data[3]) {
            clue.explanation = data[3];
        }

        if (data.length === 5 && data[4]) {
            clue.author = data[4];
        }

        clue.enumeration = enumerate(clue.answer);

        return clue;
    }

    decode(input) {
        if (!input || input.length < 2 || input[0] !== '#') {
            throw new CryptickError();
        }

        let hash = input.substring(1);

        if (hash in this.examples) {
            let clue = this.examples[hash];
            clue.enumeration = enumerate(clue.answer);
            return clue;
        }

        let data = '';

        try {
            data = new TextDecoder().decode(Uint8Array.fromBase64(hash));
        } catch (e) {
            data = atob(hash);
        }

        return data.startsWith('{')
            ? this.#decodeJson(data)
            : this.#decodeString(data);
    }
}
