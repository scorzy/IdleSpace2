const less = require("less");
const fs = require("fs");
const md5 = require("md5");
const fsExtra = require("fs-extra");
const LessPluginCleanCSS = require("less-plugin-clean-css");
const darkThemeVars = require("ng-zorro-antd/dark-theme");
// const compactThemeVars = require("./themes-vars/myCompactVar.js");
const compactThemeVars = require("ng-zorro-antd/compact-theme");

const aliyunTheme = require("@ant-design/aliyun-theme").default;
// const aliyunTheme = require("ng-zorro-antd/ng-zorro-antd.aliyun.less").default;

const darkCommon = require("./themes-vars/darkCommon.js");
const myDarkVars = require("./themes-vars/myDarkVars.js");
const commonModyVar = require("./themes-vars/commonModyVar");
const commonCompVar = require("./themes-vars/commonCompVar");

const smallText = {
  "@font-size-sm": "12px",
  "@font-size-base": "12px"
};
const normalText = {
  "@font-size-sm": "14px",
  "@font-size-base": "14px"
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
      ...darkCommon,
      ...myDarkVars,
      ...commonModyVar,
      ...normalText
    }
  },
  {
    name: "dark-blue",
    source: "dark-blue",
    modifyVars: {
      ...darkThemeVars,
      ...darkCommon,
      ...commonModyVar,
      ...normalText
    }
  },
  {
    name: "light-blue",
    source: "light-blue",
    modifyVars: {
      ...commonModyVar,
      ...normalText
    }
  },
  {
    name: "aliyun-blue",
    source: "light-blue",
    modifyVars: {
      ...aliyunTheme,
      ...normalText,
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
    const commonVars = { ...theme.modifyVars, ...color.vars };
    newTheme.modifyVars = {
      ...commonVars,
      ...compactThemeVars,
      ...commonCompVar
    };
    toBuild.push(newTheme);

    const smallNew = {};
    smallNew.name = newTheme.name + "-small";
    smallNew.source = newTheme.source;
    smallNew.modifyVars = {
      ...commonVars,
      ...compactThemeVars,
      ...commonCompVar,
      ...smallText
    };
    toBuild.push(smallNew);

    const smallCompNew = {};
    smallCompNew.name = newTheme.name + "-small-large";
    smallCompNew.source = newTheme.source;
    smallCompNew.modifyVars = {
      ...commonVars,
      ...smallText
    };
    toBuild.push(smallCompNew);

    const compactNew = {};
    compactNew.name = newTheme.name + "-large";
    compactNew.source = newTheme.source;
    compactNew.modifyVars = {
      ...commonVars
    };
    toBuild.push(compactNew);
  });
});

const built = [];
fsExtra.emptyDirSync("./src/assets/themes/");

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
        if (i + 1 < toBuild.length) render(i + 1);
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

setTimeout(() => render(0), 0);
