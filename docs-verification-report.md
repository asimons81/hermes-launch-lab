# Docs Accuracy Verification Report

Task: t_c1979b03 — Correct every public Hermes command and documentation claim
Branch: wt/launch-docs-accuracy
Verified against: Hermes Agent **v0.20.0** (2026.8.3) installed at `~/.local/bin/hermes` and official docs at `hermes-agent.nousresearch.com`
Date: 2026-08-10

---

## 1. Ground-truth sources

Official documentation (fetched 2026-08-10):
- https://hermes-agent.nousresearch.com/docs — install section, feature index
- https://hermes-agent.nousresearch.com/docs/getting-started/quickstart — canonical quickstart
- https://hermes-agent.nousresearch.com/docs/getting-started/installation — installer behavior, per-user layout, `--skip-browser`
- https://hermes-agent.nousresearch.com/docs/reference/cli-commands — `hermes setup`, `hermes skills`, `hermes cron`, `hermes secrets`, `hermes egress`, `hermes security`
- https://hermes-agent.nousresearch.com/docs/user-guide/features/skills — skills system, install commands, SKILL.md format
- https://hermes-agent.nousresearch.com/docs/user-guide/features/cron — cron CLI examples
- https://hermes-agent.nousresearch.com/docs/user-guide/security — credential stores, sandbox filters, recommended practices
- https://hermes-agent.nousresearch.com/docs/user-guide/egress/iron-proxy — egress proxy architecture + explicit threat-model limits
- https://hermes-agent.nousresearch.com/docs/user-guide/secrets/bitwarden — Bitwarden Secrets Manager integration
- https://hermes-agent.nousresearch.com/docs/developer-guide/creating-skills — official SKILL.md frontmatter shape

CLI receipts: captured by running the v0.20.0 binary directly on this host (see §3).

## 2. Problems found and fixed

| Surface | Problem | Fix |
|---|---|---|
| quickstart | Dead installer URL `https://hermes.tonysimons.dev/bootstrap.sh` | Official `curl -fsSL https://hermes-agent.nousresearch.com/install.sh \| bash` (+ PowerShell variant, `hermes --version` check) |
| quickstart | `hermes setup` misrepresented as "environment detector that indexes toolchains" with fabricated output | Described as the interactive setup wizard; added `hermes setup --portal` and `hermes model`; removed fabricated output |
| quickstart | `hermes skill load hermes-vault` / `sqlite-mem-persist` (command does not exist; skills don't exist) | Replaced with `hermes skills list` / `hermes skills browse` / `hermes skills install <slug>` |
| quickstart | `hermes test` with fabricated `✓ Core Engine: OK` output (command does not exist) | Replaced with `hermes doctor` (+ `hermes status`, `hermes verify`); sample output marked abridged from a real run |
| quickstart | Root-password claim | Bounded to official per-user install facts (`~/.hermes`, no sudo required) + "review the script" guidance |
| skills | False definition ("markdown or YAML directory with execution manifests... memory persistence rules") | Real definition: `SKILL.md` instruction document; skills live in `~/.hermes/skills/`; loaded on demand |
| skills | Fake frontmatter (`tools:`, action declarations) | Official frontmatter shape (`name`, `description`, `version`, `author`, `platforms`); example explicitly labeled illustrative |
| skills | `hermes skill load ./my-custom-skill` with fabricated "indexing" output | Real flow: drop SKILL.md in `~/.hermes/skills/<name>/`, verify with `hermes skills list`; commands from official docs |
| vault | Entire page fabricated: `hermes vault lease request`, `hermes vault audit`, `hvs_lease_...`, ChaCha20-Poly1305 keyring, "zero-leak guarantees" | Rewritten as "Secrets & Credential Security": `~/.hermes/.env`, `hermes secrets` (Bitwarden/1Password), `hermes egress` (iron-proxy, disabled by default), `hermes security audit`; bounded threat model, no absolutes |
| cron | `hermes cron create --schedule "0 */2 * * *" --skill "content-radar"` (no `--schedule` flag; schedule is positional) | `hermes cron create "every 2h" "Check server status"` + cron-expression variant + real flags (`--name`, `--deliver`, `--skill`, `--no-agent`, `--script`); `cronjob` tool note |
| cron | Fabricated box-drawing `hermes cron list` table with fake jobs | Real empty-state receipt from actual run; explicitly declined to invent populated-list columns |
| docs index / sidebar / palette | "lease-based credential brokering" copy; "Vault & Security" labels | Retitled to "Secrets & Security"; index copy grounded |
| SkillCatalog | 6 fictional skills with `hermes skill load` copy commands and fake YAML (`policy: brokered`, `lease_ttl`, `cron:` in skill manifest) | Relabeled "ILLUSTRATIVE DEMO"; manifests rewritten in official SKILL.md frontmatter shape; copy commands replaced with real `hermes skills` / `hermes cron` commands |
| LiveTerminal | `hermes skill load hermes-vault`, `hermes vault status`, `hermes benchmark`, `hermes workflow test`, `hermes cron create "Daily content radar"` (invalid schedule), `v0.19.0`, "55 skills indexed" | Real commands only (`hermes setup --portal`, `hermes skills list`, `hermes cron create "every 2h" ...`, `hermes doctor`, `hermes cron list`, `hermes status`); every output line marked simulated |
| ReceiptsRail | "Live agent activity" label with fabricated vault-lease receipts | "DEMO ACTIVITY (ILLUSTRATIVE)"; events reference real commands |
| StatusBar | `SECURITY: BROKERED` (fictional broker) | `SECURITY: LOCAL` |
| TopoGraph | "Vault: Credential broker... brokered, lease-based, policy-gated" node | "Secrets" node describing `.env` + `hermes secrets`/`hermes egress`; homepage copy updated |
| features | "Inspect & Load Real Skills" / "real Hermes Agent skills" claims; "Brokered vault security" comparison row | "Inspect Example Skill Manifests" + illustrative disclaimer; row → "Credential security & sandbox hardening" |
| status page | "Hermes Local Fleet Engine v0.19.0" (stale version, fabricated service) | "Hermes Agent CLI (operator host) v0.20.0 verified via hermes doctor" |
| layout metadata / footer / legal terms | "zero-trust vault architecture/setups/vault setup" (product that doesn't exist) | "credential security setups / credential security setup" |

## 3. Exact command receipts (Hermes Agent v0.20.0, run 2026-08-10)

```
$ hermes --version
Hermes Agent v0.20.0 (2026.8.3)
Install directory: /home/tony/.hermes/hermes-agent
Python: 3.11.15
```

`hermes skill` (singular) does not exist:
```
$ hermes skill --help
hermes: error: argument command: invalid choice: 'skill' (choose from 'chat', 'model', ...)
```

`hermes test`, `hermes benchmark`, `hermes vault` do not exist:
```
$ hermes test --help
hermes: error: argument command: invalid choice: 'test' (choose from 'chat', 'model', ...)
$ hermes benchmark --help
hermes: error: argument command: invalid choice: 'benchmark' (...)
$ hermes vault --help
hermes: error: argument command: invalid choice: 'vault' (...)
```

`hermes skills` (real command group):
```
usage: hermes skills [-h]
                     {browse,search,install,inspect,list,check,update,audit,uninstall,reset,list-modified,diff,opt-out,opt-in,repair-official,publish,snapshot,tap,config}
                     ...
```
`hermes skills install`:
```
usage: hermes skills install [-h] [--category CATEGORY] [--name NAME] [--force] [--yes] identifier
```
Real example (official docs): `hermes skills install openai/skills/k8s` — installs from the hub after a security scan.

`hermes setup`:
```
usage: hermes setup [-h] [--non-interactive] [--reset] [--reconfigure] [--quick] [--portal]
                    [{model,tts,terminal,gateway,tools,telemetry,agent}]
Configure Hermes Agent with an interactive wizard.
```
Official quickstart fast path: `hermes setup --portal` — OAuth into Nous Portal + Tool Gateway in one command.

`hermes cron create` (schedule is POSITIONAL, no `--schedule` flag):
```
usage: hermes cron create [-h] [--name NAME] [--deliver DELIVER] [--repeat REPEAT]
                          [--skill SKILLS] [--script SCRIPT] [--no-agent]
                          [--monitor-script MONITOR_SCRIPT] [--monitor-url MONITOR_URL]
                          [--workdir WORKDIR] [--model MODEL] [--provider MODEL_PROVIDER]
                          schedule [prompt]
```
Real examples (official docs): `hermes cron create "every 2h" "Check server status"`; `hermes cron create "0 9 * * *" ...`.

`hermes cron list` (real empty-state receipt):
```
$ hermes cron list
No scheduled jobs.
Create one with 'hermes cron create ...' or the /cron command in chat.
```

`hermes doctor`:
```
usage: hermes doctor [-h] [--fix] [--live] [--ack ADVISORY_ID]
Diagnose issues with Hermes Agent setup
```
Real run (abridged): banner, then check groups — Python Environment (`✓ Python 3.11.15`, `✓ Version files consistent (0.20.0)`), SSL/CA, Required Packages, Configuration Files, Auth Providers.

`hermes status`:
```
usage: hermes status [-h] [--all] [--deep]
Display status of Hermes Agent components
```
Real run shows Environment (project, Python, .env, Model, Provider), API Keys per provider (✓/✗), Auth Providers.

`hermes secrets`:
```
usage: hermes secrets [-h] {bitwarden,bw,onepassword,op,1password} ...
Pull API keys from an external secret manager at process startup instead of
storing them in ~/.hermes/.env. Supports Bitwarden Secrets Manager and 1Password.
```
Subcommands: `hermes secrets bitwarden setup|status|token|sync|install|disable`.

`hermes egress`:
```
usage: hermes egress [-h] {install,setup,start,stop,restart,reload,status,disable,config} ...
Manage iron-proxy, the optional TLS-intercepting egress firewall that swaps
proxy tokens for real API credentials before outbound requests leave a sandbox.
Disabled by default.
```

`hermes security`:
```
usage: hermes security [-h] <subcommand> ...
On-demand vulnerability scan against OSV.dev. Covers the Hermes venv
(installed PyPI dists), Python deps declared by plugins under
~/.hermes/plugins/, and pinned npx/uvx MCP servers in config.yaml.
```
Subcommand: `audit`.

## 4. Verification

- Tests added first (`tests/docs-accuracy.test.ts`): 29 failing before repair, 42 passing after (includes pre-existing visual-contract suite).
  The contract bans: `hermes.tonysimons.dev`, `bootstrap.sh`, `hermes skill load`, `hermes test`, `hermes benchmark`, `hermes vault`, `hermes workflow`, `hermes cron create --schedule`, `--schedule "0 */2`, zero-leak/ChaCha20/hvs_lease/lease-claim phrases, `v0.19.0`, "55 skills"/"skills indexed". It requires the official install URL and real commands in each doc page, and verifies every docs link resolves to a real route file.
- Full gate (all PASS):
  - `npm test` — 42 passed
  - `npm run typecheck` — clean
  - `npm run lint` — clean (0 warnings)
  - `npm run build` — clean, all routes compiled

## 5. Commit

Single atomic commit on `wt/launch-docs-accuracy`, not pushed.
