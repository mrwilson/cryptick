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
