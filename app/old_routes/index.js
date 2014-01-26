var images = require("./images"),
    containers = require("./containers"),
    q = require("q"),
    docker = require("../docker");

var errorPage = function(res) {
  return function(err) {
    res.render('error', {
      reason: err
    });
  };
};

function dashboard(req, res) {
  containerPromise = docker.getImages();
  containerPromise.then(function(data,resp) {
    res.render('dashboard', {
      title: 'docker-remote',
      data: data
    });
  }, errorPage(res) );
}

module.exports = {
  dashboard: dashboard,
  containers: containers.index,
  images: images.index,
  imageinfo: images.imageinfo,
  containerinfo: containers.containerinfo
};
