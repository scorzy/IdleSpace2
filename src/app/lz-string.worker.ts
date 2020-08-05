/// <reference lib="webworker" />

import * as LZString from "lz-string";

addEventListener("message", ({ data }) => {
  if ("a" in data && data.a === "c") {
    data.m = LZString.compressToEncodedURIComponent(data.m);
  } else {
    data.m = LZString.decompressFromEncodedURIComponent(data.m);
  }
  postMessage(data);

  data = null;
});
