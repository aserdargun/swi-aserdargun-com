# SWI deployment

The existing production target was verified on 2026-09-06 before publishing
revision 02. The user's explicit deployment request authorizes this update.

| Setting | Verified target |
| --- | --- |
| Repository | `aserdargun/swi-aserdargun-com` |
| Production branch | `main` |
| Azure subscription | `aserdargun subscription 2` |
| Subscription ID | `d032085b-0266-48cd-b094-b92965fec33d` |
| Resource group | `rg-swi-aserdargun-com` |
| Static Web App | `swa-swi-aserdargun-com` |
| Region / SKU | West Europe / Free |
| Artifact | Next.js static export, `out/` |
| Public URL | <https://swi.aserdargun.com> |
| Azure URL | <https://white-field-09957a203.6.azurestaticapps.net> |
| Workflow | `.github/workflows/deploy-swa-swi-aserdargun-com.yml` |
| Deployment secret | `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_SWI_ASERDARGUN_COM` |
| Deployment gate | `AZURE_SWI_DEPLOY_READY=true` |
| Concurrency group | `swa-swi-aserdargun-com-production` |

Use the explicit subscription ID for Azure inspections. This app already has
its GitHub source mapping and custom domain. An update uses the existing
workflow, secret and resource; it does not create a replacement resource or
change DNS. Reverify this table against live state before future releases.

Run `npm run validate:codex` before publishing. It checks content, lint, strict
types, unit/component tests, the production export, static artifacts and browser
acceptance. Review the scoped diff, fetch the production branch, and push only
when its history still agrees with the intended release base.

The [production workflow](https://github.com/aserdargun/swi-aserdargun-com/actions/workflows/deploy-swa-swi-aserdargun-com.yml)
repeats the release checks and uploads the prebuilt export. Completion requires
the intended remote commit and successful upload step, a fresh Azure production
environment in `Ready`, and HTTPS/asset and desktop/mobile interaction checks
on the live deployment. The workflow run records the published commit.

Agenda entries remain in browser storage on the origin where they were created.
Deployment publishes the library and application code; it does not transfer a
local-preview agenda or synchronize entries between the custom and Azure URLs.
Use the agenda's JSON backup and import controls to move personal records.
