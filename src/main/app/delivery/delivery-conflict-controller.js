export default class deliveryConflictController {

    constructor($scope, ConflictService) {
        this._scope = $scope;
        this.conflictService = ConflictService;
        this.lastUpdated = new Date();
        this.initConflictData();
    }

    initConflictData() {
        this.conflictService.get().then((data) => {
            this._scope.myData = data;
            this.lastUpdated = new Date();
        });
    }


}