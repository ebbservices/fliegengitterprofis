import { defineMiddlewares } from "@medusajs/medusa";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/shipping-config",
      method: "GET",
      middlewares: [],
    },
    {
      matcher: "/store/calculate-price",
      method: "POST",
      middlewares: [],
    },
    {
      matcher: "/store/place-order",
      method: "POST",
      middlewares: [],
    },
    {
      matcher: "/store/contact",
      method: "POST",
      middlewares: [],
    },
    {
      matcher: "/store/link-order-and-verify",
      method: "POST",
      middlewares: [],
    },
    {
      matcher: "/store/verify-email",
      method: "POST",
      middlewares: [],
    },
  ],
});
