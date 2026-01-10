// TODO: bump version when prototype is playable

const LOCAL_VERSION = "0.0.0";
const BUILD_STAGE = "prototype";

document.getElementById("versionLabel").textContent =
  `v${LOCAL_VERSION} (${BUILD_STAGE})`;

fetch("https://allsunshineandrainbows.github.io/Project-ASAR/version.json", {
  cache: "no-store"
})
  .then(res => res.json())
  .then(data => {
    if (data.version !== LOCAL_VERSION) {
      console.log("Update available:", data.version);
    }
  })
  .catch(() => {
    // offline or blocked → ignore
  });
