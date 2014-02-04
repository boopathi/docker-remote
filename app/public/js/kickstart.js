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
