const NAV_VERSION = {
  url: "../../data/version.json"
};

export async function loadVersion() {
  const response = await fetch(`${NAV_VERSION.url}?t=${Date.now()}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Version metadata request failed: ${response.status}`);
  }

  return response.json();
}

export function getAssetUrl(path, version) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${encodeURIComponent(version)}`;
}
