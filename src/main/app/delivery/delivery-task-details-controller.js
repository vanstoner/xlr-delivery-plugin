export default class deliveryTaskDetailsController {

    constructor($scope, Backend, TasksService, Ids) {
        this._$scope = $scope;

        this._Backend = Backend;
        this._TasksService = TasksService;
        this._Ids = Ids;

        this._components = [];
        this._environments = [];
    }

    $onInit() {
        const task = this._$scope.task;
        if (!this._TasksService.isTaskInProgress(task) && !this._TasksService.isTaskReadOnly(task)) {
            this._loadDeliveryAutocompleteList(task);
        }
    }

    _loadDeliveryAutocompleteList(task) {
        this._components.length = 0;
        this._environments.length = 0;

        const params = {taskId: task.id};
        if (task.scriptDefinitionType == 'delivery.mark' || task.scriptDefinitionType ==  'delivery.unmark') {
            this._Backend.get('api/extension/delivery/components', {params: params}).then(response => this._components = response.data.entity);
            this._Backend.get('api/extension/delivery/environments', {params: params}).then(response => this._environments = response.data.entity);
        }
    }

    static _mapPropertyDefinitions(taskDefinition) {
        if (!taskDefinition) {
            return {};
        }
        return taskDefinition.outputProperties.concat(taskDefinition.inputProperties).reduce(
            (propertiesMap, property) => {
            propertiesMap[property.name] = property;
        return propertiesMap;
    }, {}
    );
    }

    get loadXldAutocompleteList() {
        return (task) => this._loadDeliveryAutocompleteList(task);
    }

    get components() {
        return this._components;
    }

    get environments() {
        return this._environments;
    }

    get properties() {
        return deliveryTaskDetailsController._mapPropertyDefinitions(this._$scope.scriptDefinition);
    }
}
