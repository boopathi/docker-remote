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
  promises = [docker.getInfo(),
           docker.getVersion()];
  Q.all(promises).spread(function(info, version) {
    data = {
      info: JSON.parse(info),
      version: JSON.parse(version)
    };
    res.render('page', {
      title: 'Dashboard',
      page: 'dashboard',
      data: data
    });
  }, errorPage(res)).done();
}

function containers(req,res) {
  promise = docker.getContainers();
  promise.then(function(data) {
    c = JSON.parse(data);
    res.render('page', {
      title: 'Containers',
      page: 'containers',
      data: {
        containers: c
      }
    });
  }, errorPage(res));
}

function containerinfo(req,res) {
  cid = req.params.containerid;
  promise = docker.getContainerInfo(cid);
  promise.then(function(data) {
    c = JSON.parse(data);
    res.render('page', {
      title: 'Container ' + cid,
      page: 'containerinfo',
      data: c
    });
  }, errorPage(res));
}

function images(req,res) {
  promise = docker.getImages();
  promise.then(function(data) {
    i = JSON.parse(data);
    res.render('page', {
      title: 'Images',
      page: 'images',
      data: {
        images: i
      }
    });
  }, errorPage(res));
}

function imageinfo(req,res) {
  iid = req.params.imageid;
  promise = docker.getImageInfo(iid);
  promise.then(function(data) {
    i = JSON.parse(data);
    res.render('page', {
      title: 'Image: ' + iid,
      page: 'imageinfo',
      data: i
    });
  }, errorPage(res));
}

module.exports = {
  dashboard: dashboard,
  containers: containers,
  images: images,
  containerinfo: containerinfo,
  imageinfo: imageinfo,
  error404: error404
};
