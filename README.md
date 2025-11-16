# HawkShot: Let's stop guessing on security reviews.

Demo - https://hawkshot.xyz

If you've ever been near a security team, you know *that* question:

> **"So… can we use this new tool?"**

That "simple" question usually means:

- 20 browser tabs
- Marketing pages pretending to be security docs
- Manual CVE searches
- LLM Hallucination
- And, in the end, a stressed CISO making a gut call

It's slow, inconsistent, and impossible to audit later. We were tired of it.  
So we built the tool we wish every security team had.

---

## 🦅 Meet HawkShot

**HawkShot** turns that chaos into a clear, shareable **Trust Brief**.

You paste a **product name or URL**, hit **fire**, and get:

- A transparent **0–100 trust score**
- A readable **markdown brief** with evidence and sources
- A **confidence level** and **evidence coverage**
- A **saved snapshot** you can revisit months later

In other words, a decision you can actually stand behind.

**The old way:**
- Endless Googling
- Reading marketing fluff
- Guessing about features
- Hours of manual work
- Vibes-based decisions
- "Why did we approve this?"

**With HawkShot:**
- One-shot entity resolution
- Signals from `security.txt` and docs
- SSO / MFA / RBAC checklist
- Automated, parallel evidence collection
- Deterministic scoring
- Auditable snapshots in Supabase

---

## 🎯 Our Core Idea: AI as Reporter, Not Judge

Most "AI security" hacks do this:

> Search the web → dump into a model → "is this risky?"

That gives you *nice paragraphs*, not solid decisions.

We flipped the pattern:

- **The score is code, not vibes**  
  Our 0–100 trust score comes from a **deterministic scoring engine**.  
  It uses structured evidence: transparency signals, CVE history, KEV flags, and real security controls.  
  The LLM cannot change the score.

- **The LLM is a reporter**  
  Once we've computed scores, we hand the facts to the model and say:  
  *"Write this up for a human, clearly and concisely."*  
  It explains, it doesn't decide.

- **"We don't know" is a valid outcome**  
  If evidence is thin, HawkShot doesn't bluff.  
  It flags low evidence coverage and generates a **question list** you can send to the vendor (SOC 2? data residency? SSO?).  
  A dead end becomes a concrete next step.

---

## ⚙️ How HawkShot Works

Under the hood, HawkShot is a **visual security pipeline** built in **n8n**:

1. **Resolve the target**  
   Input: `"Slack"` or `https://slack.com`  
   We resolve it to:
   - App: `Slack`
   - Vendor: `Slack Technologies`
   - Domain: `slack.com`
   - Category: e.g. *Team collaboration SaaS*

2. **Collect evidence in parallel**
   - 🔍 **Vendor honesty signals**
     - Check for `/.well-known/security.txt`
     - Look for `/security`, `/trust`, bug bounty / disclosure pages
   - 🧨 **Vulnerability history**
     - Query public CVE sources
     - Aggregate: total CVEs, recency, max CVSS, KEV flags
   - 🔐 **Security and admin controls**
     - Scan docs with an LLM constrained to JSON
     - Extract: SSO, MFA, RBAC, audit logs (`yes / no / unknown`)

3. **Score it deterministically**  
   A JavaScript scoring function in n8n turns evidence into:
   - Per-dimension scores (transparency, controls, CVE risk)
   - Overall **trust score (0–100)**
   - **Confidence** and **evidence coverage**

4. **Generate the Trust Brief**  
   The LLM receives only structured data and returns markdown with:
   - Overview and usage
   - Vendor-stated vs independent claims (labeled)
   - Vulnerability and incident summary
   - Data handling and controls
   - Trust score rationale
   - 1–2 alternative tools in the same category

5. **Snapshot everything**  
   We store each assessment in **Supabase**:
   - Input query
   - Evidence
   - Scores
   - Brief

   Six months later, you can still see exactly **why** a tool was approved or rejected.

---

## 🛠 Tech Stack

- **Orchestration:** n8n (webhook → evidence branches → scoring → brief)
- **Data and Cache:** Supabase (snapshots and structured evidence)
- **Frontend:** React/Next.js (trust dial, brief viewer, low-evidence warnings)
- **AI:** LLMs for entity resolution, control extraction, and report writing (with strict JSON contracts)

---

### Stop guessing. Start knowing. 
![HawkShot logo](https://i.ibb.co/KpDVDt66/Icon-s.png)

