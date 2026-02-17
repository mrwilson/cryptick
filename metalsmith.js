import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Metalsmith from 'metalsmith';
import layouts from '@metalsmith/layouts';

Metalsmith(dirname(fileURLToPath(import.meta.url)))
    .clean(true)
    .source('./src')
    .destination('./build')
    .use(
        layouts({
            transform: 'handlebars',
            pattern: 'about.html',
            default: 'base.html',
            extName: false,
        }),
    )
    .env('DEBUG', '@metalsmith/layouts*')
    .build((err) => {
        if (err) throw err;
    });
