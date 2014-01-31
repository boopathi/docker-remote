var Q = require("q"),
    _ = require("underscore"),
    docker = require("./docker");

var errorPage = function(res) {
  return function(err) {
    res.status(500);
    res.render('page', {
      title: 'Error!',
      page: '500',
      reason: err.statusCode,
      description: err.desc,
    });
  };
};

function error404(req, res, next) {
  res.status(404);
  if(req.accepts('html')) {
    res.render('page', {
      title: 'Page not Found',
      page: '404',
    });
    return;
  }
  if(req.accepts('json')) {
    res.send({error: "Not Found"});
    return;
  }
  res.type('text').send('Not Found');
}

function dashboard(req, res) {
  var promises = [docker.getInfo(),
           docker.getVersion()];
  Q.all(promises).spread(function(info, version) {
    var data = {
      info: info[0],
      version: version[0]
    };
    res.render('page', {
      title: 'Dashboard',
      page: 'dashboard',
      data: data
    });
  }, errorPage(res)).done();
}

function containers(req,res) {
  var promise = docker.getContainers();
  promise.then(function(data) {
    res.render('page', {
      title: 'Containers',
      page: 'containers',
      data: {
        containers: data[0]
      }
    });
  }, errorPage(res));
}

function containerinfo(req,res) {
  var cid = req.params.containerid;
  var promise = docker.getContainerInfo(cid);
  promise.then(function(data) {
    res.render('page', {
      title: 'Container ' + cid,
      page: 'containerinfo',
      data: data[0]
    });
  }, errorPage(res));
}

function images(req,res) {
  var promise = docker.getImages();
  promise.then(function(data) {
    res.render('page', {
      title: 'Images',
      page: 'images',
      data: {
        images: data[0]
      }
    });
  }, errorPage(res));
}

function imageinfo(req,res) {
  var iid = req.params.imageid;
  var promise = docker.getImageInfo(iid);
  promise.then(function(data) {
    res.render('page', {
      title: 'Image: ' + iid,
      page: 'imageinfo',
      data: data[0]
    });
  }, errorPage(res));
}

function deleteimage(req,res) {
  var iid = req.params.imageid;
  var promise = docker.deleteImage(iid);
  promise.then(function(data) {
    res.send(data[0]);
  }, function(err) {
    res.status(500);
    res.send(err);
  });
}

module.exports = {
  dashboard: dashboard,
  containers: containers,
  images: images,
  containerinfo: containerinfo,
  imageinfo: imageinfo,
  deleteimage: deleteimage,
  error404: error404
};
