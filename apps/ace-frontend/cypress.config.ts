import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { defineConfig } from "cypress";
import { getLatestEmail } from "./cypress/support/helpers/email";

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on("task", {
        "mail:receive": async ({ email }: { email: string }) =>
          getLatestEmail({ email }),
      });
    },
    // Need for waiting api server
    defaultCommandTimeout: 60000,
    viewportWidth: 1200,
    baseUrl: "http://localhost:3001",
    watchForFileChanges: false,
  },
  env: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
});
