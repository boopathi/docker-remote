var q = require("q"),
    docker = require("./docker");

var errorPage = function(res) {
  return function(err) {
    res.render('error', {
      reason: err
    });
  };
};

function dashboard(req, res) {
  promise = docker.getImages();
  promise.then(function(data,resp) {
    res.render('dashboard', {
      title: 'docker-remote | dashboard',
      data: data
    });
  }, errorPage(res));
}

function anon(){}

module.exports = {
  dashboard: dashboard,
  containers: anon,
  images: anon,
  containerinfo: anon,
  imageinfo: anon
};
