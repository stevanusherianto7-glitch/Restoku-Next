import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@app/App";
import "@shared/ui/globals.css";

// Opt-in MSW runtime mocking for demo / e2e without a backend.
// Controlled by VITE_USE_MOCKS (default false). When disabled the app
// talks to the real Laravel API at VITE_API_URL.
async function enableMocking(): Promise<void> {
  if (import.meta.env.VITE_USE_MOCKS === "false") return;
  try {
    const { worker } = await import("./mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  } catch (error) {
    console.warn("MSW failed to start:", error);
  }
}

// Register Service Worker for PWA (only when mock mode is disabled)
if ("serviceWorker" in navigator && import.meta.env.VITE_USE_MOCKS !== "true") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // SW registration failed silently
    });
  });
}

// Ensure MSW is ready before rendering so API requests are intercepted
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
