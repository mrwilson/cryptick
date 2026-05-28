import { Highlighter } from '../src/miniclue/highlighter.js';
import { ClueDecoder } from '../src/miniclue/decoder.js';
import { readFileSync } from 'node:fs';
import { execSync as exec } from 'node:child_process';

export default function hotClues(files, metalsmith) {
    const highlighter = new Highlighter();
    const decoder = new ClueDecoder({});

    const periodBegin =
        process.env.DAY || new Date().toISOString().substring(0, 10);

    console.log(`Downloading stats for week starting ${periodBegin}`);

    exec(`./lib/download-stats.sh ${periodBegin}`);

    const lines = readFileSync('data/pages.csv', 'utf-8').trim().split('\n');

    lines.shift();

    const cluesFromAnalytics = lines.map((line) => {
        let fields = line.split(',');
        return {
            hash: fields[0].replace('/clue.html', '').replaceAll('=', ''),
            solves: fields[1],
        };
    });

    metalsmith.metadata().hot_clues = cluesFromAnalytics
        .map((clue) => {
            let decodedClue = decoder.decode(clue.hash);
            let cleanClue = highlighter.process(decodedClue.clue);
            const author = decodedClue.author;

            return {
                solves: clue.solves,
                author_name: author || 'Anonymous',
                label: `Solved by: ${clue.solves}`,
                clue: `${cleanClue.cleaned} (${decodedClue.enumeration})`,
                hash: clue.hash.replaceAll('=', ''),
            };
        })
        .sort((a, b) => a.solves - b.solves)
        .reverse();
}
