globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const prerender = false;
const STRIPE_API_BASE = "https://api.stripe.com/v1";
const GET = async ({ request, locals, url }) => {
  const env = locals.runtime.env;
  const plan = url.searchParams.get("plan") || "founder";
  let priceId = "price_1T6cpULdQnniVbKWN3S3pdad";
  let planName = "founder";
  if (plan === "scaleup") {
    priceId = "price_1T6REpLdQnniVbKWgXNTc7W9";
    planName = "scaleup";
  } else if (plan === "freemium") {
    priceId = "price_1T6freemium000";
    planName = "freemium";
  }
  if (!env.STRIPE_SECRET_KEY) {
    return new Response("Stripe secret key not configured", { status: 500 });
  }
  const successUrl = `${url.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${url.origin}#pricing`;
  try {
    const formData = new URLSearchParams();
    formData.append("mode", "subscription");
    formData.append("line_items[0][price]", priceId);
    formData.append("line_items[0][quantity]", "1");
    formData.append("success_url", successUrl);
    formData.append("cancel_url", cancelUrl);
    formData.append("metadata[plan]", planName);
    formData.append("subscription_data[metadata][plan]", planName);
    formData.append("payment_method_types[0]", "card");
    const response = await fetch(`${STRIPE_API_BASE}/checkout/sessions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });
    const session = await response.json();
    if (!response.ok) {
      console.error("Stripe Error:", session);
      return new Response(JSON.stringify(session), { status: response.status });
    }
    return Response.redirect(session.url, 303);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
