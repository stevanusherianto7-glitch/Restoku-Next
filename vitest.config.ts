import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@features": path.resolve(__dirname, "src/features"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@mocks": path.resolve(__dirname, "src/mocks"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "src/features/auth/domain/**",
        "src/features/auth/application/**",
        "src/features/auth/ui/stores/**",
        "src/features/menu/domain/**",
        "src/features/menu/application/**",
        "src/features/menu/infrastructure/**",
        "src/features/menu-public/ui/stores/**",
        "src/features/pos/domain/**",
        "src/features/pos/ui/stores/**",
        "src/features/outlet/ui/stores/**",
        "src/features/tables/domain/**",
        "src/shared/domain/**",
        "src/shared/infrastructure/**",
        "src/shared/ui/lib.ts",
      ],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/__tests__/**",
        "src/shared/infrastructure/websocket/**",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/ports/**",
      ],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 90,
        lines: 85,
      },
    },
  },
});
