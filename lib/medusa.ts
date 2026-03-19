import Medusa from "@medusajs/js-sdk";
import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from "./config";

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  publishableKey: MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: "jwt",
    jwtTokenStorageMethod: "local",
  },
});
