import { battle } from "./model/battle/battle";

/// <reference lib="webworker" />

addEventListener("message", ({ data }) => {
  let response = battle(data);
  postMessage(response);

  response = null;
  data = null;
});
