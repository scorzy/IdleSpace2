const fs = require("fs");
let list = [];
["my", "fa-r", "fa-s"].forEach((nam) => {
  items = fs.readdirSync("./src/assets/" + nam + "/");
  items.forEach((item) => {
    list.push(nam + ":" + item);
  });
});
// items = fs.readdirSync(
//   "./node_modules/@ant-design/icons-angular/src/inline-svg/"
// );
// items.forEach((item) => {
//   list.push(nam + ":" + item);
// });
fs.writeFile(
  "./src/app/model/data/icons.json",
  JSON.stringify(list, null, " "),
  function () {}
);
