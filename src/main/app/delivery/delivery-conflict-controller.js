export default class deliveryConflictController {

    constructor(Backend) {
        this._Backend = Backend;
        this._all_mark_tasks = [];
    }

    $onInit() {
        this._loadDeliveryTasks();
        }

    _loadDeliveryTasks() {
        this._Backend.get('api/extension/delivery/conflicts').then(response => this._all_mark_tasks = response.data.entity);
    }

    get gridOptions() {
        allMarkTasks = this._all_mark_tasks;
        const filterHeaderTemplate = `<div data-ng-include="partials/releases/grid/templates/name-filter-template.html"></div>`;
        var columnDefs = [
            {
                displayName: "Environment",
                field: "environment",
                cellTemplate: "static/@project.version@/include/delivery/grid/delivery-environment-cell-template.html",
                filterHeaderTemplate: filterHeaderTemplate,
                enableColumnMenu: false,
                width: '30%'
            },
            {
                displayName: "Component",
                field: "component",
                cellTemplate: "static/@project.version@/include/delivery/grid/delivery-component-cell-template.html",
                filterHeaderTemplate: filterHeaderTemplate,
                enableColumnMenu: false,
                width: '35%'
            },
            {
                displayName: "Start",
                field: "start",
                cellTemplate: "static/@project.version@/include/delivery/grid/delivery-start-cell-template.html",
                filterHeaderTemplate: filterHeaderTemplate,
                enableColumnMenu: false,
                width: '15%'
            },
            {
                displayName: "End",
                field: "end",
                cellTemplate: "static/@project.version@/include/delivery/grid/delivery-end-cell-template.html",
                filterHeaderTemplate: filterHeaderTemplate,
                enableColumnMenu: false,
                width: '15%'
            },
            {
                displayName: "Conflict",
                field: "conflict",
                cellTemplate: "static/@project.version@/include/delivery/grid/delivery-conflict-cell-template.html",
                filterHeaderTemplate: filterHeaderTemplate,
                enableColumnMenu: false,
                width: '5%'
            }
        ];
        return {
            enableSorting: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            data: allMarkTasks,
            enableFiltering: true,
            enableColumnResize: true,
            columnDefs: columnDefs
        };
    }


}
