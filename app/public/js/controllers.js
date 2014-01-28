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

Controllers.ImagesList = function($scope, $http) {
  $scope.TDSIZE = 16;
  $scope.images = DATA.images;
  angular.forEach($scope.images, function(e) {
    e.initloading = false;
    e.rmloading = false;
  });
  $scope.loading = false;
  $scope.deleteImage = function(img) {
    img.rmloading = true;
    $http({
      method: "DELETE",
      url: "/image/" + img.Id
    }).success(function(data) {
      $scope.images.splice($scope.images.indexOf(img), 1); 
      img.rmloading = false;
    }).error(function(data) {
      console.log("error : ", data);
      img.rmloading = false;
    });
  };
};

Controllers.ImageInfo = function($scope) {
  $scope.image = DATA;
};

//Inject - http://docs.angularjs.org/tutorial/step_05#controller_a-note-on-minification
angular.forEach(Controllers, function(controller, key) {
  controller.$inject = ['$scope', '$http'];
  docker.controller(key,controller);
});
