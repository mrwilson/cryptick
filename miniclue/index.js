export class MiniClue {
    constructor(answer, clue, revealLetter, revealWord) {
        this.answer = answer;
        this.clue = clue;
        this.revealLetter = revealLetter;
        this.revealWord = revealWord;
        this.letters = [];
    }

    renderClue(params) {
        let words = params.answer.split(/[ -]/);

        this.clue.textContent = `${params.clue} (${MiniClue.enumerate(params.answer)})`;

        words
            .map((x) => this.#createWord(x))
            .forEach((l) => this.answer.appendChild(l));

        this.#navigate();

        this.revealWord.onclick = (_) => {
            this.letters.forEach(
                (letter) => (letter.value = letter.pattern[1]),
            );
        };

        this.revealLetter.onclick = (_) => {
            let missingLetters = this.letters.filter(
                (letter) =>
                    letter.validity.valueMissing || !letter.validity.valid,
            );

            let letter =
                missingLetters[
                    Math.floor(Math.random() * missingLetters.length)
                ];

            letter.value = letter.pattern[1];
            letter.readOnly = true;
            letter.classList.add('answer__word__letter--revealed');
        };
    }

    #navigate() {
        for (const [idx, value] of this.letters.entries()) {
            value.oninput = () => {
                idx !== this.letters.length &&
                    value.value &&
                    this.letters
                        .slice(idx + 1)
                        .find((x) => !x.readOnly)
                        .focus();
            };

            value.onkeydown = (e) => {
                idx !== 0 &&
                    !value.value &&
                    e.keyCode === 8 &&
                    this.letters
                        .slice(0, idx)
                        .findLast((x) => !x.readOnly)
                        .focus();
            };
        }
    }

    #createWord(word) {
        let group = document.createElement('div');
        group.classList.add('answer__word');

        word.split('')
            .map((letter) => this.#createLetter(letter))
            .forEach((l) => group.appendChild(l));

        return group;
    }

    #createLetter(letter) {
        let l = document.createElement('input');
        l.classList.add('answer__word__letter');
        l.pattern = `[${letter.toUpperCase()}${letter.toLowerCase()}]`;
        l.required = true;
        l.name = `letter${letter}`;
        l.maxLength = 1;
        l.minLength = 1;
        l.setAttribute('aria-label', 'letter');
        this.letters.push(l);
        return l;
    }

    static enumerate(answer) {
        return answer
            .split(/([ -])/)
            .map((x) => {
                switch (x) {
                    case ' ':
                        return ',';
                    case '-':
                        return '-';
                    default:
                        return x.length;
                }
            })
            .join('');
    }
}
