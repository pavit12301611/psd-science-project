#!/usr/bin/env bash
# Install the published branch for the current user; no sudo is used here.
set -euo pipefail

REPO='pavit12301611/psd-science-project'
BRANCH='arena/d8495a78-psd-science-project'
RAW="https://raw.githubusercontent.com/$REPO/$BRANCH/scripts/install-fedora.sh"
ARCHIVE="https://github.com/$REPO/archive/refs/heads/$BRANCH.tar.gz"
DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}"
INSTALL_DIR="$DATA_HOME/berry-to-current"
BIN_DIR="$HOME/.local/bin"
APPLICATIONS="$DATA_HOME/applications"

if [[ "$(uname -s)" != Linux ]]; then echo 'This installer supports Linux (Fedora 45) only.' >&2; exit 1; fi
for cmd in curl tar node npm; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing $cmd. On Fedora run: sudo dnf install nodejs npm curl tar" >&2; exit 1
  fi
done
if ! node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major > 22 || (major === 22 && minor >= 12) ? 0 : 1)'; then
  echo 'Node.js 22.12 or newer is required. Install a newer Fedora nodejs package first.' >&2; exit 1
fi

mkdir -p "$INSTALL_DIR/releases" "$BIN_DIR" "$APPLICATIONS"
release=$(mktemp -d "$INSTALL_DIR/releases/release.XXXXXXXX")
tmp=$(mktemp -d)
finished=0
cleanup() {
  rm -rf "$tmp"
  if [[ "$finished" == 0 ]]; then rm -rf "$release"; fi
}
trap cleanup EXIT

echo 'Downloading Berry to Current…'
curl --fail --location --silent --show-error "$ARCHIVE" -o "$tmp/source.tar.gz"
tar -xzf "$tmp/source.tar.gz" --strip-components=1 -C "$release"
echo 'Installing dependencies and building the app (this may take a few minutes)…'
(cd "$release" && npm ci --include=dev && npm run build)
# A skipped or failed Electron download must never replace a working installation.
[[ -x "$release/node_modules/electron/dist/electron" ]] || { echo 'Electron binary is missing; installation aborted.' >&2; exit 1; }

# Embed paths as shell-escaped strings, including homes with spaces.
printf '#!/usr/bin/env bash\nexec %q %q "$@"\n' "$INSTALL_DIR/current/node_modules/electron/dist/electron" "$INSTALL_DIR/current" > "$tmp/launcher"
chmod +x "$tmp/launcher"
cat > "$tmp/updater" <<UPDATER
#!/usr/bin/env bash
set -euo pipefail
tmp=\$(mktemp)
trap 'rm -f "\$tmp"' EXIT
curl --fail --location --silent --show-error '$RAW' -o "\$tmp"
bash "\$tmp"
UPDATER
chmod +x "$tmp/updater"
# Desktop Entry Exec quoted-string escaping (not shell escaping).
escaped_launcher=${BIN_DIR//\\/\\\\}
escaped_launcher=${escaped_launcher//\"/\\\"}
escaped_launcher=${escaped_launcher//\$/\\\$}
escaped_launcher=${escaped_launcher//\`/\\\`}
cat > "$tmp/desktop" <<DESKTOP
[Desktop Entry]
Type=Application
Name=Berry to Current
Comment=Dye-sensitized solar cell field guide
Exec="$escaped_launcher/berry-to-current"
Icon=applications-science
Terminal=false
Categories=Education;Science;
DESKTOP

# Switch only after a successful build. Keep previous releases for rollback.
ln -s "$release" "$tmp/current"
mv -Tf "$tmp/current" "$INSTALL_DIR/current"
finished=1
install -m 755 "$tmp/launcher" "$BIN_DIR/berry-to-current"
install -m 755 "$tmp/updater" "$BIN_DIR/berry-to-current-update"
install -m 644 "$tmp/desktop" "$APPLICATIONS/berry-to-current.desktop"
command -v update-desktop-database >/dev/null 2>&1 && update-desktop-database "$APPLICATIONS" || true
echo 'Installed! Open “Berry to Current” from your Applications menu.'
echo "Update later: $BIN_DIR/berry-to-current-update"
echo 'Close and reopen the app after updating. Saved trial readings are kept separately.'
