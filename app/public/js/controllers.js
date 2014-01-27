var docker = angular.module('dockerRemote', []);

docker.controller('ContainersList', function($scope) {
  $scope.TDSIZE = 10;
  $scope.containers = DATA.containers;
});

docker.controller('ImagesList', function($scope) {
  $scope.TDSIZE = 12;
  $scope.images = DATA.images;
});

