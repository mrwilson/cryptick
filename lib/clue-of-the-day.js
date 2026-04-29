import { ClueDecoder } from '../src/miniclue/decoder.js';
import Handlebars from 'jstransformer-handlebars';
import { readFileSync as read } from 'node:fs';
import { Highlighter } from '../src/miniclue/highlighter.js';
import createMetaImage from './create-meta-image.js';

export default function clueOfTheDay(cotd) {
    const today = new Date().toISOString().slice(0, 10);

    const decoder = new ClueDecoder({});
    const highlighter = new Highlighter();

    const allClues = Object.keys(cotd.clues)
        .map((date, index) => {
            let clue = cotd.clues[date];
            let decodedClue = decoder.decode('#' + clue);
            let cleanClue = highlighter.process(decodedClue.clue);
            let dateWithHours = new Date(Date.parse(date));
            dateWithHours.setHours(8);
            const author = decodedClue.author;

            return {
                id: index,
                author_name: author,
                author_link: cotd.authors[author],
                clue: `${cleanClue.cleaned} (${decodedClue.enumeration})`,
                hash: clue.replaceAll('=', ''),
                date: date,
                dateWithHours: dateWithHours.toISOString(),
                friendlyDate: new Date(date).toLocaleDateString('en-GB', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                }),
            };
        })
        .reverse();

    return function cotd(files, metalsmith) {
        const metadata = metalsmith.metadata();

        const clueOfTheDayTemplate = Handlebars.compile(
            read('./layouts/cotd.html', 'utf-8'),
        );

        const todayAndPreviousCotd = allClues.filter(
            (clue) => clue.date <= today,
        );

        todayAndPreviousCotd.forEach(async (cotd) => {
            files[`cotd/${cotd.date}.html`] = {
                contents: clueOfTheDayTemplate(cotd),
            };

            files[`cotd/img/${cotd.date}.png`] = {
                contents: await createMetaImage(cotd),
            };
        });

        files['index.html'].cotd = todayAndPreviousCotd.slice(0, 5);

        metadata.clues = todayAndPreviousCotd;
    };
}
