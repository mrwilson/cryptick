import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync as exec } from 'node:child_process';
import Metalsmith from 'metalsmith';
import layouts from '@metalsmith/layouts';

Metalsmith(dirname(fileURLToPath(import.meta.url)))
    .clean(true)
    .source('./src')
    .destination('./build')
    .metadata({
        commitHash: exec('git rev-parse HEAD', { encoding: 'utf-8'}).trim(),
        builtAt: new Date().toISOString()
    })
    .use(function original_filename(files) {
        Object.keys(files).forEach((file) => {
            files[file].original_filename = `src/${file}`;
        });
    })
    .use(
        layouts({
            transform: 'handlebars',
            pattern: '*.html',
            default: 'base.html',
            extName: false,
        }),
    )
    .env('DEBUG', '@metalsmith/layouts*')
    .build((err) => {
        if (err) throw err;
    });
