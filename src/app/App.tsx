import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@app/routes/AppRoutes";
import { OnlineIndicator } from "@features/offline/ui/components/OnlineIndicator";
import { ToastProvider } from "@shared/ui/components/Toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
          <OnlineIndicator />
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
