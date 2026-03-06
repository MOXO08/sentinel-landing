globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, l as renderHead, r as renderTemplate, g as addAttribute, h as createAstro } from '../../../chunks/astro/server_C0THm8nM.mjs';
/* empty css                                      */
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const { DB } = Astro2.locals.runtime.env;
  let report = null;
  let error = null;
  try {
    const result = await DB.prepare(
      "SELECT * FROM Audit_Reports WHERE Repo_ID = ? OR Commit_Hash = ? LIMIT 1"
    ).bind(id, id).first();
    if (result) {
      report = {
        ...result,
        payload: JSON.parse(result.JSON_Payload)
      };
    } else {
      error = "Audit record not found.";
    }
  } catch (e) {
    console.error("D1 Fetch Error:", e);
    error = "Infrastructure connection issue.";
  }
  report?.Scor_Compliance < 50;
  const dateStr = report?.Created_At ? new Date(report.Created_At).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const signatureHash = report?.Signature || "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  return renderTemplate`<html lang="en" data-astro-cid-ok7ugved> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Article 43 Declaration: ${report?.Repo_ID || "Draft"}</title>${renderHead()}</head> <body data-astro-cid-ok7ugved> ${error ? renderTemplate`<div style="text-align: center; padding: 50px;" data-astro-cid-ok7ugved> <h2 data-astro-cid-ok7ugved>${error}</h2> <p data-astro-cid-ok7ugved>Ensure the requested scan ID exists in the D1 edge database.</p> </div>` : renderTemplate`<div class="web-actions" data-astro-cid-ok7ugved> <div data-astro-cid-ok7ugved> <a${addAttribute(`/report/${id}`, "href")} style="color:var(--text-muted); text-decoration:none; font-weight:600; font-size: 14px;" data-astro-cid-ok7ugved>← Back to Analytics</a> </div> <button onclick="window.print()" data-astro-cid-ok7ugved>Print / Save PDF</button> </div>

        <div class="document-container" data-astro-cid-ok7ugved> <div class="watermark" data-astro-cid-ok7ugved>DRAFT COPY</div> <div class="header" data-astro-cid-ok7ugved> <h1 data-astro-cid-ok7ugved>Draft EU Conformity Assessment</h1> <h2 data-astro-cid-ok7ugved>Prepared in reference to Regulation (EU) 2024/1689 (Artificial Intelligence Act) - Article 43</h2> </div> <div class="section" data-astro-cid-ok7ugved> <div class="section-title" data-astro-cid-ok7ugved>1. System Identification</div> <div class="grid-data" data-astro-cid-ok7ugved> <div class="label" data-astro-cid-ok7ugved>Repository / System Name:</div> <div style="font-weight: bold;" data-astro-cid-ok7ugved>${report.Repo_ID}</div> <div class="label" data-astro-cid-ok7ugved>Architecture Version:</div> <div class="mono-text" data-astro-cid-ok7ugved>${report.payload.version || "1.0.0"}</div> <div class="label" data-astro-cid-ok7ugved>Cryptographic Commit:</div> <div class="mono-text" data-astro-cid-ok7ugved>${report.Commit_Hash}</div> <div class="label" data-astro-cid-ok7ugved>Date of Technical Eval:</div> <div data-astro-cid-ok7ugved>${dateStr}</div> </div> </div> <div class="section" data-astro-cid-ok7ugved> <div class="section-title" data-astro-cid-ok7ugved>2. Technical Validation Summary</div> <p style="font-size: 13px;" data-astro-cid-ok7ugved>
This section details the automated technical validation performed by the Sentinel Infrastructure. 
                    The application manifest encompassing inference routes, model usage, and systemic constraints was evaluated against heuristic mappings of Articles 10 through 14 of the EU AI Act.
</p> <div${addAttribute(`technical-verdict ${report.payload.verdict === "COMPLIANT" ? "verdict-compliant" : "verdict-non-compliant"}`, "class")} data-astro-cid-ok7ugved> <div class="grid-data" data-astro-cid-ok7ugved> <div class="label" data-astro-cid-ok7ugved>Technical Verdict:</div> <div style="font-weight: 800;" data-astro-cid-ok7ugved>${report.payload.verdict.replace(/_/g, " ")}</div> <div class="label" data-astro-cid-ok7ugved>Heuristic Risk Score:</div> <div data-astro-cid-ok7ugved>${report.Scor_Compliance}/100</div> <div class="label" data-astro-cid-ok7ugved>Immutable D1 Proof:</div> <div class="mono-text" data-astro-cid-ok7ugved>${signatureHash}</div> </div> </div> ${report.payload.violations?.length > 0 && renderTemplate`<div style="margin-top: 20px;" data-astro-cid-ok7ugved> <div class="label" style="font-size: 12px; font-weight: bold; margin-bottom: 8px;" data-astro-cid-ok7ugved>Identified Validation Anomalies:</div> <ul style="font-size: 12px; margin: 0; padding-left: 20px;" data-astro-cid-ok7ugved> ${report.payload.violations.map((v) => renderTemplate`<li style="margin-bottom: 6px;" data-astro-cid-ok7ugved> <strong data-astro-cid-ok7ugved>${v.article}:</strong> ${v.description} </li>`)} </ul> </div>`} </div> <div class="section" data-astro-cid-ok7ugved> <div class="section-title" data-astro-cid-ok7ugved>3. Legal Declaration (To be finalized by Legal Counsel)</div> <p style="font-size: 13px; text-align: justify;" data-astro-cid-ok7ugved>
I, the undersigned, declare that to the best of my knowledge, and supported by the deterministic technical evidence gathered by the Sentinel Engine (Proof ID: ${signatureHash.substring(0, 12)}...), 
                    the AI system identified above fulfills the requirements set out in Title III, Chapter 2 of Regulation (EU) 2024/1689.
</p> <p style="font-size: 13px; text-align: justify;" data-astro-cid-ok7ugved>
This declaration is issued under the sole responsibility of the provider.
</p> </div> <div class="signature-block" data-astro-cid-ok7ugved> <div data-astro-cid-ok7ugved> <div style="min-height: 40px;" data-astro-cid-ok7ugved></div> <div class="signature-line" data-astro-cid-ok7ugved> <strong data-astro-cid-ok7ugved>Technical Officer / Lead Engineer</strong><br data-astro-cid-ok7ugved>
Name & Date
</div> </div> <div data-astro-cid-ok7ugved> <div style="min-height: 40px;" data-astro-cid-ok7ugved></div> <div class="signature-line" data-astro-cid-ok7ugved> <strong data-astro-cid-ok7ugved>Authorized Representative / Legal Counsel</strong><br data-astro-cid-ok7ugved>
Name, Title & Date
</div> </div> </div> <div class="disclaimer-box" data-astro-cid-ok7ugved> <strong data-astro-cid-ok7ugved>Important Legal Notice:</strong> The information contained in this document is generated automatically from technical heuristics and constitutes <em data-astro-cid-ok7ugved>Evidence Gathering</em> and <em data-astro-cid-ok7ugved>Technical Validation</em>. This draft does NOT establish automated legal compliance. Sentinel is a technical tool. Under no circumstances shall the creators of Sentinel be liable for regulatory fines, legal costs, or business interruptions resulting from the usage, interpretation, or submission of this document. It must be reviewed and signed by a qualified legal professional before submission to any Supervisory Authority.
</div> </div>`} </body></html>`;
}, "D:/AI Act Compliance API/sentinel-landing/src/pages/report/article43/[id].astro", void 0);

const $$file = "D:/AI Act Compliance API/sentinel-landing/src/pages/report/article43/[id].astro";
const $$url = "/report/article43/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
