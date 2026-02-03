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
}
