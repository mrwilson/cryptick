import { assert, describe, it } from 'vitest';
import { ClueDecoder } from '../miniclue/decoder.js';

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
});
