/// <reference lib="webworker" />

addEventListener("message", ({ data }) => {
  if ("a" in data && data.a === "c") {
    data.m = LZString.compressToEncodedURIComponent(data.m);
  } else {
    data.m = LZString.decompressFromEncodedURIComponent(data.m);
  }
  postMessage(data);
});
