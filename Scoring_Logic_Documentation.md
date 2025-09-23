# Advanced Scoring Logic Documentation
## Career Quest Assessment Platform

**Version:** 1.0  
**Date:** September 2025  
**Authors:** JobGate Development Team  

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Simple Explanation (For Everyone!)](#simple-explanation-for-everyone)
3. [Role-Based Scoring Framework](#role-based-scoring-framework)
4. [Mathematical Formulation](#mathematical-formulation)
5. [Item Scoring Methods](#item-scoring-methods)
6. [Section Score Calculation](#section-score-calculation)
7. [Composite Score & Role Weighting](#composite-score--role-weighting)
8. [Normalization & Percentile Ranking](#normalization--percentile-ranking)
9. [Must-Pass Conditions](#must-pass-conditions)
10. [Integrity Monitoring System](#integrity-monitoring-system)
11. [Implementation Examples](#implementation-examples)
12. [Quality Assurance & Fairness](#quality-assurance--fairness)
13. [Technical Implementation](#technical-implementation)

---

## Executive Summary

The Career Quest platform implements a sophisticated, role-aware scoring system that ensures fair, accurate, and job-relevant assessment of candidates across different career paths. Unlike traditional "one-size-fits-all" approaches, our system recognizes that a Software Engineer and a Finance Analyst require different cognitive and technical competencies for success.

### Key Principles

1. **Role Specificity**: Different weights for different roles based on job requirements
2. **Accuracy First**: 80% accuracy, 20% speed adjustment to prevent gaming
3. **Fairness**: Normalization by role cohort for fair comparison
4. **Integrity**: Comprehensive monitoring without score manipulation
5. **Transparency**: Clear, explainable scoring methodology

---

## Simple Explanation (For Everyone!)

### What Are We Trying to Do?

Imagine you're a teacher who needs to grade tests for students who want different jobs. Some students want to be **computer programmers**, and others want to work in **banks with money**. 

**The Big Question:** Should you grade both students the same way? **NO!** Here's why:

- A programmer needs to be **super good at coding** but only **okay at talking**
- A bank worker needs to be **super good with numbers** but only **okay at coding**

Our system is like a **smart teacher** that knows this difference!

### How Do We Make It Fair?

#### Step 1: Different "Report Cards" for Different Jobs
Just like how your math teacher cares more about math scores than art scores, we create different "importance levels" for each skill:

**For Programmers:**
- Coding: **SUPER IMPORTANT** (25% of final grade)
- Math: **Kind of important** (8% of final grade)
- Writing: **A little important** (6% of final grade)

**For Bank Workers:**
- Numbers/Math: **SUPER IMPORTANT** (20% of final grade)
- Accounting: **Pretty important** (10% of final grade)
- Coding: **Much less important** (0% of final grade)

#### Step 2: The "Speed vs Accuracy" Game
Imagine you're taking a test where you get points for:
- **Getting answers right** (this is worth 80 points)
- **Finishing at a good speed** (this is worth 20 points)

**Too Slow?** You lose a few speed points, but we don't punish you too much
**Too Fast?** You get some bonus points, but not too many (we don't want people to just guess quickly!)

#### Step 3: Comparing Apples to Apples
Instead of comparing a programmer to a bank worker (that's not fair!), we compare:
- Programmers to other programmers
- Bank workers to other bank workers

It's like having separate races for kids and adults - much more fair!

### Catching Cheaters (Without Being Mean)

Our system watches for "suspicious behavior" like:
- Someone answering way too fast (probably guessing)
- Someone leaving the test page to look things up
- Two people giving exactly the same answers at the same time

**But here's the cool part:** Instead of just taking points away, we say "Hey, let's have you take the test again in a supervised room" - giving people a fair second chance!

### The Magic Math (Made Simple!)

Think of our scoring like making a smoothie:

1. **First**, we measure each ingredient (how well you did on each section)
2. **Then**, we add different amounts based on the "recipe" for your job
3. **Finally**, we blend it all together to get your final "smoothie score"

**Example Recipe for Programmer Smoothie:**
- 25% Coding skills
- 12% Problem-solving
- 10% Database knowledge
- 8% Math skills
- ... and so on!

### The "Must-Pass" Rules

Some skills are so important that you MUST be good at them, no matter what:
- Programmers MUST be decent at coding (no exceptions!)
- Bank workers MUST be decent with numbers (no exceptions!)

It's like saying "You can't drive a car without knowing how to brake" - some things are just non-negotiable for safety and success!

### Why This Makes Everyone Happy

**For Job Seekers:** You're judged fairly based on skills that actually matter for your dream job!

**For Companies:** You get candidates who have the right skills for the job!

**For Society:** People end up in jobs where they can succeed and be happy!

### The Bottom Line

Our system is like having the world's smartest, fairest teacher who:
- Knows exactly what each job needs
- Grades everyone fairly within their group
- Catches cheaters but gives second chances
- Explains everything clearly so you understand

**The result?** Everyone gets a fair shot at their dream job, and companies find the right people!

---

## Role-Based Scoring Framework

### Why Role-Based Scoring Matters

Traditional assessments apply uniform scoring across all positions, which fails to capture the nuanced requirements of different careers. Our system addresses this by:

- **Job-Relevant Weighting**: Each role has scientifically-derived weight distributions
- **Must-Pass Thresholds**: Critical competency gates specific to role success
- **Fair Comparison**: Candidates compete within their role cohort
- **Predictive Validity**: Scores correlate with actual job performance

### Supported Role Profiles

#### Software Engineer (SWE)
- **Focus**: Applied coding, system reasoning, logical problem-solving
- **Weight Distribution**: Heavy emphasis on technical skills (43%)
- **Must-Pass**: Coding >= 40th percentile, Logical >= 35th percentile (block high "code-golf / lucky guess" profiles)

#### Finance Analyst
- **Focus**: Quantitative analysis, regulatory knowledge, business judgment
- **Weight Distribution**: Strong numerical emphasis (55% cognitive)
- **Must-Pass**: Numerical >= 45th percentile, Accounting >= 40th percentile (screen out weak quantitative or basics gaps)

---

## Mathematical Formulation

### 1. Item Scoring

For each candidate $c$ and question $i$, we compute item scores based on question type:

#### Single-Choice Questions (MCQ)
$$s_{c,i} = \begin{cases} 
1 & \text{if correct}\\ 
0 & \text{otherwise} 
\end{cases}$$

#### Multi-Choice Questions (Partial Credit)
Let $K$ = set of correct answers, $A$ = set chosen by candidate.

$$s_{c,i} = \max\left(0, \frac{|A \cap K| - |A \setminus K|}{|K|}\right)$$

This formula rewards partial knowledge while penalizing incorrect selections.

#### Numeric Questions
$$s_{c,i} = \begin{cases} 
1 & \text{if } |a_{c,i} - a_i| \leq \varepsilon\\ 
0 & \text{otherwise} 
\end{cases}$$

Where $\varepsilon$ is the acceptable tolerance (typically 0.01 for percentages, 1 for integers).

#### Situational Judgment Tests (SJT)
$$s_{c,i} = f(E_i, a_{c,i})$$

Where $E_i$ is the expert-keyed score and $f$ represents the scoring function (correlation with expert ranking or rubric-based scoring: +2/+1/0/-1).

---

## Section Score Calculation

### Core Components

For section $j$ with $n_j$ items:

#### Accuracy Component
$$A_{c,j} = \frac{\sum_{i=1}^{n_j} s_{c,i}}{n_j}$$

This represents the proportion of points earned in the section.

#### Speed Index Calculation

**Target Time Per Item:**
$$T_j^* = \frac{T_j^{\text{limit}}}{n_j}$$

Where $T_j^{\text{limit}}$ is the total time allowed for section $j$.

**Candidate's Median Time:**
$$T_{c,j} = \text{median}\{t_{c,i}\}_{i=1}^{n_j}$$

**Speed Index (Clamped):**
$$\text{SI}_{c,j} = \min\left(1.3, \max\left(0.7, \frac{T_j^*}{T_{c,j}}\right)\right)$$

#### Final Section Score
$$S_{c,j} = 0.8 \cdot A_{c,j} + 0.2 \cdot (A_{c,j} \cdot \text{SI}_{c,j})$$

### Speed Index Rationale

The speed index serves multiple purposes:

1. **Prevents Gaming**: Clamping prevents extreme speed bonuses/penalties
2. **Rewards Efficiency**: Modest bonus for appropriate pacing
3. **Maintains Fairness**: Accuracy remains the dominant factor (80%)
4. **Reflects Reality**: Time pressure is a component of job performance

#### Speed Index Examples

| Scenario | Target Time | Actual Time | Raw Ratio | Clamped SI | Interpretation |
|----------|-------------|-------------|-----------|------------|----------------|
| Ideal Pace | 60s | 60s | 1.0 | 1.0 | Perfect timing |
| Slightly Fast | 60s | 45s | 1.33 | 1.3 | Efficient (capped) |
| Too Fast | 60s | 20s | 3.0 | 1.3 | Likely rushing |
| Slightly Slow | 60s | 80s | 0.75 | 0.75 | Careful approach |
| Too Slow | 60s | 120s | 0.5 | 0.7 | Struggling (protected) |

---

## Composite Score & Role Weighting

### Role Weight Distribution

Each role $r$ defines weights $w_{r,j}$ for each section $j$, with:
$$\sum_j w_{r,j} = 1$$

#### Software Engineer Weights
| Section | Weight | Rationale |
|---------|--------|-----------|
| Coding | 25% | Core technical skill |
| Logical | 10% | Problem-solving foundation |
| SQL | 10% | Data manipulation |
| Systems/Networking | 8% | Infrastructure understanding |
| Numerical | 8% | Quantitative reasoning |
| Abstract | 8% | Pattern recognition |
| Diagrammatic | 8% | Visual system design |
| Verbal | 6% | Communication basics |
| Spatial | 5% | 3D thinking |
| SJT | 12% | Professional judgment |

#### Finance Analyst Weights
| Section | Weight | Rationale |
|---------|--------|-----------|
| Numerical | 20% | Quantitative foundation |
| Excel/SQL | 15% | Data analysis tools |
| SJT | 15% | Business judgment |
| Accounting | 10% | Domain knowledge |
| Verbal | 10% | Communication |
| Logical | 10% | Analytical thinking |
| Abstract | 7% | Pattern recognition |
| Regulation | 5% | Compliance knowledge |
| Diagrammatic | 4% | Visual analysis |
| Spatial | 4% | Minimal requirement |

### Composite Score Formula

For candidate $c$ in role $r$:
$$C_{c,r} = \sum_j w_{r,j} \cdot S_{c,j}$$

This ensures that candidates are evaluated based on skills most relevant to their target role.

---

## Normalization & Percentile Ranking

### Z-Score Calculation

Across all candidates for role $r$, compute:
- Mean: $\mu_r = \frac{1}{N_r} \sum_{c=1}^{N_r} C_{c,r}$
- Standard deviation: $\sigma_r = \sqrt{\frac{1}{N_r-1} \sum_{c=1}^{N_r} (C_{c,r} - \mu_r)^2}$

Z-score for candidate $c$:
$$Z_{c,r} = \frac{C_{c,r} - \mu_r}{\sigma_r}$$

### Percentile Conversion

$$P_{c,r} = \Phi(Z_{c,r}) \times 100$$

Where $\Phi$ is the cumulative distribution function of the standard normal distribution.

### Dynamic Norm Tables

- **Rolling Windows**: 6-12 month periods for stability
- **Minimum Sample Size**: 200 candidates before reliable percentiles
- **Fallback Strategy**: Global norms when role-specific data insufficient
- **Geographic Adjustment**: Regional norms when sample size permits

---

## Must-Pass Conditions

### Pass/Fail Logic

Candidate $c$ passes for role $r$ if **both** conditions are met:

1. **Overall Threshold**: $P_{c,r} \geq \tau_r$ (e.g., 60th percentile)
2. **Must-Pass Sections**: $P_{c,j} \geq \tau_{r,j} \; \forall j \in \text{MustPass}(r)$

### Rationale for Must-Pass Sections

Must-pass thresholds prevent candidates from compensating critical skill gaps with strength in less relevant areas:

- **SWE**: Strong communication cannot overcome poor coding ability
- **Finance**: Excellent abstract reasoning cannot substitute weak numerical skills

---

## Integrity Monitoring System

### Overview

Our integrity system monitors behavior patterns without manipulating scores. Instead, it flags suspicious attempts for review or retake.

### 1. Response Time Effort (RTE)

For item $i$ in section $j$, define effort threshold $\tau_i$ (e.g., 10th percentile of honest response times):

$$e_{c,i} = \mathbf{1}\{t_{c,i} \geq \tau_i\}$$

$$\text{RTE}_{c,j} = \frac{1}{n_j}\sum_{i=1}^{n_j} e_{c,i}$$

Low RTE values indicate potential rapid guessing.

### 2. Speed-Accuracy Inconsistency

Using empirical item difficulty $p_i$ (proportion correct), flag unexpected patterns:

$$u_{c,i} = \mathbf{1}\{(p_i < 0.2 \wedge \text{correct}_{c,i} \wedge t_{c,i} < t_i^{\text{fast}}) \lor (p_i > 0.8 \wedge \neg\text{correct}_{c,i} \wedge t_{c,i} > t_i^{\text{slow}})\}$$

$$U_{c,j} = \frac{1}{n_j}\sum_{i=1}^{n_j} u_{c,i}$$

High $U_{c,j}$ suggests suspicious mismatch between speed and accuracy.

### 3. Focus & Interaction Monitoring

Track behavioral signals:
- Blur/focus switches: $B_c$
- Copy/paste events: $C_c$
- Out-of-focus time: $T_c^{\text{blur}}$

Normalized metrics:
$$F_c = \frac{T_c^{\text{blur}}}{T_c^{\text{len}}}, \quad B_c^{\text{norm}} = \frac{B_c}{1 + \log(1 + T_c^{\text{len}}/60)}$$

### 4. Collusion Detection

For candidates $a, b$ testing within time window $\Delta t$:

**Answer Similarity:**
$$S_{ab} = \frac{\mathbf{x}_a \cdot \mathbf{x}_b}{\|\mathbf{x}_a\| \|\mathbf{x}_b\|}$$

**Timing Correlation:**
$$\rho_{ab}^{(t)} = \text{corr}(\{t_{a,i}\}, \{t_{b,i}\})$$

**Collusion Flag:**
$$\text{SIM}_{ab} = \mathbf{1}\{S_{ab} > 0.95 \wedge \rho_{ab}^{(t)} > 0.8 \wedge |t_a - t_b| < \Delta t\}$$

### 5. Composite Integrity Risk

$$R_c = \alpha_1 R_c^{\text{time}} + \alpha_2 R_c^{\text{incon}} + \alpha_3 R_c^{\text{focus}} + \alpha_4 R_c^{\text{sim}} + \ldots$$

Where each $R_c^{(\cdot)} \in [0,1]$ represents normalized risk in that dimension.

### 6. Decision Policy

$$\text{Decision}(c) = \begin{cases} 
\text{Valid} & \text{if } R_c < 0.40\\
\text{Retake (supervised)} & \text{if } 0.40 \leq R_c < 0.70\\
\text{Invalid} & \text{if } R_c \geq 0.70
\end{cases}$$

**Hard Stops** (automatic Invalid):
- RTE < 0.40 (excessive rapid guessing)
- Confirmed collusion ($\text{SIM}_{ab} = 1$)

---

## Implementation Examples

### Scenario A: Software Engineer Candidate

**Test Performance:**

| Section | Accuracy | Median Time (s) | Speed Index | Section Score |
|---------|----------|----------------|-------------|---------------|
| Numerical | 0.82 | 55 | 1.09 | 0.835 |
| Verbal | 0.76 | 70 | 0.86 | 0.738 |
| Logical | 0.88 | 60 | 1.00 | 0.880 |
| Abstract | 0.74 | 65 | 0.92 | 0.729 |
| Diagrammatic | 0.80 | 58 | 1.03 | 0.805 |
| Spatial | 0.70 | 62 | 0.97 | 0.696 |
| SJT | 0.71 | 75 | 0.80 | 0.682 |
| Coding | 0.77 | 65 | 0.92 | 0.758 |
| SQL | 0.83 | 60 | 1.00 | 0.830 |
| Systems | 0.72 | 70 | 0.86 | 0.699 |

**SWE Composite Score:**
$$C_{\text{SWE}} = 0.25 \times 0.758 + 0.10 \times 0.880 + 0.10 \times 0.830 + \ldots = 76.7\%$$

**Interpretation:** Strong technical foundation with solid logical reasoning. Meets coding and logical must-pass thresholds. **Recommendation: Advance to interview.**

### Scenario B: Finance Analyst Candidate

**Test Performance:**

| Section | Accuracy | Median Time (s) | Speed Index | Section Score |
|---------|----------|----------------|-------------|---------------|
| Numerical | 0.86 | 58 | 1.03 | 0.866 |
| Verbal | 0.81 | 62 | 0.97 | 0.805 |
| Logical | 0.78 | 60 | 1.00 | 0.780 |
| Abstract | 0.70 | 70 | 0.86 | 0.680 |
| Diagrammatic | 0.66 | 75 | 0.80 | 0.634 |
| Spatial | 0.64 | 80 | 0.75 | 0.608 |
| SJT | 0.79 | 65 | 0.92 | 0.778 |
| Excel/SQL | 0.82 | 60 | 1.00 | 0.820 |
| Accounting | 0.76 | 70 | 0.86 | 0.738 |
| Regulation | 0.73 | 75 | 0.80 | 0.701 |

**Finance Composite Score:**
$$C_{\text{Finance}} = 0.20 \times 0.866 + 0.15 \times 0.820 + 0.15 \times 0.778 + \ldots = 77.8\%$$

**Interpretation:** Excellent quantitative skills with solid domain knowledge. Meets numerical and accounting must-pass requirements. **Recommendation: Advance to final interview.**

### Key Insight

Note that both candidates scored similarly (76.7% vs 77.8%), but their strength profiles align with their target roles. The SWE candidate excels in coding and logical reasoning, while the Finance candidate shows superior numerical and accounting capabilities.

---

## Interpretation & Actions (Recruiter Guidance)

This section translates numeric scores into practical, actionable recommendations for recruiters and hiring teams. It covers how to interpret composite scores, percentiles, section-level performance, must-pass flags, and integrity risks. The guidance aims to be clear, defensible, and operational.

### 1. Overview: What to look for
- **Composite Percentile (role-aware)**: Primary signal for ranking candidates. Example: "SWE Composite: 78th percentile".
- **Section Strengths**: Sections with high S_{c,j}; used to tailor interview focus (e.g., deep technical questions vs. case-study business problems).
- **Must-Pass Flags**: Non-negotiable checks. Any failure is an immediate filter (or requires an approved exception).
- **Integrity Decision**: Valid / Retake (supervised) / Invalid. Integrity issues do not change scores but change next steps.

### 2. Quick Decision Matrix

- Composite >= 70th percentile AND no must-pass failures AND Integrity = Valid
  - Action: Invite to final interview (role-specific deep technical loop).

- Composite 50th--70th percentile, no must-pass failures, Integrity = Valid
  - Action: Invite to screening interview; consider targeted assessment (pair-programming, case study).

- Composite < 50th percentile OR any must-pass failure
  - Action: Reject or reroute to a role with different weights if appropriate; for must-pass failure, automatic reject unless hiring manager approves remediating steps.

- Integrity = Retake (supervised)
  - Action: Offer supervised retake; if retake clears, process as usual.

- Integrity = Invalid
  - Action: Reject and log for compliance; optionally, ask for human review if high-value candidate.

### 3. Guided Interview Plan (Templates)
Below are example interview plans produced automatically from the score breakdown.

Example: SWE candidate (Composite: 76th pct)
- Focus areas (30 min): Pair-programming (40%), System design (20%)
- Soft-skills (15 min): Team fit & communication
- Red flags to probe: SJT low vs composite — discuss past teamwork/conflict situations

Example: Finance candidate (Composite: 78th pct)
- Focus areas (30 min): Financial modeling / Excel case (40%), Accounting basics (20%)
- Soft-skills (15 min): Commercial judgement & stakeholder communication
- Red flags to probe: Regulation knowledge shallow — ask regulatory compliance examples

### 4. Candidate Feedback Template
Provide short, constructive feedback to candidates using section-level language. Example:

"Thank you for completing the assessment. Your profile shows strong Numerical and Accounting skills (Top 25% for Finance), with room to improve in Regulation. We recommend a shortlist interview focused on quantitative modeling and casework."

### 5. Example JSON Payload for Recruiter UI
This payload is what a recruiter UI can receive after scoring an attempt:

{
  "candidate_id": 12345,
  "role": "swe",
  "composite": 0.767,
  "percentile": 76,
  "section_scores": {
    "coding": 0.758,
    "logical": 0.880,
    "sql": 0.830,
    "sjt": 0.682
  },
  "must_pass": {
    "coding": {"threshold_pct": 40, "passed": true},
    "logical": {"threshold_pct": 35, "passed": true}
  },
  "integrity": {"risk": 0.12, "decision": "valid"},
  "recommendation": "Invite to final interview (engineering loop)"
}

### 6. Automated Actions & Workflows
- Auto-generate calendar invites for interviews if composite >= 70th & integrity valid.
- Create a "needs-manager-review" task if must-pass failed but composite >= 75th (rare but possible).
- Queue "supervised retake" emails if integrity decision is Retake.

### 7. Edge Cases & Manager Overrides
- **High composite but must-pass fail**: Allow a manager override only after documented remediation plan (e.g., take a short technical exercise, submit additional evidence).
- **Low N for Norms**: If role norms are unstable (N &lt; 200), the system should display a warning and use fallback norms; recruiter should consider human review.

### 8. Logging & Audit Trail
Record every decision step in the candidate's audit log with: raw scores, percentiles, must-pass flags, integrity details, and recruiter actions. This is critical for fairness audits and legal defensibility.

---