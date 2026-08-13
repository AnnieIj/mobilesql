# MobileSQL Known Issues & Troubleshooting

Current known issues, edge cases, and runtime notes for version **1.0.0-PROD**.

---

## 🔍 Known Items & Resolutions

| Issue ID | Category | Description | Status / Workaround |
| :--- | :--- | :--- | :--- |
| **ISSUE-01** | **WASM Memory** | Browser tabs running SQLite WASM with tables exceeding 500,000 rows may consume >200MB memory | **Mitigated**: Client sandbox sets automatic pagination at 1,000 rows per query |
| **ISSUE-02** | **Safari Mobile Toolbar** | iOS Safari dynamic bottom URL bar occasionally overlaps fixed bottom sheets in landscape orientation | **Mitigated**: Added `env(safe-area-inset-bottom)` and padding offsets |
| **ISSUE-03** | **Postgres Window Framing** | `RANGE BETWEEN` with floating point offsets is dialect-restricted | **Documented**: Clear syntax guidelines provided in Help Center |
| **ISSUE-04** | **Gemini Rate Limits** | High frequency copilot requests without custom API key can hit public quotas | **Handled**: Graceful client retry and fallback explanations |

---

## 🛠️ Diagnostics & Self-Healing
If query execution appears unresponsive:
1. Open the **Admin Console** (`/admin`) or `/api/health` to verify system telemetry.
2. In the Playground, click **Reset Database** to restore default seed data.
3. Check browser DevTools console for sandboxed web worker messages.
