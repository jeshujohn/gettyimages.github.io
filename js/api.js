(function() {
  var app = angular.module('api', []);

  app.directive('searchDemo', function() {
    return {
      restrict: 'E',
      templateUrl: 'search.html'
    }
  });

  app.controller('SearchController', ['$http', '$scope', function($http, $scope) {

    $scope.api_uri = 'https://api.gettyimages.com/v3';
    $scope.request = {
      phrase: 'dog',
      fields: 'id,title,thumb,referral_destinations',
      sort_order: 'best'
    };

    $scope.sort_orders = ['best', 'most_popular', 'newest'];
    $scope.resources = [{
      name: "Search for Images",
      path: "/search/images",
    }, {
      name: "Search for Videos",
      path: "/search/videos",
    }];

    $scope.selected_resource = {
      path: "/search/images"
    };

    $scope.apirequest = function() {
      if ($scope.selected_resource.path === '/search/images') {
        $scope.request.fields = 'id,title,thumb,referral_destinations'
        if (!$scope.request.hasOwnProperty('sort_order')) {
          $scope.request.sort_order = 'best';
        }
      } else if ($scope.selected_resource.path === '/search/videos') {
        delete $scope.request.sort_order;
        $scope.request.fields = 'id,title,thumb'
      }

      return $scope.api_uri + $scope.selected_resource.path + '?' + serialize($scope.request);
    }

    $scope.send = function() {
      $scope.isLoading = true;
      var req = {
        method: 'GET',
        url: $scope.api_uri + $scope.selected_resource.path,
        headers: {
          'Api-Key': '7wjf4bsm2gpahzdm6yetrz2t'
        },
        params: $scope.request
      };

      $http(req).success(function(data, status, headers, config) {
        $scope.isLoading = false;
        $scope.apiresponse = data;
        $scope.responsecode = status;
      }).error(function(data, status, headers, config) {
        $scope.isLoading = false;
        $scope.apiresponse = data;
        $scope.responsecode = status;
      });
    };

    var serialize = function(dictionary) {

      if (!dictionary.phrase) {
        delete dictionary.phrase;
      }

      if (!dictionary.sort_order) {
        delete dictionary.sort_order;
      }

      var query = []
      for (key in dictionary) {
        query.push(key + '=' + dictionary[key]);
      }

      return query.join('&');
    }
  }]);
})();
