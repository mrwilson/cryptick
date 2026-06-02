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

    const lines = readFileSync('data/pages.csv', 'utf-8').trim().split('\n');

    lines.shift();

    const clues = {};

    lines.forEach((line) => {
        const fields = line.split(',');

        const hash = fields[0].replace('/clue.html', '').replaceAll('=', '');
        const solves = parseInt(fields[1]);

        if (!clues[hash]) {
            clues[hash] = 0;
        }

        clues[hash] += solves;
    });

    metalsmith.metadata().hot_clues = Object.entries(clues)
        .map(([hash, solves]) => {
            let decodedClue = decoder.decode(hash);
            let cleanClue = highlighter.process(decodedClue.clue);
            const author = decodedClue.author;

            return {
                solves: solves,
                author_name: author || 'Anonymous',
                label: `Solved by: ${solves}`,
                clue: `${cleanClue.cleaned} (${decodedClue.enumeration})`,
                hash: hash,
            };
        })
        .sort((a, b) => {
            if (a.solves === b.solves) {
                return b.author_name.localeCompare(a.author_name);
            } else {
                return a.solves - b.solves;
            }
        })
        .reverse()
        .slice(0, 5);
}
