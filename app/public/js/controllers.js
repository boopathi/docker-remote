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

//Directive to initialize focus on appear
docker.directive('initFocus', function() {
  var timer;
  return {
    restrict: 'A',
    link: function(scope, elm, attr) {
      scope.$watch(attr.initFocus, function() {
        if(timer) clearTimeout(timer);
        timer = setTimeout(function() {
          elm.focus();
        },0);
      });
    }
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
  //some initializations
  angular.forEach($scope.images, function(e) {
    //tagrepo
    e.trmessage = "";
    e.treditmode = false;
    e.trloading = false;
    //quick spawn container
    e.qsmessage = "";
    e.qsloading = false;
    //remove image
    e.rmmessage = "";
    e.rmloading = false;
  });

  //Tag Image handler
  $scope.showTagger = function(img) {
    img.treditmode = true;
  };
  
  $scope.tagRepo = function(img, repo) {
    img.treditmode = false;
    img.trloading = true; //just in case
    $http({
      method: "POST",
      url: "/image/" + img.Id + "/tag",
      data: {
        repo: img.trnewtag
      }
    }).success(function(data,status){
      img.trloading = false;
      img.RepoTags = [img.trnewtag];
    }).error(function(data,status) {
      img.trmessage = "Failed: " + status;
      $timeout(function() {
        img.trmessage = "";
        img.trloading = false;
      }, 1500);
    });
  };

  //Quick spawn handler
  $scope.quickSpawn = function(img) {
    img.qsloading = true;
    $http({
      method: "POST",
      url: "/image/" + img.Id + "/quickspawn"
    }).success(function(data) {
      img.qsmessage = data.Id;
      img.qsloading = false;
    }).error(function(data) {
      img.qsmessage = "Failed";
      $timeout(function() {
        img.qsmessage = "";
        img.qsloading = false;
      }, 1500);
    });
  };

  //Remove image handler
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
      switch(data.statusCode) {
        case 409: img.rmmessage = "Conflict"; break;
        case 500: img.rmmessage = "Unreachable"; break;
        default: img.rmmessage = "Error " + data.statusCode;
      }
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
