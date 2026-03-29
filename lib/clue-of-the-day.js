import { ClueDecoder } from '../src/miniclue/decoder.js';
import Handlebars from 'jstransformer-handlebars';
import { readFileSync as read } from 'node:fs';

export default function clueOfTheDay(clues) {
    const today = new Date().toISOString().slice(0, 10);

    const decoder = new ClueDecoder({});

    const allClues = Object.keys(clues)
        .map((date) => {
            let clue = clues[date];
            let decodedClue = decoder.decode('#' + clue.hash);
            let dateWithHours = new Date(Date.parse(date));
            dateWithHours.setHours(13);
            return {
                author_name: clue.author.name,
                author_link: clue.author.link,
                clue: `${decodedClue.clue} (${decodedClue.enumeration})`,
                link: `/clue.html?utm_source=rss#${clue.hash}`,
                hash: clue.hash,
                date: date,
                dateWithHours: dateWithHours.toISOString(),
                friendlyDate: new Date(date).toLocaleDateString('en-GB', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                }),
            };
        })
        .reverse();

    return function cotd(files, metalsmith) {
        const metadata = metalsmith.metadata();

        const temp = Handlebars.compile(read('./layouts/cotd.html', 'utf-8'));

        allClues
            .filter((clue) => clue.date <= today)
            .forEach((cotd) => {
                const newVar = {
                    redirect: cotd.link.replace(
                        'utm_source=rss',
                        'utm_source=cotd_solo',
                    ),
                    ...cotd,
                };
                console.log(newVar);
                files[`cotd/${cotd.date}.html`] = {
                    contents: temp(newVar),
                };
            });

        ['index.html', 'cotd.html']
            .map((page) => files[page])
            .forEach((page) => {
                page.cotd = Object.assign(
                    {},
                    allClues.find((clue) => clue.date === today),
                );
            });

        files['cotd.html'].redirect = files['cotd.html'].cotd.link.replace(
            'utm_source=rss',
            'utm_source=cotd_page',
        );

        files['index.html'].cotd.link = files['index.html'].cotd.link.replace(
            'utm_source=rss',
            'utm_source=front_page',
        );

        metadata.clues = allClues.filter((clue) => clue.date <= today);
    };
}
