import { Highlighter } from '../src/miniclue/highlighter.js';
import { ClueDecoder } from '../src/miniclue/decoder.js';
import { readFileSync } from 'node:fs';
import { execSync as exec } from 'node:child_process';

export default function hotClues(files, metalsmith) {
    if (process.env.SKIP_HOT_CLUES) {
        metalsmith.metadata().hot_clues = [];
        return;
    }

    const highlighter = new Highlighter();
    const decoder = new ClueDecoder({});

    const periodBegin =
        process.env.DAY || new Date().toISOString().substring(0, 10);

    console.log(`Downloading stats for week starting ${periodBegin}`);

    exec(`./lib/download-stats.sh ${periodBegin}`);

    const clues = readFileSync('data/pages.csv', 'utf-8')
        .trim()
        .split('\n')
        .slice(1)
        .filter((line) => line.startsWith('/clue.html'))
        .map((line) => line.split(','))
        .map(([hash, solves]) => [
            hash.substring(10).replaceAll('=', ''),
            parseInt(solves),
        ])
        .reduce((acc, [hash, solves]) => {
            acc[hash] = (acc[hash] || 0) + solves;
            return acc;
        }, {});

    metalsmith.metadata().hot_clues = Object.entries(clues)
        .map(([hash, solves]) => {
            let decodedClue = decoder.decode(hash);
            let cleanClue = highlighter.process(decodedClue.clue);
            const author = decodedClue.author;

            return {
                solves: solves,
                author_name: author || 'Anonymous',
                clue: `${cleanClue.cleaned} (${decodedClue.enumeration})`,
                hash: hash,
            };
        })
        .filter((clue) => clue.author_name !== 'Wildvale')
        .sort((a, b) => {
            if (a.solves === b.solves) {
                return b.author_name.localeCompare(a.author_name);
            } else {
                return a.solves - b.solves;
            }
        })
        .reverse()
        .slice(0, 10);
}
