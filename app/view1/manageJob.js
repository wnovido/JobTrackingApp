/**
 * Created by wilso_000 on 12/12/2014.
 */
'use strict';

jobHuntApp.controller('manageJobHuntCtrl', function ($scope, $http, $modal, $routeParams, $timeout, sharedFunc, jobHuntFactory) {
    var app = this;
    var url = sharedFunc.getUrl();
    $scope.shouldBeOpen = true;


    if ($routeParams._jobID == 0) {
        $scope.paramFlag = "Add";
        $scope.jobHuntInfo = {};
    }
    else {
        $scope.paramFlag = "Update";
        //Get jobhunt info by id and bind to $scope.jobHuntInfo
        jobHuntFactory.getJobHuntByID($routeParams._jobID).then(function(data) {
            $scope.jobHuntInfo = data.data;
        });
    }

    function loadCompanies() {
        $http.get(url + "/references", {params: {Group :   'Company'}}).success(function (reference) {
            app.companies = reference;
        });
    }

    loadCompanies();


    function loadContacts() {
        $http.get(url + "/contacts").success(function (contacts) {
            app.contacts = contacts;
        });
    }

    loadContacts();


    function loadPositions() {
        $http.get(url + "/references", {params: {Group :   'Position'}}).success(function (reference) {
            app.positions = reference;
        });
    }

    loadPositions();


    function loadSources() {
        $http.get(url + "/references", {params: {Group :   'Source'}}).success(function (reference) {
            app.sources = reference;
        });
    }

    loadSources();


    function loadStatus() {
        $http.get(url + "/references", {params: {Group :   'Status'}}).success(function (reference) {
            app.status = reference;
        });
    }

    loadStatus();







    app.manageJobhunt = function () {
        if ($routeParams._jobID == 0)
            $http.post(url + "/addJobhunt", {
                dateApplied : $scope.jobHuntInfo.dateApplied,
                company     : $scope.jobHuntInfo.company,
                position    : $scope.jobHuntInfo.position,
                source      : $scope.jobHuntInfo.source,
                contact     : $scope.jobHuntInfo.contact,
                status     : $scope.jobHuntInfo.status
            }).success(function () {
                window.history.back()
            });
        else
            $http.put(url + "/updateJobhunt/" + $routeParams._jobID, {
                dateApplied :   $scope.jobHuntInfo.dateApplied,
                company     :   $scope.jobHuntInfo.company,
                position    :   $scope.jobHuntInfo.position,
                source      :   $scope.jobHuntInfo.source,
                contact     :   $scope.jobHuntInfo.contact,
                status     : $scope.jobHuntInfo.status
            }).success(function()  {
                window.history.back();
            });
    };

    $scope.back = function () {
        window.history.back()
    };



    $scope.maxDate = new Date();

    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.openCalendar = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];




    $scope.openContact = function () {

        var modalInstance = $modal.open({
            templateUrl: 'manageContact.html',
            controller: 'ContactModalInstanceCtrl',
            size: 'lg',
            resolve: {
                _contacts: function () {
                    return app.contacts;
                }
            }
        });

        modalInstance.result.then(function (allContacts) {
            app.contacts = allContacts;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };





    $scope.openReferenceManager = function (Group) {
        var modalInstance = $modal.open({
            templateUrl: 'manageReference.html',
            controller: 'ReferenceModalInstanceCtrl',
            size: 'md',
            resolve: {
                _group: function () {
                    return Group;
                },
                _reference: function () {
                    switch (Group) {
                        case 'Status':
                            return app.status;
                            break;
                        case 'Source':
                            return app.sources;
                            break;
                        case 'Position':
                            return app.positions;
                            break;
                        case 'Company':
                            return app.companies;
                            break;
                    }
                }
            }
        });

        modalInstance.result.then(function (_res) {
            switch (Group) {
                case 'Status':
                    app.status = _res;
                    break;
                case 'Source':
                    app.sources = _res;
                    break;
                case 'Position':
                    app.positions = _res;
                    break;
                case 'Company':
                    app.companies = _res;
                    break;
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

})




.controller('ContactModalInstanceCtrl', function ($scope, $modalInstance, $http, sharedFunc, _contacts) {
    $scope._contacts = _contacts;
    var url = sharedFunc.getUrl();
    $scope.shouldBeOpen = true;

    $scope.ok = function () {
        $http.post(url + "/addContact", {
                contactName     :   $scope.contactInfo.name,
                contactEmail    :   $scope.contactInfo.eMail,
                contactPhone    :   $scope.contactInfo.phone
            }).success(function() {
                $http.get(url + "/contacts").success(function (contacts) {
                    $scope._contacts = contacts;
                    $scope.shouldBeOpen = true;
                    $scope.contactInfo = {};
                });
        });
    };

    $scope.cancel = function () {
        $modalInstance.close($scope._contacts);
    };
})







.controller('ReferenceModalInstanceCtrl', function ($scope, $modalInstance, $http, $modal, sharedFunc, _group, _reference) {
    $scope._reference = _reference;
    $scope._group =_group;
    $scope.shouldBeOpen = true;

    var url = sharedFunc.getUrl();

    $scope.ok = function () {
        $http.post(url + "/addReference", {
            Group   :   _group,
            Name    :   $scope.referenceName
        }).success(function(data, status, headers, config) {
            $http.get(url + "/references", {params: {Group :   _group}}).success(function (reference) {
                $scope._reference= reference;
                $scope.referenceName = '';
                $scope.shouldBeOpen = true;
            });
            $scope.error = data;
            //$scope.s = status;
            //$scope.h = headers;
            //$scope.c = config;
        });
    };

    $scope.cancel = function () {
        $modalInstance.close($scope._reference);
    };


    $scope.openDeleteConfirm = function (size,_id,_group) {
        var modalInstance = $modal.open({
            templateUrl: 'deleteConfirm.html',
            controller: 'ModalDeleteCtrl',
            size: size,
            resolve: {
                _id: function () {
                    return _id;
                },
                _group: function () {
                    return _group;
                }
            }
        });

        modalInstance.result.then(function (_res) {
            $scope._reference = _res;
            $scope.referenceName = '';
            $scope.shouldBeOpen = true;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


    $scope.getNewName = function ($event) {
        $scope.newName = $event.target.value.trim();
    };

    $scope.updateReference = function (i,_group) {
        var _t = $scope._reference[i];

        $http.put(url + "/updateReference/" + _t._id, {
                Name: $scope.newName
        }).success(function () {
            $http.get(url + "/references", {params: {Group :   _group}}).success(function (reference) {
                $scope._reference = reference;
            });
        });
    };

})



.controller('ModalDeleteCtrl', function ($scope, $http, $modalInstance, sharedFunc, _id, _group) {
    var url = sharedFunc.getUrl();

    $scope.ok = function () {
        $http.delete(url + "/deleteReference/" + _id).success(function () {
            $http.get(url + "/references", {params: {Group :   _group}}).success(function (reference) {
                $modalInstance.close(reference);
            });
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

})


;


