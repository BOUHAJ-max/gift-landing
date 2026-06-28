import json
import os
import shutil
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
AUTH_FILE = ROOT / ".local-auth.json"
CONFIG_FILE = ROOT / "config.json"
HOST = "127.0.0.1"
PORT = 8000


def find_git_executable():
    candidates = []
    if os.name == "nt":
        candidates.extend([
            r"C:\Program Files\Git\bin\git.exe",
            r"C:\Program Files\Git\cmd\git.exe",
            r"C:\Program Files\Git\mingw64\bin\git.exe",
        ])
    git_path = shutil.which("git")
    if git_path:
        candidates.append(git_path)
    for candidate in candidates:
        if candidate and os.path.exists(candidate):
            return candidate
    return None


def load_saved_auth():
    if not AUTH_FILE.exists():
        return {}
    try:
        return json.loads(AUTH_FILE.read_text(encoding="utf-8"))
    except Exception:
        return {}


def save_auth(data):
    AUTH_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")


def read_json_body(handler):
    content_length = int(handler.headers.get("Content-Length", "0"))
    if content_length <= 0:
        return {}
    body = handler.rfile.read(content_length).decode("utf-8")
    try:
        return json.loads(body) or {}
    except Exception:
        return {}


class LocalHandler(BaseHTTPRequestHandler):
    server_version = "RewardLocal/1.0"

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "http://127.0.0.1:8000")
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_text(self, status, text):
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _is_local_request(self):
        return self.client_address[0] in {"127.0.0.1", "::1", "localhost"}

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "http://127.0.0.1:8000")
        self.send_header("Access-Control-Allow-Credentials", "true")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/health":
            self._send_json(200, {"ok": True, "service": "reward-local"})
            return

        if parsed.path.startswith("/api/"):
            self._send_json(404, {"ok": False, "error": "Not found"})
            return

        safe_path = parsed.path.strip("/") or "index.html"
        if safe_path.startswith("..") or "/.." in safe_path:
            self._send_text(403, "Forbidden")
            return
        target = (ROOT / safe_path).resolve()
        try:
            target.relative_to(ROOT)
        except ValueError:
            self._send_text(403, "Forbidden")
            return

        if target.is_dir():
            target = target / "index.html"

        if not target.exists():
            self._send_text(404, "Not Found")
            return

        content_type = "text/html; charset=utf-8"
        if target.suffix == ".css":
            content_type = "text/css; charset=utf-8"
        elif target.suffix == ".js":
            content_type = "application/javascript; charset=utf-8"
        elif target.suffix == ".json":
            content_type = "application/json; charset=utf-8"
        elif target.suffix == ".svg":
            content_type = "image/svg+xml"
        elif target.suffix == ".png":
            content_type = "image/png"

        data = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/set-credentials":
            if not self._is_local_request():
                self._send_json(403, {"ok": False, "error": "Local only"})
                return
            body = read_json_body(self)
            password = (body.get("password") or "").strip()
            secret = (body.get("secret") or "").strip()
            if not password or not secret:
                self._send_json(400, {"ok": False, "error": "Both fields are required"})
                return
            save_auth({"password": password, "secret": secret})
            self._send_json(200, {"ok": True, "message": "Local credentials saved"})
            return

        if parsed.path == "/api/publish":
            if not self._is_local_request():
                self._send_json(403, {"ok": False, "error": "Local only"})
                return
            body = read_json_body(self)
            saved_auth = load_saved_auth()
            password = (body.get("password") or "").strip()
            secret = (body.get("secret") or "").strip()
            if not saved_auth or password != saved_auth.get("password") or secret != saved_auth.get("secret"):
                self._send_json(401, {"ok": False, "error": "Unauthorized"})
                return

            config = body.get("config")
            if not config:
                self._send_json(400, {"ok": False, "error": "Missing config payload"})
                return

            CONFIG_FILE.write_text(json.dumps(config, indent=2), encoding="utf-8")

            git_exe = find_git_executable()
            if not git_exe:
                self._send_json(500, {"ok": False, "error": "Git is not available on this machine"})
                return

            status = subprocess.run([git_exe, "status", "--porcelain"], cwd=str(ROOT), capture_output=True, text=True, check=False)
            if status.stdout.strip():
                subprocess.run([git_exe, "add", "config.json"], cwd=str(ROOT), check=False)
                commit = subprocess.run([git_exe, "commit", "-m", "Publish landing updates from local dashboard"], cwd=str(ROOT), capture_output=True, text=True, check=False)
                if commit.returncode != 0:
                    self._send_json(500, {"ok": False, "error": commit.stderr.strip() or "Commit failed"})
                    return
                push = subprocess.run([git_exe, "push", "origin", "main"], cwd=str(ROOT), capture_output=True, text=True, check=False)
                if push.returncode != 0:
                    self._send_json(500, {"ok": False, "error": push.stderr.strip() or "Push failed"})
                    return
                self._send_json(200, {"ok": True, "message": "Published to GitHub successfully"})
                return

            self._send_json(200, {"ok": True, "message": "No changes to publish"})
            return

        self._send_json(404, {"ok": False, "error": "Not found"})


def main():
    server = ThreadingHTTPServer((HOST, PORT), LocalHandler)
    print(f"Listening on http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
