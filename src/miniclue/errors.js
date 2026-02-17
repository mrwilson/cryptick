export default class ErrorHandler {
    bind(window) {
        window.addEventListener('error', this.handler(window));
    }

    handler(window) {
        return (errorEvent) => {
            if (errorEvent.error instanceof CryptickError) {
                window.location.replace('./error.html');
            }
            return false;
        };
    }
}

export class CryptickError extends Error {}
