import { ClueDecoder } from '../src/miniclue/decoder.js';
import Handlebars from 'jstransformer-handlebars';
import { readFileSync as read } from 'node:fs';

export default function clueOfTheDay(clues) {
    const today = new Date().toISOString().slice(0, 10);

    const decoder = new ClueDecoder({});

    const allClues = Object.keys(clues)
        .map((date, index) => {
            let clue = clues[date];
            let decodedClue = decoder.decode('#' + clue.hash);
            let dateWithHours = new Date(Date.parse(date));
            dateWithHours.setHours(13);
            return {
                id: index,
                author_name: clue.author.name,
                author_link: clue.author.link,
                clue: `${decodedClue.clue} (${decodedClue.enumeration})`,
                hash: clue.hash.replace('=', ''),
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

        todayAndPreviousCotd.forEach((cotd) => {
            files[`cotd/${cotd.date}.html`] = {
                contents: clueOfTheDayTemplate(cotd),
            };
        });

        files['index.html'].cotd = todayAndPreviousCotd.slice(0, 3);

        metadata.clues = todayAndPreviousCotd;
    };
}
