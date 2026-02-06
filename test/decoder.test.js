import { assert, describe, it } from 'vitest';
import { ClueDecoder } from '../miniclue/decoder.js';
import { CryptickError } from '../miniclue/errors.js';

describe('ClueDecoder', () => {
    const decoder = new ClueDecoder({
        example: {
            clue: 'example_clue',
            answer: 'example_answer',
        },
    });

    it('can decode json-based clues from hash fragment', () => {
        let input = '#eyJhIjoiZXllIG9wZW5pbmciLCJjIjoiSW5jcmVkaWJsZSBwdXBpbCJ9';

        assert.deepEqual(decoder.decode(input), {
            clue: 'Incredible pupil',
            answer: 'eye opening',
        });
    });

    it('can decode string-based clues from hash fragment', () => {
        let input = '#SW5jcmVkaWJsZSBwdXBpbHxleWUgb3BlbmluZw';

        assert.deepEqual(decoder.decode(input), {
            clue: 'Incredible pupil',
            answer: 'eye opening',
        });
    });

    it('can use provided examples by default', () => {
        let input = '#example';

        assert.deepEqual(decoder.decode(input), {
            clue: 'example_clue',
            answer: 'example_answer',
        });
    });

    it('throws error if input is undefined', () => {
        assert.throws(() => decoder.decode(), CryptickError);
    });

    it('throws error if input is empty', () => {
        assert.throws(() => decoder.decode(''), CryptickError);
    });

    it('throws error if input has a single character', () => {
        assert.throws(() => decoder.decode('a'), CryptickError);
    });

    it('throws error if input has two non-hash characters', () => {
        assert.throws(() => decoder.decode('ab'), CryptickError);
    });
});
