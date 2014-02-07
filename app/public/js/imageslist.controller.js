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
      img.qsmessage = data.Id.substring(0,11);
      $timeout(function() {
        img.qsmessage = "";
        img.qsloading = false;
      }, 1500);
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
