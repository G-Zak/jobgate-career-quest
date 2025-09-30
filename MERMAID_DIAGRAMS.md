# JobGate Platform - Mermaid Diagrams

This file contains Mermaid diagram code that can be rendered in Markdown viewers, GitHub, or converted to images.

---

## Diagram 1: System Architecture (Layered View)

```mermaid
graph TB
    subgraph Frontend["🎨 Frontend Layer<br/>React + Vite + TailwindCSS + Framer Motion"]
        FE1[📊 Candidate Dashboard]
        FE2[✏️ Test Engine]
        FE3[📈 Analytics & Visualization]
    end
    
    subgraph API["🔌 API Gateway Layer<br/>Django REST Framework"]
        API1[🔐 Authentication API<br/>JWT Auth, User Management]
        API2[📝 Test Submission API<br/>Answer Processing, Validation]
        API3[🎯 Scoring API<br/>Score Calculation, Metrics]
        API4[💼 Recommendation API<br/>Job Matching, Rankings]
    end
    
    subgraph Business["⚙️ Business Logic Layer<br/>Core Application Services"]
        BL1[🔧 Test Engine Service<br/>• Question Management<br/>• Test Session Handling<br/>• Timer & Progress Tracking]
        BL2[📊 Scoring Service<br/>• Score Calculation<br/>• Employability Metrics<br/>• Profile-Based Weighting]
        BL3[🎯 Recommendation Engine<br/>• Job Matching Algorithm<br/>• Candidate Ranking<br/>• Similarity Calculation]
    end
    
    subgraph ML["🤖 ML/AI Components Layer<br/>Scikit-learn • NumPy • Pandas"]
        ML1[🔬 Clustering Algorithms<br/>• K-Means Clustering<br/>• Candidate Segmentation<br/>• Feature Extraction]
        ML2[🤝 Collaborative Filtering<br/>• User-Based Filtering<br/>• Pattern Recognition<br/>• Hiring Success Analysis]
        ML3[🔍 Content-Based Filtering<br/>• Skill Matching<br/>• Requirement Analysis<br/>• Cosine Similarity]
    end
    
    subgraph Data["💾 Data Layer<br/>PostgreSQL Database"]
        DB1[(👤 User Profiles<br/>Skills, Experience, Preferences)]
        DB2[(📋 Test Results<br/>Scores, Sessions, History)]
        DB3[(💼 Job Offers<br/>Requirements, Descriptions)]
        DB4[(📊 Analytics Data<br/>Metrics, Trends, Insights)]
    end
    
    Frontend -->|HTTP/REST API Calls| API
    API -->|Business Logic Calls| Business
    Business -->|ML/AI Processing| ML
    ML -->|Data Persistence & Retrieval| Data
    
    style Frontend fill:#E3F2FD,stroke:#2196F3,stroke-width:3px
    style API fill:#E8F5E9,stroke:#4CAF50,stroke-width:3px
    style Business fill:#FFF3E0,stroke:#FF9800,stroke-width:3px
    style ML fill:#F3E5F5,stroke:#9C27B0,stroke-width:3px
    style Data fill:#ECEFF1,stroke:#607D8B,stroke-width:3px
```

---

## Diagram 2: Candidate Journey Workflow

```mermaid
graph LR
    A[👤 STEP 1<br/>Registration<br/>━━━━━━━━━━<br/>• Create account<br/>• Email verification<br/>• Basic authentication<br/><br/>⏱️ ~2 minutes]
    B[📝 STEP 2<br/>Profile Setup<br/>━━━━━━━━━━<br/>• Personal information<br/>• Skills & experience<br/>• Career preferences<br/><br/>⏱️ ~5 minutes]
    C[✏️ STEP 3<br/>Skills Tests<br/>━━━━━━━━━━<br/>• Cognitive tests 8 types<br/>• Technical assessments<br/>• Situational judgment<br/><br/>⏱️ ~30-45 minutes]
    D[🎯 STEP 4<br/>Scoring & Analysis<br/>━━━━━━━━━━<br/>• Calculate scores<br/>• Performance metrics<br/>• Category aggregation<br/><br/>⏱️ Real-time]
    E[📊 STEP 5<br/>Employability Score<br/>━━━━━━━━━━<br/>• Profile-based weighting<br/>• Multi-dimensional scoring<br/>• 0-100 scale calculation<br/><br/>⏱️ Instant]
    F[🔬 STEP 6<br/>AI Clustering<br/>━━━━━━━━━━<br/>• K-Means algorithm<br/>• Candidate segmentation<br/>• Similarity grouping<br/><br/>⏱️ ~1 second]
    G[💼 STEP 7<br/>Job Matching<br/>━━━━━━━━━━<br/>• AI-powered matching<br/>• Hybrid filtering<br/>• Ranked recommendations<br/><br/>⏱️ Real-time]
    H[📈 STEP 8<br/>Dashboard & Insights<br/>━━━━━━━━━━<br/>• Performance analytics<br/>• XP & level tracking<br/>• Personalized insights<br/><br/>⏱️ Ongoing]
    
    A -->|Account Created| B
    B -->|Profile Complete| C
    C -->|Tests Submitted| D
    D -->|Scores Calculated| E
    E -->|Score Generated| F
    F -->|Cluster Assigned| G
    G -->|Jobs Matched| H
    H -.->|Retake Tests / Improve| C
    
    style A fill:#4CAF50,stroke:#388E3C,stroke-width:3px,color:#fff
    style B fill:#2196F3,stroke:#1976D2,stroke-width:3px,color:#fff
    style C fill:#FF9800,stroke:#F57C00,stroke-width:3px,color:#fff
    style D fill:#9C27B0,stroke:#7B1FA2,stroke-width:3px,color:#fff
    style E fill:#E91E63,stroke:#C2185B,stroke-width:3px,color:#fff
    style F fill:#00BCD4,stroke:#0097A7,stroke-width:3px,color:#fff
    style G fill:#673AB7,stroke:#512DA8,stroke-width:3px,color:#fff
    style H fill:#FF5722,stroke:#E64A19,stroke-width:3px,color:#fff
```

---

## Diagram 3: Data Flow Architecture (Alternative View)

```mermaid
flowchart TD
    User[👤 Candidate User]
    
    subgraph Client["Client Side"]
        UI[React UI Components]
        State[State Management<br/>Zustand]
        Router[React Router]
    end
    
    subgraph Server["Server Side"]
        Auth[Authentication<br/>JWT Tokens]
        TestAPI[Test Management API]
        ScoreAPI[Scoring API]
        RecAPI[Recommendation API]
    end
    
    subgraph Processing["Processing Layer"]
        TestEngine[Test Engine]
        ScoreCalc[Score Calculator]
        MLEngine[ML Engine]
    end
    
    subgraph Storage["Storage"]
        Cache[(Redis Cache)]
        DB[(PostgreSQL)]
        Files[File Storage]
    end
    
    User -->|Interacts| UI
    UI <-->|State Updates| State
    UI <-->|Navigation| Router
    
    Client -->|HTTPS/REST| Server
    
    Auth -->|Validates| TestAPI
    Auth -->|Validates| ScoreAPI
    Auth -->|Validates| RecAPI
    
    TestAPI --> TestEngine
    ScoreAPI --> ScoreCalc
    RecAPI --> MLEngine
    
    TestEngine --> DB
    ScoreCalc --> DB
    MLEngine --> DB
    
    Server <-->|Session Data| Cache
    TestEngine -->|Store Files| Files
    
    style Client fill:#E3F2FD,stroke:#2196F3,stroke-width:2px
    style Server fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
    style Processing fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
    style Storage fill:#F3E5F5,stroke:#9C27B0,stroke-width:2px
```

---

## Diagram 4: Recommendation Engine Flow

```mermaid
graph TD
    Start[Candidate Completes Tests]
    
    subgraph Input["Input Data Collection"]
        I1[Test Scores]
        I2[Skills Profile]
        I3[Experience Level]
        I4[Location Preferences]
        I5[Cognitive Scores]
    end
    
    subgraph Processing["Recommendation Processing"]
        P1[Calculate Employability Score<br/>Profile-Based Weighting]
        P2[Run K-Means Clustering<br/>Find Similar Candidates]
        P3[Content-Based Filtering<br/>Skill Matching 40%]
        P4[Collaborative Filtering<br/>Pattern Recognition]
        P5[Hybrid Algorithm<br/>Combine All Factors]
    end
    
    subgraph Scoring["Match Scoring"]
        S1[Skills Match: 40%]
        S2[Experience Match: 20%]
        S3[Technical Tests: 15%]
        S4[Location: 15%]
        S5[Cognitive Skills: 35%]
        S6[Employability: 10%]
    end
    
    subgraph Output["Output"]
        O1[Ranked Job List]
        O2[Match Percentages]
        O3[Recommendation Explanations]
    end
    
    Start --> Input
    I1 --> P1
    I2 --> P1
    I3 --> P2
    I4 --> P3
    I5 --> P1
    
    P1 --> P5
    P2 --> P4
    P3 --> P5
    P4 --> P5
    
    P5 --> Scoring
    
    S1 --> O1
    S2 --> O1
    S3 --> O1
    S4 --> O1
    S5 --> O1
    S6 --> O1
    
    O1 --> O2
    O2 --> O3
    
    style Input fill:#E3F2FD,stroke:#2196F3,stroke-width:2px
    style Processing fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
    style Scoring fill:#F3E5F5,stroke:#9C27B0,stroke-width:2px
    style Output fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
```

---

## Diagram 5: Test Submission Flow

```mermaid
sequenceDiagram
    participant C as Candidate
    participant UI as React UI
    participant API as Django API
    participant TE as Test Engine
    participant SC as Scoring Service
    participant DB as Database
    participant ML as ML Engine
    
    C->>UI: Start Test
    UI->>API: GET /api/tests/{test_id}/questions
    API->>TE: Fetch Questions
    TE->>DB: Query Questions
    DB-->>TE: Return Questions
    TE-->>API: Questions Data
    API-->>UI: Questions JSON
    UI-->>C: Display Test
    
    C->>UI: Submit Answers
    UI->>API: POST /api/tests/submit
    API->>TE: Validate Submission
    TE->>SC: Calculate Score
    SC->>DB: Save Test Session
    SC->>DB: Save Submissions
    
    SC->>SC: Calculate Employability Score
    SC->>ML: Trigger Clustering
    ML->>DB: Update Cluster Assignment
    ML->>ML: Generate Recommendations
    ML->>DB: Save Recommendations
    
    DB-->>API: Confirmation
    API-->>UI: Results + Score + Recommendations
    UI-->>C: Display Results Dashboard
    
    Note over C,ML: Total Time: ~1-2 seconds
```

---

## Diagram 6: Employability Scoring Algorithm

```mermaid
graph TD
    Start[Test Results Input]
    
    subgraph Categories["Test Categories"]
        C1[Cognitive Tests<br/>VRT, NRT, LRT, ART, SRT, DRT]
        C2[Situational Tests<br/>SJT]
        C3[Technical Tests<br/>TAT, Programming]
        C4[Analytical Tests<br/>Data Analysis]
        C5[Communication Tests<br/>Language Skills]
    end
    
    subgraph Profiles["Career Profiles"]
        P1[Software Engineer<br/>Tech: 35%, Cog: 25%, Ana: 20%<br/>Sit: 15%, Com: 5%]
        P2[Data Scientist<br/>Ana: 40%, Tech: 25%, Cog: 20%<br/>Com: 10%, Sit: 5%]
        P3[Product Manager<br/>Sit: 30%, Com: 25%, Ana: 20%<br/>Cog: 15%, Tech: 10%]
    end
    
    subgraph Calculation["Score Calculation"]
        Agg[Aggregate Category Scores]
        Weight[Apply Profile Weights]
        Norm[Normalize to 0-100]
    end
    
    Result[Employability Score<br/>0-100 Scale]
    
    Start --> Categories
    C1 --> Agg
    C2 --> Agg
    C3 --> Agg
    C4 --> Agg
    C5 --> Agg
    
    Profiles --> Weight
    Agg --> Weight
    Weight --> Norm
    Norm --> Result
    
    style Categories fill:#E3F2FD,stroke:#2196F3,stroke-width:2px
    style Profiles fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
    style Calculation fill:#F3E5F5,stroke:#9C27B0,stroke-width:2px
    style Result fill:#E8F5E9,stroke:#4CAF50,stroke-width:3px
```

---

## How to Use These Diagrams

### Rendering Options:

1. **GitHub/GitLab:**
   - Copy the Mermaid code blocks into your README.md
   - They will render automatically

2. **Mermaid Live Editor:**
   - Visit: https://mermaid.live/
   - Paste the code
   - Export as PNG or SVG

3. **VS Code:**
   - Install "Markdown Preview Mermaid Support" extension
   - View in markdown preview

4. **Notion:**
   - Use `/code` block
   - Select "Mermaid" as language
   - Paste the code

5. **Confluence:**
   - Install Mermaid plugin
   - Use Mermaid macro

6. **Command Line:**
   ```bash
   # Install mermaid-cli
   npm install -g @mermaid-js/mermaid-cli
   
   # Generate PNG
   mmdc -i diagram.mmd -o diagram.png -w 1600 -H 900
   ```

### Customization:

- **Colors:** Modify `style` lines at the end of each diagram
- **Layout:** Change `graph TD` (top-down) to `graph LR` (left-right)
- **Icons:** Add emoji or text icons in node labels
- **Spacing:** Add `<br/>` for line breaks in nodes

---

*These Mermaid diagrams provide a quick way to visualize the JobGate architecture and workflows. They can be easily rendered, edited, and exported for your internship showcase.*
