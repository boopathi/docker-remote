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

docker.directive('statusIcon', function() {
  return {
    restrict: 'E',
    template: $("#container-state").html(),
    link: function(scope, elm, attr) {
      var s = scope.cont.Status.split(/ /);
      if(s[0] === "Exit") {
        scope.cont.IsRunning = false;
      } else if(s[0] === "Up") {
        scope.cont.IsRunning = true;
      } else {
        console.log("Unresolved case");
        scope.cont.IsRunning = false;
      }
    },
  };
});

docker.filter('shortShellCommand', function() {
  return function(command, maxlen) {
    if(typeof maxlen === "undefined") maxlen = 20;
    var cmdarr = command.split(/ /);
    if(cmdarr[0] === "/bin/sh") cmdarr.splice(0,1);
    for(var i=0;i<cmdarr.length;i++) {
      if(cmdarr[i][0] !== '-') break;
      cmdarr[i] = ''; //because splice changes the length of the array
    }
    return cmdarr.join(' ').substring(0,maxlen);
  };
});

/*
docker.filter('containerStatus', function() {
  return function(statusString) {
    var str = statusString.split();
    if(str[0].toLowerCase() === 'Exit'.toLowerCase())
      return "hi";
    return "<b>asdfasDF</b>";
  };
});
*/

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

