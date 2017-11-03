import deliveryTaskDetailsController from "./delivery/delivery-task-details-controller";
import deliveryConflictController from './delivery/delivery-conflict-controller'

const module = angular.module('extension.delivery', []);

deliveryTaskDetailsController.$inject = ['$scope', 'Backend', 'TasksService'];
deliveryConflictController.$inject = ['Backend'];

module.controller('xlrelease.delivery.deliveryTaskDetailsController', deliveryTaskDetailsController);
module.controller('xlrelease.delivery.deliveryConflictController', deliveryConflictController);
