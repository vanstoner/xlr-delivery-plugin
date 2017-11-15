export default class deliveryConflictController {

    constructor($scope, ConflictService) {
        this._scope = $scope;
        this.conflictService = ConflictService;
        this.lastUpdated = new Date();
        this.initConflictData();
        $scope.gridOptions = {
            enableFiltering: true,
            data: 'myData',
            columnDefs: [
                { name: 'Conflict', field: 'conflict', cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.conflict"><i class="risk-critical-icon"></i></div><div class="ui-grid-cell-contents" ng-if="!row.entity.conflict"><i class="risk-ok-icon"></i></div>' },
                { name: 'Environment', field: 'environment' },
                { name: 'Component', field: 'component' },
                { name: 'Release', field: 'releaseTitle', cellTemplate: '<div class="ui-grid-cell-contents"><span><a data-ng-if="row.entity.releaseTitle" data-ng-href="{{row.entity.releaseLink}}">{{ row.entity.releaseTitle }}</a></span></div>' },
                { name: 'Start', field: 'start'},
                { name: 'Stop', field: 'stop' }
            ]
        };
    }

    initConflictData() {
        this.conflictService.get().then((data) => {
            this._scope.myData = data;
            this.lastUpdated = new Date();
        });
    }


}