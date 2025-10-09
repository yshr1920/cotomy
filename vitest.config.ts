/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // DOM環境を使う
    globals: true,
    include: ["tests/**/*.spec.ts"],
  },
});
