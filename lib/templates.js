import Handlebars from 'handlebars';
import { readFileSync as read } from 'node:fs';

export default function setUpTemplates(templates) {
    return function () {
        for (const [partial, template] of Object.entries(templates)) {
            Handlebars.registerPartial(
                partial,
                read(`partials/${template}`, 'utf-8'),
            );
        }
    };
}
