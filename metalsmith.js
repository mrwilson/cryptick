import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Metalsmith from 'metalsmith';
import layouts from '@metalsmith/layouts';
import inPlace from '@metalsmith/in-place';

import cotd from './cotd.json' with { type: 'json' };
import clueOfTheDay from './lib/clue-of-the-day.js';
import versionControl from './lib/version-control.js';
import setUpTemplates from './lib/templates.js';
import hotClues from './lib/hot-clues.js';

Metalsmith(dirname(fileURLToPath(import.meta.url)))
    .clean(true)
    .source('./src')
    .destination('./build')
    .metadata({
        builtAt: new Date().toISOString(),
    })
    .use(
        setUpTemplates({
            header: '_header.html',
            footer: '_footer.html',
            cotd: '_clue_card.html',
            solve: '_solve.html',
        }),
    )
    .use(hotClues)
    .use(versionControl)
    .use(clueOfTheDay(cotd))
    .use(function original_filename(files) {
        Object.keys(files).forEach((file) => {
            files[file].original_filename = `src/${file}`;
        });
    })
    .use(function customMetadata(files) {
        const custom = {
            'trending.html': {
                title: 'Cryptick | Trending Clues',
                description: 'See what clues are being solved right now!',
            },
        };

        Object.keys(files).forEach((file) => {
            files[file].title = custom[file]?.title || 'Cryptick';
            files[file].description =
                custom[file]?.description ||
                'Create a cryptic crossword clue and share it with people you know.';
        });
    })
    .use(
        inPlace({
            transform: 'handlebars',
            pattern: '*.(html|xml)',
            extname: '*.(html|xml)',
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
