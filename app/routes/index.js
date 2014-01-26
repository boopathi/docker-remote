var images = require("./images"),
    containers = require("./containers");

function dashboard() {

}

module.exports = {
  dashboard: dashboard,
  containers: containers.index,
  images: images.index,
  imageinfo: images.imageinfo,
  containerinfo: containers.containerinfo
}
