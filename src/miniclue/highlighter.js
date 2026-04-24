export class Highlighter {
    constructor(showDefn, showInds, showFods) {
        this.showDefn = showDefn;
        this.showInds = showInds;
        this.showFods = showFods;
    }

    process(clue) {
        let clean = '';

        let fodder = -1;
        let fodders = [];

        let indicator = -1;
        let indicators = [];

        let definitionStart = -1;
        let definition = undefined;

        for (let i = 0, j = 0; i < clue.length; i++) {
            const token = clue.slice(i, i + 2);

            if (token === '((') {
                fodder = j;
                i += 1;
            } else if (token === '))') {
                fodders.push([fodder, j]);
                fodder = -1;
                i += 1;
            } else if (token === '{{') {
                indicator = j;
                i += 1;
            } else if (token === '}}') {
                indicators.push([indicator, j]);
                indicator = -1;
                i += 1;
            } else if (token === '[[' && definition === undefined) {
                definitionStart = j;
                i += 1;
            } else if (token === ']]' && definition === undefined) {
                definition = [definitionStart, j];
                i += 1;
            } else {
                j += 1;
                clean = `${clean}${clue[i]}`;
            }
        }

        return {
            cleaned: clean,
            fodders: fodders,
            indicators: indicators,
            definition: definition,
        };
    }

    render(highlight, clue) {
        let clueBody = clue.firstChild;

        if (highlight.definition?.length !== 0) {
            this.showDefn.addEventListener('click', (_) => {
                CSS.highlights.set(
                    'definition',
                    this.highlight([highlight.definition], clueBody),
                );
                this.showDefn.toggleAttribute('disabled');
            });
        } else {
            this.showDefn.toggleAttribute('disabled');
        }

        if (highlight.fodders?.length !== 0) {
            this.showFods.addEventListener('click', (_) => {
                CSS.highlights.set(
                    'fodders',
                    this.highlight(highlight.fodders, clueBody),
                );
                this.showFods.toggleAttribute('disabled');
            });
        } else {
            this.showFods.toggleAttribute('disabled');
        }

        if (highlight.indicators?.length !== 0) {
            this.showInds.addEventListener('click', (_) => {
                CSS.highlights.set(
                    'indicators',
                    this.highlight(highlight.indicators, clueBody),
                );
                this.showInds.toggleAttribute('disabled');
            });
        } else {
            this.showInds.toggleAttribute('disabled');
        }
    }

    highlight(fragments, clueBody) {
        return new Highlight(
            ...fragments.map((fragment) => {
                let r = new Range();
                r.setStart(clueBody, fragment[0]);
                r.setEnd(clueBody, fragment[1]);
                return r;
            }),
        );
    }
}
