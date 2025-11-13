"""Streamlit entry-point to showcase the RKH CCP fallback web experience.

Run locally with:
    streamlit run streamlit_app.py

Use the sidebar to point asset links (PDFs, images) at a publicly available base URL
when deploying to Streamlit Cloud so items like reference guides continue to open.
"""
from __future__ import annotations

import json
import os
from pathlib import Path

import streamlit as st
from streamlit.components.v1 import html as render_html

st.set_page_config(page_title="RKH's Content Creation Program", layout="wide")

ROOT_DIR = Path(__file__).parent.resolve()


@st.cache_data(show_spinner=False)
def _load_text(relative_path: str) -> str:
    """Read a text asset from the repository, raising a helpful error if missing."""
    asset_path = ROOT_DIR / relative_path
    if not asset_path.exists():
        raise FileNotFoundError(f"Required asset not found: {relative_path}")
    return asset_path.read_text(encoding="utf-8")


def _prepare_script_source(relative_path: str) -> str:
    """Return script content safe to embed inside an inline <script> tag."""
    try:
        raw = _load_text(relative_path)
    except FileNotFoundError as exc:
        st.error(str(exc))
        st.stop()
    return raw.replace("</script>", "<\\/script>")


def _normalise_asset_base(base: str) -> str:
    base = base.strip()
    if not base:
        return ""
    if not base.endswith("/"):
        base = f"{base}/"
    return base


fallback_bundle = _prepare_script_source("fallback-bundle.js")
tactics_config = _prepare_script_source("src/config/tactics.js")
gemini_config = _prepare_script_source("configure_gemini_aq.js")

# Resolve default asset base from environment/secrets/query parameter.
default_asset_base = os.environ.get("ASSET_BASE_URL", "")
if not default_asset_base:
    default_asset_base = st.secrets.get("asset_base_url", "")
query_params = st.experimental_get_query_params()
if "asset_base" in query_params:
    default_asset_base = query_params["asset_base"][-1]

st.sidebar.header("Asset Hosting")
st.sidebar.write(
    "Provide a fully qualified base URL where the app's asset files (for example PDFs) "
    "are hosted. Leave blank to use the local assets directory when running locally."
)
asset_base_input = st.sidebar.text_input("Asset base URL", value=default_asset_base)
asset_base = _normalise_asset_base(asset_base_input)

if asset_base:
    st.sidebar.success(f"Asset links will resolve via: {asset_base}")
else:
    st.sidebar.info("Using relative 'assets/' paths (works when running locally).")

fallback_literal = json.dumps(fallback_bundle)
tactics_literal = json.dumps(tactics_config)
gemini_literal = json.dumps(gemini_config)
asset_literal = json.dumps(asset_base)

app_html = f"""<!DOCTYPE html>
<html lang=\"en\" class=\"h-full\">
<head>
<meta charset=\"utf-8\"/>
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/>
<title>RKH's Content Creation Program</title>
<style>
html, body {{ height: 100%; margin: 0; padding: 0; background: #f3f4f6; font-family: 'Inter', system-ui, sans-serif; }}
#app {{ min-height: 100vh; }}
.loading-screen {{ position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: #ffffff; z-index: 999; flex-direction: column; gap: 12px; }}
.loading-spinner {{ width: 48px; height: 48px; border-radius: 50%; border: 4px solid #bfdbfe; border-top-color: #2563eb; animation: spin 0.8s linear infinite; }}
.loading-text {{ color: #1f2937; font-weight: 600; }}
.loading-subtext {{ color: #6b7280; font-size: 0.875rem; }}
@keyframes spin {{ to {{ transform: rotate(360deg); }} }}
</style>
</head>
<body class=\"h-full m-0 p-0\">
<div id=\"loading-screen\" class=\"loading-screen\">
  <div class=\"loading-spinner\"></div>
  <div class=\"loading-text\">Loading Content Creation Program...</div>
  <div class=\"loading-subtext\" id=\"loading-progress\">Initializing...</div>
</div>
<div id=\"app\" class=\"h-full\"></div>
<script>
if (typeof window === 'undefined') {{
  window = {{}};
}}
if (typeof window.process === 'undefined') {{
  window.process = {{ env: {{}} }};
}}
const FALLBACK_BUNDLE_SOURCE = {fallback_literal};
const TACTICS_SOURCE = {tactics_literal};
const GEMINI_SOURCE = {gemini_literal};
const ASSET_BASE_URL = {asset_literal};
function injectInlineScript(source) {{
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.text = source;
  document.head.appendChild(script);
  return script;
}}
function bootFallback() {{
  console.log('[Streamlit Host] Injecting fallback runtime.');
  injectInlineScript(FALLBACK_BUNDLE_SOURCE);
  setTimeout(() => injectInlineScript(TACTICS_SOURCE), 200);
  setTimeout(() => injectInlineScript(GEMINI_SOURCE), 500);
}}
if (ASSET_BASE_URL) {{
  window.__ASSET_BASE_URL__ = ASSET_BASE_URL;
  const originalOpen = typeof window.open === 'function' ? window.open.bind(window) : null;
  window.open = function(path, target, features) {{
    if (typeof path === 'string' && path.startsWith('assets/')) {{
      const rewritten = ASSET_BASE_URL + path.replace(/^assets\\//, '');
      if (originalOpen) {{
        return originalOpen(rewritten, target, features);
      }}
      return null;
    }}
    if (originalOpen) {{
      return originalOpen(path, target, features);
    }}
    return null;
  }};
}}
document.addEventListener('DOMContentLoaded', () => {{
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {{
    loadingScreen.style.display = 'flex';
  }}
  bootFallback();
}});
</script>
</body>
</html>"""

st.title("RKH's Content Creation Program")
st.caption("Streamlit wrapper that embeds the existing fallback runtime for easy sharing.")

render_html(app_html, height=900, scrolling=True)

st.markdown(
    """
    **Deployment tips**
    - Run `streamlit run streamlit_app.py` locally during development.
    - When deploying to Streamlit Cloud, place any downloadable assets (for example PDFs)
      somewhere publicly accessible and set the **Asset base URL** sidebar field to point to it.
    - Optional query parameter: append `?asset_base=https://example.com/assets/` to the app URL
      to preconfigure the asset routing for viewers.
    """
)
