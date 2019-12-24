var less = require("less");
var fs = require("fs");
var path = require("path");

var lessOptions = { javascriptEnabled: true, compress: true };
var toBuild = ["dark-blue", "dark-green", "light-blue", "light-green"];

toBuild.forEach(function(name) {
  fs.readFile("./src/themes/" + name + ".less", function(error, data) {
    data = data.toString();
    less.render(data, lessOptions, function(e, css) {
      // console.log(e);
      fs.writeFile("./src/assets/" + name + ".css", css.css, function(err) {
        console.log(name + " done");
      });
    });
  });
});
