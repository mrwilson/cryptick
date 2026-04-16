import { enumerate, PRNG } from './utils.js';

export class CryptickClue {
    constructor(
        answer,
        clue,
        author,
        hint,
        explanation,
        revealLetter,
        showHint,
        share,
    ) {
        this.answer = answer;
        this.clue = clue;
        this.author = author;
        this.hint = hint;
        this.explanation = explanation;
        this.revealLetter = revealLetter;
        this.showHint = showHint;
        this.share = share;
        this.letters = [];
    }

    renderClue(params) {
        let words = params.answer.split(/[ -]/);

        const maxWordLen = Math.max(...words.map((w) => w.length));
        this.answer.style.setProperty('--max-word-len', maxWordLen);

        this.clue.textContent = `${params.clue} (${enumerate(params.answer)})`;

        if (params.explanation) {
            this.explanation.textContent = `EXPLANATION: ${params.explanation}`;
        }

        if (params.hint) {
            this.hint.textContent = params.hint;
        }

        if (params.author) {
            this.author.textContent = params.author;
        }

        words
            .map((x) => this.#createWord(x))
            .forEach((l) => this.answer.appendChild(l));

        this.#navigate();

        const random = new PRNG(params.clue);

        this.revealLetter.onclick = (_) => {
            let missingLetters = this.letters.filter(
                (letter) =>
                    letter.validity.valueMissing || !letter.validity.valid,
            );

            let letter =
                missingLetters[Math.floor(random() * missingLetters.length)];

            letter.value = letter.pattern[1];
            letter.readOnly = true;
            letter.classList.add('answer__word__letter--revealed');
        };

        this.showHint.addEventListener('click', (_) => {
            this.hint.parentElement.showModal();
        });
    }

    shareMessage(location, clipboard) {
        let message = `⭐️I solved ${this.author.textContent !== '' ? this.author.textContent + "'s" : 'a'} clue on Cryptick!✅\n\n${this.clue.textContent}\n\n${location}`;

        clipboard.writeText(message).then((_) => {
            this.share.textContent = 'Copied to clipboard!';
        });
    }

    #navigate() {
        for (const [idx, value] of this.letters.entries()) {
            value.oninput = () => {
                setTimeout(() => {
                    idx !== this.letters.length &&
                        value.value &&
                        this.letters
                            .slice(idx + 1)
                            .find((x) => !x.readOnly)
                            .focus();
                }, 50);
            };

            value.onkeydown = (e) => {
                setTimeout(() => {
                    idx !== 0 &&
                        !value.value &&
                        e.keyCode === 8 &&
                        this.letters
                            .slice(0, idx)
                            .findLast((x) => !x.readOnly)
                            .focus();
                }, 50);
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
        l.setAttribute('virtualkeyboardpolicy', 'manual');
        this.letters.push(l);
        return l;
    }
}
