import { defineMiddlewares } from "@medusajs/medusa";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/shipping-config",
      method: "GET",
      middlewares: [],
    },
    {
      matcher: "/store/place-order",
      method: "POST",
      middlewares: [],
    },
  ],
});
