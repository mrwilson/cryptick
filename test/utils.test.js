import { assert, describe, it } from 'vitest';
import { enumerate } from '../src/miniclue/utils.js';

describe('Utils', () => {
    it('can enumerate one word', () => {
        assert.equal(enumerate('AAAA'), '4');
    });
    it('can enumerate multiple words with spaces', () => {
        assert.equal(enumerate('AAA AA'), '3,2');
    });

    it('can enumerate multiple words with spaces and hyphens', () => {
        assert.equal(enumerate('AAA-AA'), '3-2');
    });
});
