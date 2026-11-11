/* Click the icon: the game opens in its own window.
   It loads the live site, so every update reaches the extension by itself (no reinstall).
   If the site can't be reached, the copy bundled inside the extension opens instead. */
const LIVE = 'https://shahriar98k.github.io/bame-plastic-web/';
chrome.action.onClicked.addListener(async () => {
  let url = chrome.runtime.getURL('game/index.html');
  try {
    const r = await fetch(LIVE + 'index.html', { method: 'HEAD', cache: 'no-store' });
    if (r.ok) url = LIVE;
  } catch (e) {}
  chrome.windows.create({ url, type: 'popup', width: 1280, height: 720, focused: true });
});
