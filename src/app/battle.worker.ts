import { battle } from "./model/battle/battle";

/// <reference lib="webworker" />

addEventListener("message", ({ data }) => {
  const response = battle(data);
  postMessage(response);
});
