const less = require("less");
const fs = require("fs");
const md5 = require("md5");
const fsExtra = require("fs-extra");
const LessPluginCleanCSS = require("less-plugin-clean-css");
const darkThemeVars = require("ng-zorro-antd/dark-theme");
// const compactThemeVars = require("./themes-vars/myCompactVar.js");
const compactThemeVars = require("ng-zorro-antd/compact-theme");

const aliyunTheme = require("@ant-design/aliyun-theme").default;

const darkCommon = require("./themes-vars/darkCommon.js");
const myDarkVars = require("./themes-vars/myDarkVars.js");
const commonModyVar = require("./themes-vars/commonModyVar");

const smallText = {
  "@font-size-sm": "12px",
  "@font-size-base": "12px"
};
const colors = [
  { name: "blue", vars: null },
  {
    name: "green",
    vars: {
      "@primary-color": "@green-6"
    }
  },
  {
    name: "cyan",
    vars: {
      "@primary-color": "@cyan-6"
    }
  },
  {
    name: "geekblue",
    vars: {
      "@primary-color": "@geekblue-6"
    }
  },
  {
    name: "purple",
    vars: {
      "@primary-color": "@purple-6"
    }
  },
  {
    name: "volcano",
    vars: {
      "@primary-color": "@volcano-6"
    }
  },
  {
    name: "orange",
    vars: {
      "@primary-color": "@orange-6"
    }
  }
];

const base = [
  {
    name: "dark-blue-2",
    source: "dark-blue-2",
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
    source: "dark-blue",
    modifyVars: {
      ...darkThemeVars,
      ...compactThemeVars,
      ...darkCommon,
      ...commonModyVar
    }
  },
  {
    name: "light-blue",
    source: "light-blue",
    modifyVars: {
      ...compactThemeVars,
      ...commonModyVar
    }
  },
  {
    name: "aliyun-blue",
    source: "light-blue",
    modifyVars: {
      ...compactThemeVars,
      ...aliyunTheme,
      ...commonModyVar
    }
  }
];

const toBuild = [];
base.forEach((theme) => {
  // toBuild.push(theme);
  colors.forEach((color) => {
    const newTheme = {};
    newTheme.name = theme.name.replace("blue", color.name);
    newTheme.source = theme.source;
    newTheme.modifyVars = { ...theme.modifyVars, ...color.vars };
    toBuild.push(newTheme);
    if (!theme.name.includes("aliyun")) {
      const smallNew = {};
      smallNew.name = newTheme.name + "-small";
      smallNew.source = newTheme.source;
      smallNew.modifyVars = { ...newTheme.modifyVars, ...smallText };
      toBuild.push(smallNew);
    }
  });
});

const built = [];
fsExtra.emptyDirSync("./src/assets/themes/");
let i = 0;
const nThread = 8;

function render(i) {
  let theme = toBuild[i];
  fs.readFile("./src/themes/" + theme.source + ".less", function (error, data) {
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
        // console.log(e);
        var hash = md5(css.css);
        fs.writeFileSync(
          "./src/assets/themes/" + theme.name + "." + hash + ".css",
          css.css
        );
        built.push(theme.name + "." + hash + ".css");
        if (i + nThread < toBuild.length) render(i + nThread);
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
}
for (let thread = 0; thread < nThread; thread++) {
  setTimeout(() => render(thread));
}
