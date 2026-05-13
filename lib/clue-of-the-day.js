import { ClueDecoder } from '../src/miniclue/decoder.js';
import Handlebars from 'jstransformer-handlebars';
import { readFileSync as read } from 'node:fs';
import { Highlighter } from '../src/miniclue/highlighter.js';
import { createSocialMetaImage, createMetaImage } from './create-meta-image.js';

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
                id: index + 1,
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
                clue_title:
                    `Clue of the Day #${index + 1}: ` +
                    new Date(date)
                        .toLocaleString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })
                        .replace(',', ''),
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

            files[`cotd/img/${cotd.date}_social.png`] = {
                contents: await createSocialMetaImage(cotd),
            };
        });

        const frontPage = todayAndPreviousCotd.slice(0, 4);
        files['index.html'].cotd = frontPage;

        metadata.clues = todayAndPreviousCotd;
    };
}
