import { ClueDecoder } from '../src/miniclue/decoder.js';

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
                date: dateWithHours.toISOString(),
                friendlyDate: dateWithHours.toLocaleDateString('en-GB', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                }),
            };
        })
        .reverse();

    return function cotd(files, metalsmith) {
        const metadata = metalsmith.metadata();

        ['index.html', 'cotd.html']
            .map((page) => files[page])
            .forEach((page) => {
                page.cotd = Object.assign(
                    {},
                    allClues.find((clue) => clue.date.slice(0, 10) === today),
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

        metadata.clues = allClues.filter(
            (clue) => clue.date.slice(0, 10) <= today,
        );
    };
}
