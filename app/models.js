"use strict";

var _ = require("underscore"),
    Backbone = require("backbone");

var Image = Backbone.Model.extend({
  parent: function() {
    return Images.get(this.get('parent'));
  }
});

var Images = Backbone.Collection.extend({
  model: Image
});

var Container = Backbone.Model.extend({});

var Containers = Backbone.Collection.extend({
  model: Container
});

module.exports = {
  Image: Image,
  Images: Images,
  Container: Container,
  Containers: Containers
};
