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

docker.controller('Dashboard', function($scope) {
  $scope.info = DATA.info;
  $scope.version = DATA.version;
});

docker.controller('ContainersList', function($scope) {
  $scope.TDSIZE = 10;
  $scope.containers = DATA.containers;
});

docker.controller('ContainerInfo', function($scope) {
  $scope.cont = DATA;
});

docker.controller('ImagesList', function($scope) {
  $scope.TDSIZE = 12;
  $scope.images = DATA.images;
});

docker.controller('ImageInfo', function($scope) {
  $scope.image = DATA;
});
