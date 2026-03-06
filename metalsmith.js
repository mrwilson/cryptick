import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync as exec } from 'node:child_process';
import Metalsmith from 'metalsmith';
import layouts from '@metalsmith/layouts';
import inPlace from '@metalsmith/in-place';
import cotd from './cotd.json' with { type: 'json' };
import { ClueDecoder } from './src/miniclue/decoder.js';

const commitHash = exec('git rev-parse HEAD', { encoding: 'utf-8' }).trim();

const decoder = new ClueDecoder({});

const allClues = Object.keys(cotd).map((date) => {
    let clue = cotd[date];
    let decodedClue = decoder.decode('#' + clue.hash);
    return {
        author_name: clue.author.name,
        author_link: clue.author.link,
        clue: `${decodedClue.clue} (${decodedClue.enumeration})`,
        link: `/clue.html#${clue.hash}`,
        date: date,
    };
});

const today = new Date().toISOString().slice(0, 10);

Metalsmith(dirname(fileURLToPath(import.meta.url)))
    .clean(true)
    .source('./src')
    .destination('./build')
    .metadata({
        commitHash: commitHash,
        commitHash_Short: commitHash.substring(0, 8),
        builtAt: new Date().toISOString(),
        cotd: allClues.find((clue) => clue.date === today),
        clues: allClues.filter((clue) => clue.date <= today),
    })
    .use(function original_filename(files) {
        Object.keys(files).forEach((file) => {
            files[file].original_filename = `src/${file}`;
        });
    })
    .use(
        inPlace({
            transform: 'handlebars',
            pattern: '*.xml',
            extname: '*.xml',
        }),
    )
    .use(
        layouts({
            transform: 'handlebars',
            pattern: '*.html',
            directory: 'layouts',
            default: 'base.html',
            extName: false,
        }),
    )
    .env('DEBUG', '@metalsmith/layouts*')
    .build((err) => {
        if (err) throw err;
    });
