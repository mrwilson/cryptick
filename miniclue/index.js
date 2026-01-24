export class MiniClue {
  constructor(answerElement, clueElement, validateElement) {
    this.answerElement = answerElement;
    this.clueElement = clueElement;
    this.validateElement = validateElement;
    this.letters = [];
  }

  validate() {
    this.answerElement.classList.toggle("validating");
    if (this.answerElement.checkValidity()) {
      this.validateElement.remove();
    }
  }

  renderClue(params) {
    let words = params.answer.split(" ");

    this.clueElement.textContent = `${params.clue} (${words.map((x) => x.length).join(",")})`;

    words
      .map((x) => this.#createWord(x))
      .forEach((l) => this.answerElement.appendChild(l));

    this.#navigate();

    this.validateElement.onclick = (_) => this.validate();
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
    group.classList.add("word");

    word
      .split("")
      .map((letter) => this.#createLetter(letter))
      .forEach((l) => group.appendChild(l));

    return group;
  }

  #createLetter(letter) {
    let l = document.createElement("input");
    l.classList.add("letter");
    l.pattern = `[${letter.toUpperCase()}${letter.toLowerCase()}]`;
    l.required = true;
    l.maxLength = 1;
    l.minLength = 1;
    l.setAttribute("aria-label", "letter");
    this.letters.push(l);
    return l;
  }
}
