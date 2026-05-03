import { ClueDecoder } from '../src/miniclue/decoder.js';
import Handlebars from 'jstransformer-handlebars';
import { readFileSync as read } from 'node:fs';
import { Highlighter } from '../src/miniclue/highlighter.js';
import createMetaImage from './create-meta-image.js';

export default function clueOfTheDay(cotd) {
    const date = new Date();

    console.log(`Running build at ${date}`);

    const day =
        process.env.DAY ||
        `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;

    const decoder = new ClueDecoder({});
    const highlighter = new Highlighter();

    const allClues = Object.keys(cotd.clues)
        .map((date, index) => {
            let clue = cotd.clues[date];
            let decodedClue = decoder.decode('#' + clue);
            let cleanClue = highlighter.process(decodedClue.clue);
            const author = decodedClue.author;

            return {
                id: index,
                author_name: author,
                author_link: cotd.authors[author],
                clue: `${cleanClue.cleaned} (${decodedClue.enumeration})`,
                hash: clue.replaceAll('=', ''),
                date: date,
                dateWithHours: new Date(Date.parse(date)).toISOString(),
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
            (clue) => clue.date <= day,
        );

        todayAndPreviousCotd.forEach(async (cotd) => {
            console.log(`Rendering COTD: ${cotd.date}`);
            files[`cotd/${cotd.date}.html`] = {
                contents: clueOfTheDayTemplate(cotd),
            };

            files[`cotd/img/${cotd.date}.png`] = {
                contents: await createMetaImage(cotd),
            };
        });

        const frontPage = todayAndPreviousCotd.slice(0, 4);
        console.log(frontPage);
        files['index.html'].cotd = frontPage;

        metadata.clues = todayAndPreviousCotd;
    };
}
