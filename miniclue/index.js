export class MiniClue {
  constructor(
    answerElement,
    clueElement,
    revealLetterElement,
    revealWordElement,
  ) {
    this.answerElement = answerElement;
    this.clueElement = clueElement;
    this.revealLetterElement = revealLetterElement;
    this.revealWordElement = revealWordElement;
    this.letters = [];
  }

  renderClue(params) {
    let words = params.answer.split(" ");

    this.clueElement.textContent = `${params.clue} (${words.map((x) => x.length).join(",")})`;

    words
      .map((x) => this.#createWord(x))
      .forEach((l) => this.answerElement.appendChild(l));

    this.#navigate();

    this.revealWordElement.onclick = (_) => {
      this.letters.forEach((letter) => (letter.value = letter.pattern[1]));
    };

    this.revealLetterElement.onclick = (_) => {
      let missingLetters = this.letters.filter(
        (letter) => letter.validity.valueMissing || !letter.validity.valid,
      );

      let letter =
        missingLetters[Math.floor(Math.random() * missingLetters.length)];

      letter.value = letter.pattern[1];
      letter.classList.readOnly = true;
      letter.classList.add("gtc_answer__word__letter--revealed")
    };
  }

  #navigate() {
    for (let i = 0; i < this.letters.length - 1; i++) {
      const [win1, win2] = this.letters.slice(i, i + 2);

      win1.oninput = (_) => {
        win1.value && win2.focus();
      };
      win2.onkeydown = (e) => {
        !win2.value && e.keyCode === 8 && win1.focus();

        if (i + 1 === this.letters.length - 1 && e.keyCode === 13) {
          this.validate(e);
        }
      };
    }
  }

  #createWord(word) {
    let group = document.createElement("div");
    group.classList.add("gtc_answer__word");

    word
      .split("")
      .map((letter) => this.#createLetter(letter))
      .forEach((l) => group.appendChild(l));

    return group;
  }

  #createLetter(letter) {
    let l = document.createElement("input");
    l.classList.add("gtc_answer__word__letter");
    l.pattern = `[${letter.toUpperCase()}${letter.toLowerCase()}]`;
    l.required = true;
    l.name = `letter${letter}`;
    l.maxLength = 1;
    l.minLength = 1;
    l.setAttribute("aria-label", "letter");
    this.letters.push(l);
    return l;
  }
}
