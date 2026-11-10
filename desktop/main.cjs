const { app, BrowserWindow, dialog, Menu, net, protocol, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

// A stable, secure origin keeps localStorage independent of the installed release path.
protocol.registerSchemesAsPrivileged([{ scheme: 'berry', privileges: { standard: true, secure: true, supportFetchAPI: true } }]);
app.setName('Berry to Current');
const root = path.resolve(__dirname, '..', 'dist');

function openExternal(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') shell.openExternal(url);
  } catch { /* Ignore malformed links. */ }
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1280, height: 850, minWidth: 360, minHeight: 500,
    backgroundColor: '#f2f0e8', title: 'Berry to Current',
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true },
  });
  window.webContents.setWindowOpenHandler(({ url }) => { openExternal(url); return { action: 'deny' }; });
  window.webContents.on('will-navigate', (event, url) => {
    const target = new URL(url);
    if (target.protocol !== 'berry:' || target.host !== 'app') { event.preventDefault(); openExternal(url); }
  });
  window.loadURL('berry://app/index.html');
}

app.whenReady().then(() => {
  protocol.handle('berry', (request) => {
    const url = new URL(request.url);
    if (url.host !== 'app') return new Response('Not found', { status: 404 });
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { return new Response('Bad request', { status: 400 }); }
    const file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + path.sep)) return new Response('Forbidden', { status: 403 });
    return net.fetch(pathToFileURL(file).toString());
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'App', submenu: [
      { label: 'How to update', click: () => dialog.showMessageBox({ type: 'info', title: 'Update Berry to Current', message: 'To install the latest published version, close this app and run:', detail: '~/.local/bin/berry-to-current-update\n\nYour saved trial readings stay on this computer.' }) },
      { type: 'separator' }, { role: 'quit' },
    ] },
    { label: 'View', submenu: [{ role: 'reload' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { role: 'togglefullscreen' }] },
  ]));
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
