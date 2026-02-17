import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Metalsmith from 'metalsmith';

Metalsmith(dirname(fileURLToPath(import.meta.url)))
    .clean(true)
    .source('./src')
    .destination('./build')
    .build((err) => {
        if (err) throw err;
    });
