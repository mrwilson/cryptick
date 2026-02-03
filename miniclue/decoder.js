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

        return clue;
    }

    #decodeString(input) {
        let data = input.split('|');

        let clue = {
            clue: data[0],
            answer: data[1],
        };

        if (data.length === 3) {
            clue.hint = data[2];
        }

        return clue;
    }

    decode(input) {
        let hash = input.substring(1);

        if (hash in this.examples) {
            return this.examples[hash];
        }

        let data = atob(hash);

        return data.startsWith('{')
            ? this.#decodeJson(data)
            : this.#decodeString(data);
    }
}
