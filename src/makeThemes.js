const less = require("less");
const fs = require("fs");
const md5 = require("md5");
const fsExtra = require("fs-extra");
const LessPluginCleanCSS = require("less-plugin-clean-css");
const darkThemeVars = require("ng-zorro-antd/dark-theme");
const compactThemeVars = require("ng-zorro-antd/compact-theme");

const darkCommon = require("./themes-vars/darkCommon.js");
const myDarkVars = require("./themes-vars/myDarkVars.js");
const commonModyVar = require("./themes-vars/commonModyVar");

const toBuild = [
  {
    name: "dark-blue-2",
    modifyVars: {
      ...darkThemeVars,
      ...compactThemeVars,
      ...darkCommon,
      ...myDarkVars,
      ...commonModyVar
    }
  },
  {
    name: "dark-green-2",
    modifyVars: {
      ...darkThemeVars,
      ...compactThemeVars,
      ...darkCommon,
      ...myDarkVars,
      ...commonModyVar
    }
  },
  {
    name: "dark-blue",
    modifyVars: {
      ...darkThemeVars,
      ...compactThemeVars,
      ...darkCommon,
      ...commonModyVar
    }
  },
  {
    name: "dark-green",
    modifyVars: {
      ...darkThemeVars,
      ...compactThemeVars,
      ...darkCommon,
      ...commonModyVar
    }
  },
  {
    name: "light-blue",
    modifyVars: {
      ...compactThemeVars,
      ...commonModyVar
    }
  },
  {
    name: "light-green",
    modifyVars: {
      ...compactThemeVars,
      ...commonModyVar
    }
  }
];
const built = [];
fsExtra.emptyDirSync("./src/assets/themes/");

toBuild.forEach(function (theme) {
  fs.readFile("./src/themes/" + theme.name + ".less", function (error, data) {
    data = data.toString();
    less.render(
      data,
      {
        javascriptEnabled: true,
        compress: true,
        plugins: [new LessPluginCleanCSS({ advanced: true })],
        modifyVars: theme.modifyVars
      },
      function (e, css) {
        var hash = md5(css.css);
        fs.writeFileSync(
          "./src/assets/themes/" + theme.name + "." + hash + ".css",
          css.css
        );
        built.push(theme.name + "." + hash + ".css");
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
