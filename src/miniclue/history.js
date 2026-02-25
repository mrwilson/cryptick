export class History {
    constructor(storage) {
        this.storage = storage;
    }

    get() {
        const store = this.storage.getItem('cryptick');

        if (store === undefined || store === null) {
            return [];
        }

        try {
            const parse = JSON.parse(store);
            return parse.history || [];
        } catch (e) {
            return [];
        }
    }

    add(hash) {
        let history = this.get();

        const position = history.indexOf(hash);

        if (position !== -1) {
            history.splice(position, 1);
        }

        history.push(hash);

        history = history.slice(Math.max(0, history.length - 10));

        this.storage.setItem('cryptick', JSON.stringify({ history: history }));
    }
}
