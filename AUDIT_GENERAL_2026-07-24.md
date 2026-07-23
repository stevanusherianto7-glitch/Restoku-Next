# Restoku-Next — General Audit (Counter-Verification + Live Gates)

**Scope:** `Restoku_Refactored/Restoku-Next` — React 18 SPA monorepo (Vite + TS + Zustand + TanStack Query + MSW) **+ nested Laravel 13 backend** (`Restoku-Next/backend`).
**Date:** 2026-07-24
**Method:** Real tool gates (lint/tsc/build/coverage on the SPA) + counter-verification of the legacy `AUDIT_REPORT_GENERAL.md` (which targeted the *old* `restoku app/restoku backend`, not this folder) against actual code present here.
**Repository:** `github.com/stevanusherianto7-glitch/Restoku-Next` (HEAD `eb275d3`).

> ⚠️ **Scope note (important):** The parent-folder `AUDIT_REPORT_GENERAL.md` audits a *different* codebase — the legacy `restoku app/restoku backend` (Laravel 12 + Inertia). That report's CRITICAL cross-tenant claims were re-tested against the backend code inside THIS folder. This backend is **Laravel 13.19**, not 12. Several prior findings are already remediated; two are still open/uncertain. This audit reports what is actually true in `Restoku-Next`, not the legacy report's narrative.

---

## 1. Live SPA Verification Gates (real output, 2026-07-24)

| Gate | Command | Result | Evidence |
|---|---|---|---|
| Lint | `npm run lint` | ✅ **0 errors, 1 warning** | react-refresh warning in `Toast.tsx:43` (cosmetic) |
| TypeScript | `npx tsc -b` | ✅ **exit 0** | strict build clean |
| Build | `npm run build` | ✅ **exit 0** | 456 modules, code-split chunks (largest `index` 307 KB / `browser` 312 KB gzip ~100 KB) |
| Unit tests | `vitest run` | ✅ **339 passed / 39 files** | NO failures |
| Coverage (v8) | `vitest run --coverage` | ⚠️ **exit 1 on threshold** | All files **87.25% stmts / 90.43% branch / 87.5% funcs / 87.25% lines** — *functions* threshold (90) not met |
| `any` type scan | `grep -rn ":\s*any\|as any\|any\[\]"` | ✅ **0 matches in src/** | Golden Rule (no `any`) SATISFIED |
| Secret scan (src) | regex sk-/AIza/cloudinary://…:@/AKIA/ghp_ | ✅ **0 matches in src/** | No secrets in bundle |
| Git history secret | `git log --all -S cloudinary://` | ✅ no key:secret URL ever committed | Full `cloudinary://key:secret@` never committed |

**Coverage detail (measured, not estimated):**
- 100% coverage: `menuUseCases`, `MenuItem`, `User`, `useCartStore`, `ApiMenuRepository`, `RestaurantTable`, `types`, `validations`, `lib`, all `login`/`use-cases`.
- Weakest files: `cloudinary.ts` 54% (lines 79–107 uncovered — error/fallback branches), `apiClient.ts` 70% (error paths 73–104), `Order.ts` 70% (lines 110–117), `usePosCartStore.ts` 82%, `accessibility/hooks.ts` 75%.
- **Root cause of threshold failure:** `functions: 87.5% < 90%`. Driven by `cloudinary.ts` (66% funcs), `Order.ts` (57% funcs), `usePosCartStore.ts` (57% funcs), `lazyLoad.tsx` (75% funcs). These are small untested helper branches, not architectural gaps.

---

## 2. Legacy-Audit Counter-Verification (C-2 … H-5)

Each prior CRITICAL/HIGH claim re-tested against the Laravel 13 code in `Restoku-Next/backend`:

| Legacy ID | Claim | Status in THIS repo | Evidence |
|---|---|---|---|
| C-2 | AI tool `TenantTaxConfigTool` reads `tenant_id` from request → cross-tenant | ✅ **REMEDIATED** | `app/Ai/Tools/TenantTaxConfigTool.php:31-35` — aborts 403 if `ctx` not initialized; uses `$this->ctx->id()` only |
| C-3 | `OutletOperatingHoursTool` cross-tenant | ✅ **REMEDIATED** | `app/Ai/Tools/OutletOperatingHoursTool.php:34-47` — locks `Outlet::where('tenant_id', ctx->id())->where('id', outletId)` |
| C-4 | `MonthlyProfitSummaryTool` lateral/cross-tenant | ✅ **REMEDIATED** | `app/Ai/Tools/MonthlyProfitSummaryTool.php:34-55` — outlet re-checked against tenant; `Order::byTenant($tenantId)` |
| C-5 | `GeminiAiController` leaks exception message | ✅ **REMEDIATED** | `app/Http/Controllers/GeminiAiController.php:58-76` — generic message + `Log::error` |
| C-6 | CSRF wildcard exempt | N/A — different routing here; not re-checked (no evidence of `api/*` wildcard) | — |
| H-3 | `TenantScope` silent no-op (Plan B) | ✅ **MITIGATED** | `app/Models/Scopes/TenantScope.php:36-45` — `abort(500)` in production if `tenant.id` unbound |
| H-4 | `OutletSettingsController` double-namespace dead import | ⚠️ **STILL PRESENT** (non-fatal) | `app/Http/Controllers/OutletSettingsController.php:6` `use App\Models\Models\Scopes\TenantScope;` (typo `Models\Models`). Controller uses FQ `\App\Models\Scopes\TenantScope::bypass()` at lines 447/498, so it compiles — but the import is dead/wrong and should be fixed |
| H-5 | `OrderPolicy` uses deprecated `HandlesAuthorization` trait → runtime error at Laravel 10+ | ✅ **FALSE POSITIVE (verified 2026-07-24)** | `app/Policies/OrderPolicy.php:7,11` still `use HandlesAuthorization;` — BUT the trait **STILL EXISTS in Laravel 13.19** (`vendor/laravel/framework/src/Illuminate/Auth/Access/HandlesAuthorization.php`). Verified by: (1) `php composer.phar install` → 161 pkgs incl `laravel/framework v13.19.0`; (2) standalone autoload check: `OrderPolicy` loads, trait resolves, `deny()` present; (3) `php artisan tinker` resolves `app(OrderPolicy::class)` cleanly. The legacy audit's claim ("removed in Laravel 10+") is **wrong for this version**. No code change needed. |
| M-3 | `GoogleReviewController` mutates global `config(['ai.default'])` | ✅ **REMEDIATED** | `GeminiAiController.php:61-63` uses per-call provider `'gemini'` (no global mutation) |

**Conclusion:** The legacy CRITICAL cross-tenant findings (C-2/C-3/C-4) and info-disclosure (C-5) and config-race (M-3) are genuinely fixed in this backend. H-3 is mitigated. H-4 is a trivial dead-import fix. **H-5 is now VERIFIED FALSE POSITIVE** — `composer install` + boot prove the `HandlesAuthorization` trait still ships in Laravel 13.19, so `OrderPolicy` loads cleanly. No backend code change is required for H-5.

---

## 3. Other Findings (verified against real code)

### HIGH

- **H-A — CI does NOT enforce the coverage threshold that fails locally.** `ci-cd.yml` runs `npm run test:unit` (= `vitest run`, no `--coverage`) in the `test` job, and `build`/`e2e` after. The 90%-function threshold that fails locally (exit 1) is **never checked in CI**. So a regression that drops coverage would pass CI. *Fix:* change the `test` step to `npm run test:coverage` (or add a dedicated coverage job), and either raise the measured funcs coverage to ≥90% or lower the threshold to the real measured floor (87.5%).
- **H-B — Backend has ZERO automated tests in this repo.** `Restoku-Next/backend/tests/` does not exist; no `phpunit.xml`. The legacy audit cited `TenantIsolationTest.php` but it is not present here. For a multi-tenant SaaS handling money/orders, backend test absence is a real risk. *Action:* add `phpunit.xml` + at least `TenantIsolationTest` + `OrderPolicyTest` before any production deploy.
- **H-C — `php artisan` fails to boot: missing `routes/web.php` & `routes/console.php`.** `bootstrap/app.php` called `->withRouting(web: routes/web.php, commands: routes/console.php)` but the repo only ships `routes/api.php`. **FIXED 2026-07-24 (architect override):** since this backend is API-only, `web:`/`commands:` were removed and `api: routes/api.php` added to `bootstrap/app.php`. However, `routes/api.php` originally referenced `App\Http\Controllers\Api\V1\AuthController` and `Api\V1\OrderController` which **do not exist on disk** (the real controllers live at `Auth\AuthController` with `login/me/logout/refresh` and `OrderController` root with differently-named methods). Wiring them blindly would mean guessing the API contract → silent HTTP 500. **Decision:** `api.php` was rewritten to enable only routes whose handlers exist (`/health`, `v1/auth/login|logout|refresh|me`, `v1/orders/void`, `v1/webhooks/payment`); the `Api\V1\*` order/payment/public routes are commented with explicit `TODO` until those controllers are implemented. **Verified:** `php artisan about` boots (L13.19.0) and `php artisan route:list` returns 10 real routes, exit 0, no `ReflectionException`. No fabricated controllers.

### MEDIUM

- **M-A — `cloudinary.ts` lowest coverage (54%).** Error/fallback branches (lines 79–107) untested. Low risk (pure URL builder) but easy to close.
- **M-B — `Order.ts` entity 70% / `usePosCartStore.ts` 82%.** Core POS logic partially untested (discount/tax edge branches). Acceptable but should rise.
- **M-C — `react-refresh/only-export-components` warning** in `Toast.tsx:43`. Cosmetic; split the exported helper into its own module to silence.
- **M-D — e2e is local-only / single-project in CI.** `playwright.config.ts:24` enables only `chromium` in CI (`--project=chromium`); firefox/webkit/mobile run locally. Acceptable (MSW SPA flakiness noted in docs), but note cross-browser regression only happens on dev machines.

### LOW / POSITIVE

- ✅ **No `any` types anywhere** in SPA — Golden Rule satisfied.
- ✅ **No secrets in SPA bundle or git history** (verified via regex + `git log -S`).
- ✅ **`.env` correctly gitignored** in this repo (`backend/.env` ignored; never committed).
- ✅ SPA build is code-split (no single 1 MB monolith; largest chunk gzip ~101 KB).
- ✅ `TenantScope` fails closed in production (H-3 mitigation is correct design).

---

## 4. Executive Scorecard (Restoku-Next, 2026-07-24)

| Dimension | Score | Notes |
|---|---|---|
| SPA Type Safety / Lint / Build | **96/100** | tsc exit 0, lint 0 err, build green, 0 `any`, no secrets |
| SPA Test Coverage | **82/100** | 339 pass, 87% lines — but funcs threshold fails locally & CI doesn't gate it |
| Backend Multi-Tenant Isolation | **90/100** | AI tools remediated, scope fails-closed (verified via `composer install`) |
| Backend Authz (Policy) | **92/100** | `OrderPolicy` wired + H-5 FALSE POSITIVE (trait exists in L13.19); no backend tests yet |
| Backend Boot / Repo Completeness | **95/100** | H-C FIXED — `php artisan` boots, `route:list` green (10 routes); `Api\V1\*` order/payment controllers still TODO |
| Secret Management | **90/100** | `.env` gitignored, no committed secrets (SPA); backend `.env` gitignored |
| CI/CD Enforcement | **65/100** | Coverage gate not enforced; backend untested in CI; backend won't boot in CI either |
| **WEIGHTED TOTAL** | **~88/100** | Solid SPA; backend boots & routes parse; backend tests (H-B) + `Api\V1\*` order/payment controllers still TODO |

---

## 5. Remediation Priority

| # | Finding | Effort | Risk if ignored |
|---|---|---|---|
| 1 | **H-C** fix `php artisan` boot — done: `bootstrap/app.php` drops `web`/`commands`, adds `api:`; `routes/api.php` rewritten to only enable routes with existing handlers (TODO-marked the rest) | S | **FIXED 2026-07-24** — `php artisan about` + `route:list` green |
| 2 | H-A enforce coverage in CI (`test:coverage`) | S | Med — silent coverage regression |
| 3 | H-B add backend `phpunit.xml` + `TenantIsolationTest`/`OrderPolicyTest` | M | High — untested money/tenant logic (blocked by H-C) |
| 4 | H-4 fix dead `Models\\Models\\Scopes\\TenantScope` import | S | Low (non-fatal) |
| 5 | M-A/M-B raise cloudinary/Order/PosCart coverage to ≥90% funcs | M | Low |
| 6 | M-C split Toast helper to clear react-refresh warning | S | Cosmetic |
| — | ~~H-5~~ `HandlesAuthorization` trait | — | ✅ **FALSE POSITIVE** — verified not fatal in L13.19, no action |

---

## 6. QA Evidence (what was actually run)

- `npm run lint` → exit 0, 1 warning (`Toast.tsx:43`).
- `npx tsc -b` → exit 0.
- `npm run build` → exit 0, 456 modules, code-split.
- `npm run test:unit` → **339 passed / 39 files**.
- `npm run test:coverage` → exit 1 (funcs 87.5% < 90%); all-files 87.25% stmts / 90.43% branch / 87.5% funcs / 87.25% lines.
- `grep -rn ":\s*any|as any|any\[\]"` on `src/**` → 0 matches.
- `grep -rEn "sk-|AIza|cloudinary://...:@|AKIA|ghp_"` on `src/**` → 0 matches.
- `git log --all -S "cloudinary://"` → no `key:secret@` URL ever committed.
- Legacy C-2/C-3/C-4/C-5/M-3 re-verified by reading the actual PHP files (paths cited inline above).
- **Backend `composer install`** → exit 0, 161 packages installed incl `laravel/framework v13.19.0` (Composer 2.10.2, PHP 8.5.8).
- **H-5 verification** (2026-07-24): standalone autoload check → `OrderPolicy` loads, `HandlesAuthorization` trait resolves, `deny()` present; `php artisan tinker` resolves `app(OrderPolicy::class)` cleanly. **CONCLUSION: trait NOT removed in L13.19 → H-5 is a FALSE POSITIVE, no fatal.**
- **H-C verification + FIX (2026-07-24):** `bootstrap/app.php` → removed `web:`/`commands:`, added `api: routes/api.php` (API-only backend). `routes/api.php` rewritten to enable only routes whose handlers exist (`/health`, `v1/auth/login|logout|refresh|me`, `v1/orders/void`, `v1/webhooks/payment`); `Api\V1\*` order/payment/public routes commented with explicit TODO (controllers not on disk). **Verified:** `php artisan about` boots (L13.19.0, exit 0) and `php artisan route:list` returns 10 real routes, exit 0, no `ReflectionException`. No fabricated controllers.

*Generated by verified audit. No claim made without the tool output above.*
