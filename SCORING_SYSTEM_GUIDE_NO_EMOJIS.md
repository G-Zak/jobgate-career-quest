# JobGate Scoring System Guide

## Table of Contents
1. [Employability Score](#employability-score)
2. [Recommendation System](#recommendation-system)
3. [Experience & Levels (XP)](#experience--levels-xp)

---

## Employability Score

### What is the Employability Score?
The Employability Score is a comprehensive metric (0-100) that measures your job readiness across multiple skill categories. It adapts based on your chosen career profile to give you the most relevant assessment.

### How It's Calculated

#### 1. **Test Categories**
Your test results are grouped into these categories:
- **Cognitive**: Verbal, Numerical, Logical, Abstract, Spatial, Diagrammatic Reasoning
- **Situational**: Situational Judgment Tests (workplace scenarios)
- **Technical**: Programming and technical skill assessments
- **Analytical**: Data analysis and problem-solving tests
- **Communication**: Language and presentation skills

#### 2. **Profile-Based Weighting**
Different career profiles emphasize different skills:

**Software Engineer Profile:**
- Technical: 35%
- Cognitive: 25%
- Analytical: 20%
- Situational: 15%
- Communication: 5%

**Data Scientist Profile:**
- Analytical: 40%
- Technical: 25%
- Cognitive: 20%
- Communication: 10%
- Situational: 5%

**Product Manager Profile:**
- Situational: 30%
- Communication: 25%
- Analytical: 20%
- Cognitive: 15%
- Technical: 10%

#### 3. **Score Calculation Process**
1. **Individual Test Scores**: Average of all attempts per test type
2. **Category Aggregation**: Group individual tests into high-level categories
3. **Profile Weighting**: Apply career-specific weights to categories
4. **Final Score**: Weighted average normalized to 0-100 scale

### Score Interpretation
- **90-100**: Exceptional - Ready for senior roles
- **80-89**: Excellent - Strong candidate for most positions
- **70-79**: Good - Solid foundation with room for growth
- **60-69**: Fair - Some skill gaps to address
- **Below 60**: Needs Improvement - Focus on fundamental skills

---

## Recommendation System

### How Job Recommendations Work

The recommendation system uses multiple algorithms to match you with the best job opportunities:

#### 1. **Skill Matching (40% weight)**
- **Required Skills**: Must-have skills for the job (higher weight)
- **Preferred Skills**: Nice-to-have skills (lower weight)
- **Skill Categories**: Programming, frontend, backend, database, etc.
- **Matching Score**: Percentage of job skills you possess

#### 2. **Experience Matching (20% weight)**
Years of experience vs. job seniority requirements:
- **Junior**: 0-2 years
- **Intermediate**: 2-5 years
- **Senior**: 5-10 years
- **Expert**: 8-15 years
- **Lead**: 6-12 years

#### 3. **Technical Test Performance (15% weight)**
- Recent test scores in relevant technical areas
- Performance trends and consistency
- Skill-specific assessments

#### 4. **Location & Preferences (15% weight)**
- Geographic location match
- Remote work preferences
- Salary expectations vs. job offer

#### 5. **Cognitive Skills (35% weight)**
- Performance on reasoning tests (verbal, numerical, logical, abstract, spatial)
- Problem-solving capability assessment
- Cognitive improvement trend analysis
- Consistency across different cognitive test types

#### 6. **Employability Score (10% weight)**
- Your overall employability score
- Profile-specific weighting applied
- Recent performance trends

### Detailed Cognitive Skills Calculation

Cognitive skills represent 35% of the recommendation score and are calculated as follows:

#### **Cognitive Skills Components:**

**1. Verbal Reasoning Tests (20% of cognitive score)**
- Reading comprehension and text analysis
- Word analogies and logical relationships
- Conceptual classification and categorization

**2. Numerical Reasoning Tests (25% of cognitive score)**
- Mathematical calculations and data interpretation
- Quantitative problem solving
- Graph and table analysis

**3. Logical Reasoning Tests (20% of cognitive score)**
- Deductive and inductive reasoning
- Critical thinking and argument analysis
- Sequential problem solving

**4. Abstract Reasoning Tests (15% of cognitive score)**
- Pattern recognition and sequences
- Conceptual and spatial thinking
- Non-verbal problem solving

**5. Spatial and Diagrammatic Tests (20% of cognitive score)**
- Mental rotation and spatial visualization
- Diagram and schema interpretation
- Geometric reasoning

#### **Cognitive Calculation Formula:**
```
Cognitive Score = (Verbal × 0.20) + (Numerical × 0.25) + (Logical × 0.20) + 
                  (Abstract × 0.15) + (Spatial × 0.20)
```

#### **Adjustment Factors:**
- **Consistency**: Bonus for stable performance across tests
- **Improvement**: Bonus for recent improvement trends
- **Recency**: Higher weight for recent tests (last 6 months)

### Recommendation Types

**Content-Based Filtering:**
- Matches based on your skills and test performance
- Analyzes job descriptions for skill requirements
- Uses machine learning for semantic matching
- **Cognitive integration**: Analyzes cognitive requirements of positions

**Collaborative Filtering:**
- Finds similar candidates and their successful matches
- Identifies patterns in hiring decisions
- Recommends jobs that similar profiles got hired for
- **Cognitive clustering**: Groups candidates by similar cognitive profiles

**Hybrid Approach:**
- Combines multiple recommendation strategies
- Balances different factors based on your profile
- Continuously learns from your interactions
- **Cognitive optimization**: Adjusts recommendations based on your cognitive strengths

---

## Experience & Levels (XP)

### XP System Overview
The XP (Experience Points) system gamifies your learning journey, rewarding various activities with points that contribute to your overall level.

### XP Sources & Values

#### 1. **Test Completion**
**Base Formula**: `(100 XP × Difficulty Multiplier) + Score Bonus + Length Bonus`

**Difficulty Multipliers:**
- Easy: 1.0× (100 XP)
- Medium: 1.5× (150 XP)
- Hard: 2.0× (200 XP)
- Expert: 2.5× (250 XP)

**Score Bonuses:**
- 90%+ score: +50 XP
- 80%+ score: +30 XP
- 70%+ score: +15 XP
- 60%+ score: +5 XP

**Length Bonus**: `(Questions - 10) × 5 XP` (for tests > 10 questions)

**Example**: Hard test (20 questions, 85% score) = 200 + 30 + 50 = 280 XP

#### 2. **Skills Assessment**
- Base: 75 XP
- Completion Bonus: +25 XP
- Perfect Score Bonus: +100 XP
- Multi-Skill Bonus: `(Skills Count - 1) × 10 XP`

#### 3. **Profile Completion**
- Basic Info: 50 XP
- Skills Added: 25 XP each
- Bio Completed: 30 XP
- CV Uploaded: 75 XP
- Profile Picture: 20 XP
- Career Goals: 40 XP

#### 4. **Daily Engagement**
- Daily Login: 10 XP × streak days (max 30)
- Weekly Streak: 50 XP × week count
- Monthly Streak: 200 XP × month count
- First Test of Day: 15 XP × days

#### 5. **Achievements**
- First Perfect Score: 200 XP
- Test Master (10+ tests): 300 XP
- Speed Master: 150 XP
- Improvement Streak: 100 XP
- Versatile Learner: 250 XP

### Level Progression

| Level | XP Required | Cumulative XP | Title |
|-------|-------------|---------------|-------|
| 1 | 0 | 0 | Career Explorer |
| 2 | 500 | 500 | Skill Seeker |
| 3 | 700 | 1,200 | Knowledge Builder |
| 4 | 1,300 | 2,500 | Test Conqueror |
| 5 | 2,000 | 4,500 | Skill Master |
| 6 | 3,000 | 7,500 | Performance Pro |
| 7 | 4,500 | 12,000 | Excellence Achiever |
| 8 | 6,000 | 18,000 | Career Champion |
| 9 | 8,000 | 26,000 | Industry Expert |
| 10 | 10,000 | 36,000 | Elite Performer |
| 11+ | 14,000+ | 50,000+ | Legendary Professional |

### Level Benefits
- **Level 1-2**: Basic dashboard and test access
- **Level 3-4**: Advanced analytics and skill tracking
- **Level 5-6**: Expert analysis and custom recommendations
- **Level 7-8**: Leadership insights and premium features
- **Level 9-10**: Industry expert status and exclusive content
- **Level 11+**: Elite member benefits and personal advisor

### Progress Calculation
**Progress Percentage**: `(Current XP - Current Level XP) / (Next Level XP - Current Level XP) × 100`

**Example**: User with 3,000 XP at Level 4
- Current Level XP: 2,500
- Next Level XP: 4,500
- Progress: (3,000 - 2,500) / (4,500 - 2,500) × 100 = 25%

---

## Tips for Improvement

### Boosting Your Employability Score
1. **Take Diverse Tests**: Cover all skill categories
2. **Choose the Right Profile**: Select the profile that matches your career goals
3. **Focus on Weak Areas**: Identify low-scoring categories and practice
4. **Retake Tests**: Multiple attempts help improve your average scores
5. **Stay Consistent**: Regular testing shows commitment and improvement

### Maximizing XP Gains
1. **Daily Engagement**: Log in daily to build streaks
2. **Complete Your Profile**: Easy XP from profile completion
3. **Take Challenging Tests**: Higher difficulty = more XP
4. **Aim for High Scores**: Score bonuses add significant XP
5. **Earn Achievements**: Big XP bonuses for milestones

### Getting Better Recommendations
1. **Update Your Skills**: Keep your skill list current
2. **Set Preferences**: Specify location, salary, and work preferences
3. **Take Relevant Tests**: Focus on tests related to your target roles
4. **Maintain High Scores**: Better performance = better job matches
5. **Stay Active**: Regular activity improves recommendation accuracy

---

*This scoring system is designed to provide fair, comprehensive, and actionable feedback to help you advance your career. The algorithms continuously evolve based on industry trends and user feedback.*
