

class LocalStorage {
    constructor() {

    }

    set(key, value) {
        localStorage.setItem(key, value);
    }

    get(key) {
        return localStorage.getItem(key);
    }

    remove(key) {
        localStorage.removeItem(key);
    }

    exist(key) {
        return this.get(key) == null ? false : true
    }
}

export { LocalStorage }