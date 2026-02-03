import { assert, describe, it } from 'vitest';
import { ClueDecoder } from '../miniclue/decoder.js';
import { ClueEncoder } from '../miniclue/encoder.js';

describe('ClueEncoder', () => {
    const decoder = new ClueDecoder({});

    it('can encode clues without hints', () => {
        let encoder = new ClueEncoder(
            { value: 'Incredible pupil' },
            { value: 'eye opening' },
            {},
        );

        assert.deepEqual(decoder.decode(encoder.fragment('')), {
            clue: 'Incredible pupil',
            answer: 'eye opening',
        });
    });

    it('can encode clues with hints', () => {
        let encoder = new ClueEncoder(
            { value: 'Incredible pupil' },
            { value: 'eye opening' },
            { value: 'this is a hint' },
        );

        assert.deepEqual(decoder.decode(encoder.fragment('')), {
            clue: 'Incredible pupil',
            answer: 'eye opening',
            hint: 'this is a hint',
        });
    });

    it('can create copy text', () => {
        let encoder = new ClueEncoder(
            { value: 'Incredible pupil' },
            { value: 'eye opening' },
            {},
        );

        const clue = 'Incredible pupil (3,7)';
        const url =
            'https://example.com/#SW5jcmVkaWJsZSBwdXBpbHxleWUgb3BlbmluZw==';

        assert.equal(
            encoder.copyText('https://example.com/'),
            `${clue}\n\n${url}\n\nSolve it, and create your own!`,
        );
    });
});
