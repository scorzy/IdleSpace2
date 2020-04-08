var less = require("less");
var fs = require("fs");
var path = require("path");
var md5 = require("md5");
const fsExtra = require("fs-extra");

var lessOptions = { javascriptEnabled: true, compress: true };
var toBuild = [
  "dark-blue-2",
  "dark-green-2",
  "dark-blue",
  "dark-green",
  "light-blue",
  "light-green"
];
var built = [];

fsExtra.emptyDirSync("./src/assets/themes/");

toBuild.forEach(function (name) {
  fs.readFile("./src/themes/" + name + ".less", function (error, data) {
    data = data.toString();
    less.render(data, lessOptions, function (e, css) {
      // console.log(e);
      var hash = md5(css.css);
      fs.writeFile(
        "./src/assets/themes/" + name + "." + hash + ".css",
        css.css,
        function (err) {
          // console.log(name + " done");
          built.push(name + "." + hash + ".css");
          if (toBuild.length === toBuild.length) {
            fs.writeFile(
              "./src/app/model/data/themes.json",
              JSON.stringify(built, null, " "),
              function () {}
            );
          }
        }
      );
    });
  });
});
