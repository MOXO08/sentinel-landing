export const SEO_DEFAULTS = {
  siteName: "Sentinel Sovereign Trust",
  titleTemplate: "%s | Sentinel",
  defaultDescription: "Deterministic AI compliance infrastructure for engineering teams. EU AI Act readiness via code-linked verification.",
  canonicalBase: "https://gettingsentinel.com",
  openGraph: {
    type: "website",
    locale: "en_US",
    site_name: "Sentinel",
    image: "/images/og-main.png",
  }
};

export function getCanonicalURL(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_DEFAULTS.canonicalBase}${cleanPath}`;
}
