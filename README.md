# MaxWell Canyon Creek — Transaction Automation Demo v2

## Run locally (< 2 minutes)

```bash
npm install
npm run dev
```
Open → http://localhost:5173

## Deploy to Vercel (< 5 minutes, free)

**Option A — CLI:**
```bash
npm install -g vercel
vercel
```
Press Enter for all defaults. You get a live URL instantly.

**Option B — GitHub:**
1. Push this folder to a GitHub repo
2. vercel.com → New Project → Import → Deploy
   (Vite is auto-detected)

## What's in this demo

### 12 animated steps — starting from DocuSign, never a Google Form:
1.  DocuSign document arrives (fake email inbox)
2.  File saved to NEW TRANSACTION INBOX (Drive mock)
3.  AI classifies document type (BRA / SLA / Purchase Contract / Waiver / etc.)
4.  AI extracts all transaction data (animated field-by-field)
5.  Master folder + 10 subfolders created (animated folder tree)
6.  Master checklist generated (Buyer / Seller / Conveyancing tabs)
7.  Validation engine runs (signed vs unsigned, missing docs, date checks)
8.  Calendar reminders created (deposit, conditions, waiver, possession)
9.  Email drafts prepared (Review before sending — not auto-send)
10. Conveyancing package prepared (Maxwell Canyon Creek)
11. Trade Record Sheet auto-populated (all fields from extraction)
12. Transaction closed (CLOSED badge + stats + anniversary email)

### 3 flow modes:
- 👤 Buyer flow — Purchase Contract, buyer emails
- 🏡 Seller flow — Listing Agreement, vendor requests
- 🔄 Full Automation Flow — complete system overview

### Other features:
- Auto-run button (advances every 3.8–5.5 seconds)
- Manual step navigation
- Buyer/Seller toggle visible during demo
- Automation Guide modal (what's automated vs what needs approval)
- MaxWell Canyon Creek branding throughout

## Customize the fake data

Edit the `BUYER_DEAL` and `SELLER_DEAL` objects at the top of `src/App.jsx`.
Change client names, addresses, prices, dates — everything flows from there.
