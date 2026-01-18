export class MiniClue {
    constructor(answerElement, validateElement) {
        this.answerElement = answerElement;

        validateElement.onclick = (e) => {
            MiniClue.validate(e, answerElement, validateElement);
        }
    }

    static validate(event, answerElement, validateElement) {
        answerElement.classList.toggle('validating')

        if (answerElement.checkValidity()) {
            validateElement.remove();
        }
    }

    renderClue(params) {
        document.querySelector('meta[name="description"]').setAttribute("content",
            `[BETA] ${params.c}`
        );

        clue.textContent = params.c;

        params.a
            .split('')
            .map(x => MiniClue.#createLetter(x))
            .forEach(l => this.answerElement.appendChild(l));
    }

    static #navigate(element) {
        element.addEventListener("input", (key) => {
            if (element.value.length == 1 && element.nextSibling) {
                if (element.nextSibling.tagName == 'SPAN') {
                    element.nextSibling.nextSibling.focus()
                } else {
                    element.nextSibling.focus()
                }

            }
        });

        element.addEventListener("keydown", (event) => {
            if (element.value.length == 0 && event.keyCode == 8 && element.previousSibling) {
                if (element.previousSibling.tagName == 'SPAN') {
                    element.previousSibling.previousSibling.focus()
                } else {
                    element.previousSibling.focus()
                }
            }
        })

    }

    static #createLetter(letter, idx) {
        if (letter == ' ' || letter == '-') {
            let l = document.createElement('span');
            l.textContent = letter;
            return l;
        }

        let l = document.createElement('input');
        l.classList.add("letter");
        l.pattern = `[${letter.toUpperCase()}${letter.toLowerCase()}]`;
        l.required = true;
        l.maxLength = 1;
        l.minLength = 1;
        MiniClue.#navigate(l);
        return l;
    }

}