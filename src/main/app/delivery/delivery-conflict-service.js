export default class ConflictService {
    constructor (Backend) {
        this._backend = Backend;
    }

    get() {
        return this._backend.get('api/extension/delivery/conflicts').then(response => response.data.entity);
    }
}

ConflictService.$inject = ["Backend"];