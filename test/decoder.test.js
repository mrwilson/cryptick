import { assert, describe, it } from 'vitest';
import { ClueDecoder } from '../src/miniclue/decoder.js';
import { CryptickError } from '../src/miniclue/errors.js';

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

    it('can decode json-based clues from hash fragment with hint', () => {
        let input =
            '#eyJjIjoiSW5jcmVkaWJsZSBwdXBpbCIsImEiOiJleWUgb3BlbmluZyIsImgiOiJUaGlzIGlzIGEgZG91YmxlIGRlZmluaXRpb24ifQ==';

        assert.deepEqual(decoder.decode(input), {
            clue: 'Incredible pupil',
            answer: 'eye opening',
            hint: 'This is a double definition',
        });
    });

    it('can decode json-based clues from hash fragment with explanation', () => {
        let input =
            '#eyJjIjoiSW5jcmVkaWJsZSBwdXBpbCIsImEiOiJleWUgb3BlbmluZyIsImUiOiJJbmNyZWRpYmxlIGlzIGEgc3lub255bSBmb3IgZXllIG9wZW5pbmcsIGFuZCBhIHB1cGlsIGlzIHRoZSBvcGVuaW5nIGluIHRoZSBleWUifQ==';
        assert.deepEqual(decoder.decode(input), {
            clue: 'Incredible pupil',
            answer: 'eye opening',
            explanation:
                'Incredible is a synonym for eye opening, and a pupil is the opening in the eye',
        });
    });

    it('can decode string-based clues from hash fragment', () => {
        let input = '#SW5jcmVkaWJsZSBwdXBpbHxleWUgb3BlbmluZw';

        assert.deepEqual(decoder.decode(input), {
            clue: 'Incredible pupil',
            answer: 'eye opening',
        });
    });

    it('can decode string-based clues from hash fragment with hint', () => {
        let input =
            '#SW5jcmVkaWJsZSBwdXBpbHxleWUgb3BlbmluZ3xUaGlzIGlzIGEgZG91YmxlIGRlZmluaXRpb24';

        assert.deepEqual(decoder.decode(input), {
            clue: 'Incredible pupil',
            answer: 'eye opening',
            hint: 'This is a double definition',
        });
    });

    it('can decode json-based clues from hash fragment with explanation', () => {
        let input =
            '#SW5jcmVkaWJsZSBwdXBpbHxleWUgb3BlbmluZ3x8SW5jcmVkaWJsZSBpcyBhIHN5bm9ueW0gZm9yIGV5ZSBvcGVuaW5nLCBhbmQgYSBwdXBpbCBpcyB0aGUgb3BlbmluZyBpbiB0aGUgZXll';
        assert.deepEqual(decoder.decode(input), {
            clue: 'Incredible pupil',
            answer: 'eye opening',
            explanation:
                'Incredible is a synonym for eye opening, and a pupil is the opening in the eye',
        });
    });

    it('can decode clues with emoji', () => {
        let input =
            '#4p2E77iPK/CflKU98J+Sp3xleGFtcGxlfFRoaXMgaXMgYW4gZXhhbXBsZSBlbW9qaSBjbHVlfFRoaXMgaXMgYW4gZXhhbXBsZSBlbW9qaSBjbHVl';
        assert.deepEqual(decoder.decode(input), {
            clue: '❄️+🔥=💧',
            answer: 'example',
            hint: 'This is an example emoji clue',
            explanation: 'This is an example emoji clue',
        });
    });

    it('can decode clues with emoji', () => {
        let input =
            '#4p2E77iPK/CflKU98J+Sp3xleGFtcGxlfFRoaXMgaXMgYW4gZXhhbXBsZSBlbW9qaSBoaW50fFRoaXMgaXMgYW4gZXhhbXBsZSBlbW9qaSBleHBsYW5hdGlvbg==';
        assert.deepEqual(decoder.decode(input), {
            clue: '❄️+🔥=💧',
            answer: 'example',
            hint: 'This is an example emoji hint',
            explanation: 'This is an example emoji explanation',
        });
    });

    it('can decode hints with emoji', () => {
        let input =
            '#ZXhhbXBsZXxleGFtcGxlfFRoaXMgaXMgYW4gZXhhbXBsZSBlbW9qaSBoaW50IPCflKV8VGhpcyBpcyBhbiBleGFtcGxlIGVtb2ppIGV4cGxhbmF0aW9uIA==';
        assert.deepEqual(decoder.decode(input), {
            clue: 'example',
            answer: 'example',
            hint: 'This is an example emoji hint 🔥',
            explanation: 'This is an example emoji explanation ',
        });
    });

    it('can decode explanations with emoji', () => {
        let input =
            '#ZXhhbXBsZXxleGFtcGxlfFRoaXMgaXMgYW4gZXhhbXBsZSBlbW9qaSBoaW50fFRoaXMgaXMgYW4gZXhhbXBsZSBlbW9qaSBleHBsYW5hdGlvbiDwn5Sl';
        assert.deepEqual(decoder.decode(input), {
            clue: 'example',
            answer: 'example',
            hint: 'This is an example emoji hint',
            explanation: 'This is an example emoji explanation 🔥',
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
