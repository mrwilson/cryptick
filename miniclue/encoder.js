export class ClueEncoder {
    static encode(clue, answer, hint) {
        let clueString = `${clue}|${answer}`;

        if (hint) {
            clueString = `${clueString}|${hint}`;
        }

        return btoa(clueString);
    }
}
