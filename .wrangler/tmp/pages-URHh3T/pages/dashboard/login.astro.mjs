globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, r as renderTemplate, l as renderHead } from '../../chunks/astro/server_C0THm8nM.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const partial = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-wzfo3nmg> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sentinel Dashboard \u2014 Login</title>', `</head> <body data-astro-cid-wzfo3nmg> <div class="card" data-astro-cid-wzfo3nmg> <div class="logo" data-astro-cid-wzfo3nmg>&#x1F6E1;</div> <h1 data-astro-cid-wzfo3nmg>Compliance Dashboard</h1> <p data-astro-cid-wzfo3nmg>Enter your registered email to receive an Automated Compliance Link.</p> <input type="email" id="email" placeholder="you@company.com" autocomplete="email" data-astro-cid-wzfo3nmg> <button id="send-btn" data-astro-cid-wzfo3nmg>Send Magic Link</button> <div id="msg" data-astro-cid-wzfo3nmg></div> </div> <script>
async function requestLink() {
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('msg');
  if (!email) { showMsg('Please enter your email.', false); return; }
  try {
    const r = await fetch('/api/dashboard/auth/request', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email })
    });
    const d = await r.json();
    showMsg(d.message || 'Check your inbox!', true);
  } catch { showMsg('Network error. Please try again.', false); }
}
function showMsg(text, ok) {
  const el = document.getElementById('msg');
  el.textContent = text; el.className = ok ? 'success' : 'error'; el.style.display = 'block';
}
document.getElementById('send-btn').addEventListener('click', requestLink);
document.getElementById('email').addEventListener('keypress', e => { if(e.key==='Enter') requestLink(); });

// Handle error param in URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('error')) {
    showMsg('Error: ' + urlParams.get('error'), false);
}
<\/script> </body></html>`])), renderHead());
}, "D:/AI Act Compliance API/sentinel-landing/src/pages/dashboard/login.astro", void 0);

const $$file = "D:/AI Act Compliance API/sentinel-landing/src/pages/dashboard/login.astro";
const $$url = "/dashboard/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  partial,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
