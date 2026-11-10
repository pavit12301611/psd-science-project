# Berry to current — DSSC field guide

A responsive, visual science-project website built with React, TypeScript, Vite and plain CSS. The project is a student-facing guide to a berry-dye-sensitized solar cell (DSSC), with a selectable cell-layer cutaway, a four-stage electron-flow explainer (including Hinglish and judge-ready phrasing), an honest simulated dashboard, an Arduino wiring/data walkthrough, an editable experiment chart, a loaded-voltage power calculator, an expandable build plan, itemized budget and linked science/price sources. Generated images are visual mock-ups only; they are not evidence of a real build or measured output.

## Run locally

```bash
npm install
npm run dev
```

Vite serves the site on `http://localhost:5173` (bound to `0.0.0.0` for the Arena preview). Create a production build with `npm run build`.

## Notes

- The browser dashboard is explicitly a simulation, not a live hardware feed or a performance prediction. The Arduino walkthrough explains the A0 light-sensor / buffered A1 cell-voltage / USB-serial path; the page does not connect to a physical board.
- The dye comparison plot starts empty and only charts readings entered by the student.
- The power calculator accepts measured voltage across a known load and its resistance; it derives current and power from those inputs and does not treat open-circuit voltage as power.
- The INR budget is an estimate. The 15-cell kit is an overseas price reference with an assumed shipping/import allowance; confirm local availability and current vendor prices before purchasing.

## Fedora 45 desktop app

This is the same field guide in an Electron desktop window, with an Applications-menu launcher. The guide and its illustrations work offline after installation; external source links and installation/updates need internet. The dashboard is still a simulation, not a connection to an Arduino.

1. Install the prerequisites once in a terminal:

   ```bash
   sudo dnf install nodejs npm curl tar
   ```

   Node.js 22.12 or newer is required. Electron also needs the normal graphical desktop libraries supplied by Fedora Workstation. The installer does not use sudo and does not change system packages.

2. Download and run the installer as your normal user (do not use sudo):

   ```bash
   curl -fL https://raw.githubusercontent.com/pavit12301611/psd-science-project/arena/d8495a78-psd-science-project/scripts/install-fedora.sh -o /tmp/berry-install.sh && bash /tmp/berry-install.sh
   ```

3. Open **Berry to Current** from the Applications menu, or run `~/.local/bin/berry-to-current`.

To update later, close the app and run:

```bash
~/.local/bin/berry-to-current-update
```

Then reopen the app. The App → How to update menu also shows the command. The updater downloads the installer and source from the same branch above, so it only installs changes **after they are pushed to that branch**. It is a manual update, not an automatic update service. A failed download or build leaves the previous release in place. Earlier releases remain under `${XDG_DATA_HOME:-~/.local/share}/berry-to-current/releases` and can be removed manually when no longer needed.

The three-by-three trial readings are saved locally on this computer and are kept across app updates. They are not synced or backed up; deleting the app's data or using Clear entries removes them. The power calculator, simulated dashboard and budget selections are not saved. Desktop and browser data are separate.

### Uninstall

Remove the launcher, update command, desktop entry and installed releases as your normal user:

```bash
rm -f ~/.local/bin/berry-to-current ~/.local/bin/berry-to-current-update
rm -f "${XDG_DATA_HOME:-$HOME/.local/share}/applications/berry-to-current.desktop"
rm -rf "${XDG_DATA_HOME:-$HOME/.local/share}/berry-to-current"
```

This leaves saved Electron data in `~/.config/Berry to Current` (or under `$XDG_CONFIG_HOME` if set). Remove that directory separately only if you also want to delete your saved readings.

### Developer desktop run

Use `npm ci` followed by `npm run desktop`. Electron downloads its platform binary during `npm ci`, so that step needs internet access. The desktop app uses a stable local `berry://app` origin for its assets and readings, and external web links open in the default browser.
