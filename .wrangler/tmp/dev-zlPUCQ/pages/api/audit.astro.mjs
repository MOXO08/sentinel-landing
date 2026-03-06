globalThis.process ??= {}; globalThis.process.env ??= {};
import module$1 from './../../sentinel_api_bg.zcytxy.wasm';
export { renderers } from '../../renderers.mjs';

/* @ts-self-types="./sentinel_api.d.ts" */

/**
 * Funcție pură wasm_bindgen: primește JSON manifest + JSON reguli, returnează JSON verdict
 * Nicio I/O, nicio rețea — execuție sub 3ms garantată
 * @param {string} manifest_json
 * @param {string} rules_json
 * @returns {string}
 */
function run_audit(manifest_json, rules_json) {
    let deferred3_0;
    let deferred3_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(manifest_json, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(rules_json, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        wasm.run_audit(retptr, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred3_0 = r0;
        deferred3_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred3_0, deferred3_1, 1);
    }
}

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
    };
    return {
        __proto__: null,
        "./sentinel_api_bg.js": import0,
    };
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path);
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead');
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('sentinel_api_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance);
}

const prerender = false;
let wasmInitPromise = null;
async function authenticateRequest(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return { error: "MISSING_API_KEY", status: 401 };
  }
  const apiKey = authHeader.slice(7).trim();
  if (!apiKey) {
    return { error: "MISSING_API_KEY", status: 401 };
  }
  const clientData = await env.CACHE.get(`apikey:${apiKey}`);
  if (!clientData) {
    return { error: "INVALID_API_KEY", status: 401 };
  }
  let client;
  try {
    client = JSON.parse(clientData);
  } catch {
    return { error: "CORRUPTED_KEY_DATA", status: 500 };
  }
  const minuteBucket = Math.floor(Date.now() / 6e4);
  const rlKey = `rl:${client.client_id}:${minuteBucket}`;
  const rpmLimit = client.rpm_limit || 60;
  const currentRPM = parseInt(await env.CACHE.get(rlKey) || "0", 10);
  if (currentRPM >= rpmLimit) {
    return { error: "RATE_LIMIT_EXCEEDED", status: 429, limit: rpmLimit };
  }
  await env.CACHE.put(rlKey, String(currentRPM + 1), { expirationTtl: 90 });
  return { client };
}
const POST = async ({ request, locals }) => {
  const env = locals.runtime.env;
  if (!wasmInitPromise) {
    try {
      wasmInitPromise = __wbg_init(module$1);
    } catch (e) {
      console.error("WASM Init Error:", e);
      throw e;
    }
  }
  await wasmInitPromise;
  const auth = await authenticateRequest(request, env);
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { client } = auth;
  try {
    const manifestText = await request.text();
    let manifest;
    try {
      manifest = JSON.parse(manifestText);
    } catch (e) {
      return new Response(JSON.stringify({ verdict: "INVALID_PAYLOAD" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    manifest.client_id = client.client_id;
    let rulesJson = '{"rules":[]}';
    if (env.CACHE) {
      const cached = await env.CACHE.get("active_rules");
      if (cached) rulesJson = JSON.stringify({ rules: JSON.parse(cached) });
    }
    const verdictText = run_audit(JSON.stringify(manifest), rulesJson);
    let verdict = JSON.parse(verdictText);
    if (verdict.verdict === "NON_COMPLIANT") {
      if (env.DB) await logToD1(env.DB, verdict, client.client_id);
      return new Response(JSON.stringify(verdict), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const response = new Response(JSON.stringify(verdict), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    if (env.DB) {
      await logToD1(env.DB, verdict, client.client_id);
    }
    return response;
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
async function logToD1(db, verdict, clientId) {
  try {
    const isCompliant = verdict.verdict === "COMPLIANT" || verdict.verdict === "COMPLIANT_VIA_AI_REVIEW" ? 1 : 0;
    await db.prepare(
      `INSERT INTO audit_logs (app_name, version, client_id, status, is_compliant, rules_version)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)`
    ).bind(
      verdict.app_name,
      verdict.version,
      clientId || "anonymous",
      verdict.verdict,
      isCompliant,
      verdict.rules_version || "unknown"
    ).run();
  } catch (err) {
    console.error("D1 Insert Error:", err);
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
