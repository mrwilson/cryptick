export function enumerate(answer) {
    return answer
        .split(/([ -])/)
        .map((x) => {
            switch (x) {
                case ' ':
                    return ',';
                case '-':
                    return '-';
                default:
                    return x.length;
            }
        })
        .join('');
}

export function PRNG(seed) {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
    }

    return function () {
        let t = (hash += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
