// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/_astro/*",
    "/.assetsignore",
    "/docs.css",
    "/favicon.ico",
    "/favicon.svg",
    "/robots.txt",
    "/sitemap.xml",
    "/images/developer-plan.png",
    "/images/enterprise-plan.png",
    "/images/pro-plan.png",
    "/legal/*"
  ]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "D:\\AI Act Compliance API\\sentinel-landing\\.wrangler\\tmp\\pages-URHh3T\\bundledWorker-0.7521691693921932.mjs";
import { isRoutingRuleMatch } from "D:\\AI Act Compliance API\\sentinel-landing\\node_modules\\wrangler\\templates\\pages-dev-util.ts";
export * from "D:\\AI Act Compliance API\\sentinel-landing\\.wrangler\\tmp\\pages-URHh3T\\bundledWorker-0.7521691693921932.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=zjys5j1bxji.js.map
