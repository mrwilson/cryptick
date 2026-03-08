import { ClueDecoder } from '../src/miniclue/decoder.js';

export default function clueOfTheDay(clues) {
    const today = new Date().toISOString().slice(0, 10);

    const decoder = new ClueDecoder({});

    const allClues = Object.keys(clues).map((date) => {
        let clue = clues[date];
        let decodedClue = decoder.decode('#' + clue.hash);
        return {
            author_name: clue.author.name,
            author_link: clue.author.link,
            clue: `${decodedClue.clue} (${decodedClue.enumeration})`,
            link: `/clue.html?utm_source=rss#${clue.hash}`,
            date: date,
        };
    });

    return function cotd(files, metalsmith) {
        const metadata = metalsmith.metadata();

        metadata.cotd = allClues.find((clue) => clue.date === today);
        metadata.cotd.link = metadata.cotd.link.replace(
            'utm_source=rss',
            'utm_source=cotd',
        );

        metadata.clues = allClues.filter((clue) => clue.date <= today);
    };
}
