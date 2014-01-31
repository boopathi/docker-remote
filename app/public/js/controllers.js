var docker = angular.module('dockerRemote', []);

docker.filter('bytes', function() {
  return function(bytes, precision) {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
    if (bytes === 0) return "0 bytes";
    if (typeof precision === 'undefined') precision = 1;
    var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
      number = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
  };
});

/*
//Alerts Service
docker.factory('alerts', function($rootScope) {
  var alerts = {};
  $rootScope.alerts = [];
  alerts.add = function(type, msg) {
    $rootScope.alerts.push({type: type, msg: msg});
  };
  alerts.close = function(index) {
    $rootScope.alerts.splice(index,1);
  };
  return alerts;
});
*/

/*
 * Not using it now
docker.directive('scroll', function($window) {
  return function(scope, element, attrs) {
    angular.element($window).bind('scroll', function() {
      var nav = $("#dr-static-navbar").parent();
      if(this.pageYOffset >= nav.offset().top) {
        scope.boolNavbarScroll = true;
      } else {
        scope.boolNavbarScroll = false;
      }
      scope.$apply();
    });
  };
});
*/

Controllers = {};

Controllers.Dashboard = function($scope) {
  $scope.info = DATA.info;
  $scope.version = DATA.version;
};

Controllers.ContainersList = function($scope) {
  $scope.TDSIZE = 10;
  $scope.containers = DATA.containers;
};

Controllers.ContainerInfo = function($scope) {
  $scope.cont = DATA;
};

Controllers.ImagesList = function($scope, $http, $timeout) {
  $scope.TDSIZE = 16;
  $scope.images = DATA.images;
  angular.forEach($scope.images, function(e) {
    e.initloading = false;
    e.rmmessage = "";
    e.rmloading = false;
  });
  $scope.loading = false;
  $scope.deleteImage = function(img) {
    img.rmloading = true;
    $http({
      method: "DELETE",
      url: "/image/" + img.Id
    }).success(function(data) {
      var toberemoved = $.grep($scope.images, function(gimg) {
        for(var i=0;i<data.length;i++) {
          var e = data[i];
          if(typeof e.Untagged !== "undefined") {
            if(e.Untagged === gimg.Id) {
              gimg.RepoTags = ["<none>:<none>"];
              continue;
            } 
          } else if(typeof e.Deleted !== "undefined") {
              if(e.Deleted === gimg.Id) return true;
          }
        }
        return false;
      });
      angular.forEach(toberemoved, function(i) {
        $scope.images.splice($scope.images.indexOf(i),1);
      });
      img.rmloading = false;
    }).error(function(data) {
      img.rmmessage = data.desc;
      $timeout(function(){
        img.rmmessage = "";
        img.rmloading = false;
      },1500);
    });
  };
};

Controllers.ImageInfo = function($scope) {
  $scope.image = DATA;
};

//Inject - http://docs.angularjs.org/tutorial/step_05#controller_a-note-on-minification
angular.forEach(Controllers, function(controller, key) {
  controller.$inject = ['$scope', '$http', '$timeout'];
  docker.controller(key,controller);
});


$(function() {
  $("body").scrollspy({
    target: "#sidebar",
    offset: $("#sidebar").outerHeight(true) + 10
  });
});
