'use strict';

var jobHuntApp = angular.module('myApp.view1', ['ngRoute','jobHuntServices'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/view1', {templateUrl: 'view1/view1.html', controller: 'View1Ctrl'}).
        when('/manageJob/:_jobID', {templateUrl: 'view1/manageJob.html', controller: 'manageJobHuntCtrl'});
}]);

jobHuntApp.controller('View1Ctrl', function($scope, $http, $modal, $log, sharedFunc, jobHuntFactory) {
    var app = this;
    var url = sharedFunc.getUrl();

    jobHuntFactory.getJobHunts().then(function(data) {
        app.jobhunts = data.data;
    });

    $scope.openDeleteConfirm = function (size,_jobID) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalJobHuntCtrl',
            size: size,
            resolve: {
                _jobID: function () {
                    return _jobID;
            }
          }
        });

        modalInstance.result.then(function (jobHunts) {
            app.jobhunts = jobHunts;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };



})

.controller('ModalJobHuntCtrl', function ($scope, $http, $modalInstance, _jobID, sharedFunc,jobHuntFactory) {

  var url = sharedFunc.getUrl();

  $scope.ok = function () {
    $http.delete(url + "/deleteJobhunt/" + _jobID).success(function () {
        jobHuntFactory.getJobHunts().then(function(data) {
            $modalInstance.close(data.data);
        });
    });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

})
;

