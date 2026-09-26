import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/weather-app/",
  test: {
    environment: "jsdom",
    globals: true,
  },
});
