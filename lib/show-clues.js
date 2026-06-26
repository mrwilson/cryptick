import { ClueDecoder } from '../src/miniclue/decoder.js';
import { Highlighter } from '../src/miniclue/highlighter.js';
import cotd from '../cotd.json' with { type: 'json' };

const decoder = new ClueDecoder({});
const highlighter = new Highlighter();

console.table(
    Object.keys(cotd.clues).map((date, index) => {
        let clue = cotd.clues[date];
        let decodedClue = decoder.decode('#' + clue);
        let cleanClue = highlighter.process(decodedClue.clue);
        const author = decodedClue.author;

        return {
            id: index + 1,
            clue: cleanClue.cleaned,
            author: author,
        };
    }),
);
