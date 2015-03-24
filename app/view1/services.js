/**
 * Created by wilso_000 on 12/10/2014.
 */

angular.module('jobHuntServices',[]).

    factory('jobHuntFactory', function($http,sharedFunc) {
        var urlBase = sharedFunc.getUrl();
        var _jobHuntService = {};

        _jobHuntService.getJobHunts = function() {
            return $http.get(urlBase + "/jobhunts");
        };

        _jobHuntService.getJobHuntByID = function(_jobid) {
            return $http.get(urlBase + "/jobhunts/" + _jobid);
        };

        return _jobHuntService;
    }).


    service('sharedFunc', function() {
        var url = "http://localhost:2595";
        return {
            getUrl: function () {
                return url;
            }
        }
    });

