# Sentinel — AI Act Compliance Infrastructure

Sentinel is a deterministic compliance infrastructure designed to help engineering teams verify AI systems against the EU AI Act.

This repository contains the official Sentinel landing platform, including public audit reports, compliance documentation, and developer onboarding.

---

## 🌐 Live Platform

👉 https://gettingsentinel.com

---

## ⚙️ What Sentinel Does

Sentinel analyzes AI systems and repositories to detect compliance gaps related to:

- Technical documentation (Annex IV)
- Risk classification (high-risk systems)
- Dataset provenance
- Model transparency
- Human oversight requirements

It produces:

- Deterministic compliance reports
- Evidence-backed findings
- CI/CD enforcement signals
- Public audit pages (optional)

---

## 🧱 System Components

Sentinel is composed of multiple parts:

### 1. CLI Scanner

Offline deterministic scanner for developers

npx @radu_api/sentinel-scan@latest check --manifest sentinel.manifest.json

### 2. GitHub Action

Automated compliance checks in CI/CD

https://github.com/MOXO08/sentinel-scan-action

### 3. Public Audit Platform (this repo)

- Displays audit reports
- Hosts compliance pages
- Enables discovery and indexing

---

## 🧪 Example Integration

Minimal GitHub Action setup:

name: AI Compliance Audit

on: [pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Sentinel Scan
        uses: MOXO08/sentinel-scan-action@v1
        with:
          enforce: "true"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

---

## 📊 What This Repo Contains

- /src — frontend application (Astro)
- /public — static assets and audit pages
- /compliance-docs — structured documentation
- /migrations — database schema evolution
- /real_validation — validation datasets and checks

---

## 🔐 Philosophy

Sentinel is built on:

- Deterministic analysis (no black-box AI scoring)
- Verifiable evidence, not assumptions
- Developer-first experience
- Compliance as infrastructure, not consulting

---

## ⚠️ Disclaimer

Sentinel provides automated technical assessments aligned with the EU AI Act.

It does not replace formal legal review or certification by regulatory authorities.

---

## 🚀 Status

- CLI: active
- GitHub Action: active
- Discovery & audit platform: in development

---

## 📬 Contact

For partnerships, audits, or enterprise use:

office@gettingsentinel.com
