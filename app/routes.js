var q = require("q"),
    docker = require("./docker");

var errorPage = function(res) {
  return function(err) {
    res.render('error', {
      reason: err
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
  promise.then(function(data,resp) {
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

function anon(){}

module.exports = {
  dashboard: dashboard,
  containers: anon,
  images: anon,
  containerinfo: anon,
  imageinfo: anon,
  error404: error404
};
