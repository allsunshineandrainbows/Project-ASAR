// TODO: bump version when prototype is playable

const LOCAL_VERSION = "0.1.0";
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

  async function checkForUpdate() {
  try {
    const response = await fetch(
      "https://allsunshineandrainbows.github.io/Project-ASAR/version.json",
      { cache: "no-store" } // prevents browser caching
    );

    if (!response.ok) return;

    const onlineData = await response.json();
    const onlineVersion = onlineData.version;

    if (onlineVersion !== LOCAL_VERSION) {
      showUpdateNotice(onlineVersion);
    }
  } catch (err) {
    // Offline or blocked — silently ignore
  }
}

checkForUpdate();

function showUpdateNotice(onlineVersion) {
  const banner = document.createElement("div");

  banner.innerHTML = `
    <div style="margin-bottom:6px;">
      New version available: <strong>v${onlineVersion}</strong>
    </div>
    <a
      href="https://github.com/allsunshineandrainbows/Project-ASAR/releases/latest"
      target="_blank"
      style="
        color:#4af;
        text-decoration:none;
        font-weight:bold;
      "
    >
      Download update
    </a>
  `;

  banner.style.position = "fixed";
  banner.style.bottom = "12px";
  banner.style.left = "50%";
  banner.style.transform = "translateX(-50%)";
  banner.style.background = "#111";
  banner.style.color = "#fff";
  banner.style.padding = "10px 14px";
  banner.style.borderRadius = "8px";
  banner.style.fontFamily = "sans-serif";
  banner.style.fontSize = "14px";
  banner.style.zIndex = "9999";

  document.body.appendChild(banner);
}
