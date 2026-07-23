import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shared/ui/atoms/Button";
import { useAuthStore } from "@features/auth/ui/stores/useAuthStore";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const userRole = useAuthStore.getState().user?.role;
      if (userRole === "kitchen" || email.includes("chef") || email.includes("kitchen")) {
        navigate("/kitchen");
      } else if (userRole === "waiter" || email.includes("sari") || email.includes("waiter")) {
        navigate("/waiter-bar");
      } else if (userRole === "cashier" || email.includes("kasir") || email.includes("andi")) {
        navigate("/pos");
      } else {
        navigate("/dashboard");
      }
    } catch {
      // Error is handled by store
    }
  };

  const handleQuickLogin = async (demoEmail: string, redirectPath: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    try {
      await login(demoEmail, "password123");
      navigate(redirectPath);
    } catch {
      // Handled
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cabe-600">Restoku</h1>
          <p className="mt-2 text-gray-600">Masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-cabe-500 focus:outline-none focus:ring-1 focus:ring-cabe-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-cabe-500 focus:outline-none focus:ring-1 focus:ring-cabe-500"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Masuk..." : "Masuk"}
          </Button>

          {/* Demo Login Presets */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 text-center uppercase tracking-wider">
              Uji Coba Demo Akun (Pilih Role):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("chef@restoku.id", "/kitchen")}
                className="py-2 px-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-all text-center"
              >
                🍳 Kitchen (Dapur)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("sari@restoku.id", "/waiter-bar")}
                className="py-2 px-1 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold hover:bg-teal-100 transition-all text-center"
              >
                🍹 Waiter (Bar)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("andi@restoku.id", "/pos")}
                className="py-2 px-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition-all text-center"
              >
                💵 Kasir (POS)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("budi@restoku.id", "/dashboard")}
                className="py-2 px-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-bold hover:bg-sky-100 transition-all text-center"
              >
                👑 Owner
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
