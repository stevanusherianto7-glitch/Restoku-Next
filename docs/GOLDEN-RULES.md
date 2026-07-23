# Golden Rules — Restoku Project

## TypeScript Strict Typing

**Dilarang keras menggunakan `any` dalam kode yang dihasilkan.**

### Rules

| ❌ Dilarang | ✅ Wajib |
|------------|---------|
| `any` | Explicit types (`string`, `number`, `boolean`) |
| `as any` | Interface / Type alias |
| `: any` | Generics (`<T>`) |
| | `unknown` (jika tipe benar-benar tidak pasti + validasi) |
| | `// TODO: define precise type` (jika belum diketahui) |

### Contoh

```typescript
// ❌ BAD
function processData(data: any): any {
  return data.map((item: any) => item.name);
}

// ✅ GOOD
interface MenuItem {
  id: string;
  name: string;
  price: number;
}

function processData(data: MenuItem[]): string[] {
  return data.map((item) => item.name);
}

// ✅ GOOD (unknown dengan validasi)
function parseInput(input: unknown): MenuItem {
  if (typeof input !== "object" || input === null) {
    throw new Error("Invalid input");
  }
  return input as MenuItem;
}
```

### Enforcement

- ESLint rule: `@typescript-eslint/no-explicit-any: "error"`
- TypeScript config: `"noImplicitAny": true`
- Code review: Reject任何 PR yang menggunakan `any`
