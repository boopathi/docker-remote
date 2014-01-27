var q = require("q"),
    docker = require("./docker");

var errorPage = function(res) {
  return function(err) {
    res.status(500);
    res.render('page', {
      title: 'Unable to connect Docker',
      page: '500',
      reason: "Unable to connect Docker",
      description: err,
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
  promise = docker.getImages();
  promise.then(function(data) {
    images = JSON.parse(data);
    res.render('page', {
      title: 'Dashboard',
      page: 'dashboard',
      data: {
        images: images.length
      }
    });
  }, errorPage(res));
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

function anon(){}

module.exports = {
  dashboard: dashboard,
  containers: containers,
  images: images,
  containerinfo: anon,
  imageinfo: anon,
  error404: error404
};
