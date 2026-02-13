import { assert, describe, it } from 'vitest';
import { ClueDecoder } from '../miniclue/decoder.js';
import { CreateCryptick } from '../miniclue/create.js';

describe('ClueEncoder', () => {
    const decoder = new ClueDecoder({});

    it('can encode clues without hints', () => {
        let encoder = new CreateCryptick(
            { value: 'Incredible pupil' },
            { value: 'eye opening' },
            {},
            {},
        );

        assert.deepEqual(decoder.decode(encoder.fragment('')), {
            clue: 'Incredible pupil',
            answer: 'eye opening',
        });
    });

    it('can encode clues with hints', () => {
        let encoder = new CreateCryptick(
            { value: 'Incredible pupil' },
            { value: 'eye opening' },
            { value: 'this is a hint' },
            {},
        );

        assert.deepEqual(decoder.decode(encoder.fragment('')), {
            clue: 'Incredible pupil',
            answer: 'eye opening',
            hint: 'this is a hint',
        });
    });

    it('can encode clues with explanations', () => {
        let encoder = new CreateCryptick(
            { value: 'Incredible pupil' },
            { value: 'eye opening' },
            {},
            { value: 'this is an explanation' },
        );

        assert.deepEqual(decoder.decode(encoder.fragment('')), {
            clue: 'Incredible pupil',
            answer: 'eye opening',
            explanation: 'this is an explanation',
        });
    });

    it('can create copy text', () => {
        let encoder = new CreateCryptick(
            { value: 'Incredible pupil' },
            { value: 'eye opening' },
            {},
            {},
        );

        const clue = 'Incredible pupil (3,7)';
        const url =
            'https://example.com/#SW5jcmVkaWJsZSBwdXBpbHxleWUgb3BlbmluZ3x8';

        assert.equal(
            encoder.copyText('https://example.com/'),
            `${clue}\n\n${url}\n\nSolve it, and create your own!`,
        );
    });

    it('can create share data', () => {
        let encoder = new CreateCryptick(
            { value: 'Incredible pupil' },
            { value: 'eye opening' },
            {},
            {},
        );

        assert.deepEqual(encoder.shareData('https://example.com/'), {
            title: 'Cryptick',
            text: 'Incredible pupil (3,7)\n\n',
            url: 'https://example.com/#SW5jcmVkaWJsZSBwdXBpbHxleWUgb3BlbmluZ3x8',
        });
    });
});
