

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


// array 
class LocalStorageJSON {
    constructor() {

    }

    set(key, json) {
        localStorage.setItem(key, JSON.stringify(json));
    }

    get(key) {
        const getItem = localStorage.getItem(key)
        if (getItem == null) {
            return []
        }
        return JSON.parse(getItem);
    }


    remove(key) {
        localStorage.removeItem(key);
    }

    exist(key) {
        return this.get(key).length == 0 ? false : true
    }

}

export { LocalStorage, LocalStorageJSON }