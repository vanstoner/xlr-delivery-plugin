import deliveryTaskDetailsController from "./delivery/delivery-task-details-controller";
import deliveryConflictController from './delivery/delivery-conflict-controller';
import ConflictService from "./delivery/delivery-conflict-service";

const module = angular.module('extension.delivery', []);

deliveryTaskDetailsController.$inject = ['$scope', 'Backend', 'TasksService'];
module.controller('xlrelease.delivery.deliveryTaskDetailsController', deliveryTaskDetailsController);

module.service('ConflictService', ConflictService);

deliveryConflictController.$inject = ['$scope', 'ConflictService'];
module.controller('xlrelease.delivery.deliveryConflictController', deliveryConflictController);
