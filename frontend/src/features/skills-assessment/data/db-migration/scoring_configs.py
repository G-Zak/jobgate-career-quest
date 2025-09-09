"""
Test-Specific Scoring Configurations and Rules
Defines scoring parameters for SJT, Verbal, and Spatial tests
"""

# SJT Scoring Configuration
SJT_SCORING_CONFIG = {
    "name": "SJT Comprehensive Scoring",
    "test_type": "sjt",
    "scoring_method": "competency_based",
    "difficulty_weights": {
        "easy": 1.0,
        "medium": 1.2,
        "hard": 1.5
    },
    "category_weights": {
        "teamwork": 1.2,           # High importance
        "leadership": 1.3,         # Very high importance
        "ethics": 1.4,             # Critical for workplace
        "communication": 1.1,      # Important
        "customer_service": 1.0,   # Standard
        "conflict": 1.2,           # High importance
        "inclusivity": 1.1,        # Important
        "safety": 1.3              # Very high importance
    },
    "time_penalty_factor": 0.05,   # 5% penalty for time overruns
    "guess_correction": False,      # No guess correction for SJT
    "scale_min": 0,
    "scale_max": 100
}

# Verbal Reasoning Scoring Configuration
VERBAL_SCORING_CONFIG = {
    "name": "Verbal Reasoning Adaptive Scoring",
    "test_type": "verbal",
    "scoring_method": "weighted_difficulty",
    "difficulty_weights": {
        "easy": 1.0,
        "medium": 1.5,
        "hard": 2.0
    },
    "category_weights": {
        "analogies": 1.3,          # Complex reasoning
        "blood_relations": 1.2,    # Logical thinking
        "classification": 1.0,     # Pattern recognition
        "coding_decoding": 1.1     # Problem solving
    },
    "time_penalty_factor": 0.02,   # Light time penalty
    "guess_correction": True,       # Apply guess correction
    "scale_min": 200,              # SAT-style scale
    "scale_max": 800
}

# Spatial Reasoning Scoring Configuration
SPATIAL_SCORING_CONFIG = {
    "name": "Spatial Reasoning Performance Scoring",
    "test_type": "spatial",
    "scoring_method": "irt_score",
    "difficulty_weights": {
        "easy": 1.0,
        "medium": 1.8,
        "hard": 2.5                # Spatial reasoning hard questions are very valuable
    },
    "category_weights": {
        "mental_rotation": 1.4,     # Core spatial ability
        "shape_assembly": 1.2,      # Construction skills
        "spatial_visualization": 1.3, # Visualization ability
        "cross_sections": 1.1,      # Technical skill
        "perspective_changes": 1.2,  # 3D understanding
        "spatial_memory": 1.0       # Memory component
    },
    "time_penalty_factor": 0.03,   # Moderate time penalty
    "guess_correction": True,       # Apply guess correction
    "scale_min": 100,
    "scale_max": 200
}

# Performance Level Definitions
PERFORMANCE_LEVELS = {
    "excellent": {
        "min_percentage": 90,
        "description": "Exceptional performance demonstrating mastery",
        "color": "#22c55e",  # Green
        "recommendations": [
            "Consider leadership or mentoring roles",
            "Apply skills to complex challenges",
            "Share expertise with others"
        ]
    },
    "proficient": {
        "min_percentage": 80,
        "description": "Strong performance meeting professional standards",
        "color": "#3b82f6",  # Blue
        "recommendations": [
            "Maintain current skill level",
            "Seek opportunities to apply skills",
            "Consider specialization in strong areas"
        ]
    },
    "developing": {
        "min_percentage": 70,
        "description": "Good foundation with room for improvement",
        "color": "#f59e0b",  # Yellow
        "recommendations": [
            "Focus on consistent practice",
            "Seek feedback and guidance",
            "Target specific skill gaps"
        ]
    },
    "basic": {
        "min_percentage": 60,
        "description": "Basic understanding, significant improvement needed",
        "color": "#f97316",  # Orange
        "recommendations": [
            "Prioritize fundamental skill building",
            "Consider additional training",
            "Practice regularly with feedback"
        ]
    },
    "below_basic": {
        "min_percentage": 0,
        "description": "Skills need substantial development",
        "color": "#ef4444",  # Red
        "recommendations": [
            "Focus on foundational concepts",
            "Seek comprehensive training",
            "Consider intensive practice programs"
        ]
    }
}

# Test-Specific Recommendations Database
TEST_RECOMMENDATIONS = {
    "sjt": {
        "teamwork": {
            "weak": [
                "Practice active listening and collaborative problem-solving",
                "Study team dynamics and group decision-making processes",
                "Seek opportunities to work in diverse team environments"
            ],
            "strong": [
                "Consider team leadership roles",
                "Mentor others in collaborative skills",
                "Apply teamwork skills to complex projects"
            ]
        },
        "leadership": {
            "weak": [
                "Study leadership theories and styles",
                "Practice delegation and motivation techniques",
                "Observe effective leaders in action"
            ],
            "strong": [
                "Seek leadership opportunities",
                "Develop others' leadership potential",
                "Take on challenging leadership roles"
            ]
        },
        "ethics": {
            "weak": [
                "Review professional codes of conduct",
                "Study ethical decision-making frameworks",
                "Practice ethical dilemma resolution"
            ],
            "strong": [
                "Serve as an ethics advisor or committee member",
                "Help establish ethical guidelines",
                "Mentor others in ethical decision-making"
            ]
        },
        "communication": {
            "weak": [
                "Practice clear and concise communication",
                "Study active listening techniques",
                "Work on presentation and writing skills"
            ],
            "strong": [
                "Take on communication-intensive roles",
                "Train others in communication skills",
                "Lead important communications initiatives"
            ]
        }
    },
    "verbal": {
        "analogies": {
            "weak": [
                "Practice identifying relationships between concepts",
                "Study vocabulary and word relationships",
                "Work on abstract thinking exercises"
            ],
            "strong": [
                "Apply analytical thinking to complex problems",
                "Help others develop reasoning skills",
                "Pursue roles requiring analytical thinking"
            ]
        },
        "blood_relations": {
            "weak": [
                "Practice logical reasoning problems",
                "Work on family tree and relationship puzzles",
                "Develop systematic problem-solving approaches"
            ],
            "strong": [
                "Take on complex logical analysis tasks",
                "Help others with logical reasoning",
                "Consider careers in analysis or research"
            ]
        },
        "classification": {
            "weak": [
                "Practice pattern recognition exercises",
                "Work on categorization and grouping skills",
                "Study classification systems and taxonomies"
            ],
            "strong": [
                "Apply pattern recognition to data analysis",
                "Help organize complex information systems",
                "Consider roles in data science or research"
            ]
        }
    },
    "spatial": {
        "mental_rotation": {
            "weak": [
                "Practice 3D visualization exercises",
                "Work with physical 3D puzzles and models",
                "Use computer-based spatial training programs"
            ],
            "strong": [
                "Consider careers in engineering or design",
                "Apply 3D skills to complex spatial problems",
                "Help others develop spatial reasoning"
            ]
        },
        "shape_assembly": {
            "weak": [
                "Practice construction and assembly tasks",
                "Work with building blocks and puzzles",
                "Study mechanical and structural concepts"
            ],
            "strong": [
                "Consider careers in engineering or architecture",
                "Take on complex design and construction projects",
                "Mentor others in spatial construction skills"
            ]
        }
    }
}

# Scoring Rubrics for Different Industries/Roles
INDUSTRY_SCORING_RUBRICS = {
    "technology": {
        "sjt_weights": {
            "teamwork": 1.3,
            "leadership": 1.2,
            "ethics": 1.1,
            "communication": 1.2
        },
        "verbal_emphasis": ["analogies", "classification"],
        "spatial_emphasis": ["mental_rotation", "spatial_visualization"]
    },
    "healthcare": {
        "sjt_weights": {
            "ethics": 1.5,
            "communication": 1.4,
            "teamwork": 1.3,
            "safety": 1.5
        },
        "verbal_emphasis": ["blood_relations", "classification"],
        "spatial_emphasis": ["cross_sections", "spatial_visualization"]
    },
    "finance": {
        "sjt_weights": {
            "ethics": 1.4,
            "leadership": 1.3,
            "communication": 1.2,
            "customer_service": 1.2
        },
        "verbal_emphasis": ["analogies", "coding_decoding"],
        "spatial_emphasis": ["classification", "pattern_recognition"]
    },
    "education": {
        "sjt_weights": {
            "communication": 1.5,
            "inclusivity": 1.4,
            "ethics": 1.3,
            "conflict": 1.2
        },
        "verbal_emphasis": ["communication", "classification"],
        "spatial_emphasis": ["spatial_visualization", "mental_rotation"]
    }
}

# Time Expectations (in seconds per question)
TIME_EXPECTATIONS = {
    "sjt": {
        "easy": 45,      # 45 seconds for easy SJT questions
        "medium": 60,    # 1 minute for medium
        "hard": 90       # 1.5 minutes for hard
    },
    "verbal": {
        "easy": 30,      # 30 seconds for easy verbal
        "medium": 45,    # 45 seconds for medium
        "hard": 75       # 1.25 minutes for hard
    },
    "spatial": {
        "easy": 60,      # 1 minute for easy spatial
        "medium": 90,    # 1.5 minutes for medium
        "hard": 120      # 2 minutes for hard spatial questions
    }
}

# Percentile Benchmarks (based on typical test populations)
PERCENTILE_BENCHMARKS = {
    "sjt": {
        "90th": 85,      # 85% score puts you in 90th percentile
        "75th": 78,
        "50th": 70,      # Median performance
        "25th": 62,
        "10th": 55
    },
    "verbal": {
        "90th": 88,
        "75th": 80,
        "50th": 72,
        "25th": 64,
        "10th": 56
    },
    "spatial": {
        "90th": 82,      # Spatial reasoning tends to have lower scores
        "75th": 75,
        "50th": 65,
        "25th": 55,
        "10th": 45
    }
}

# Adaptive Scoring Parameters
ADAPTIVE_SCORING = {
    "item_difficulty_range": (-3.0, 3.0),    # IRT difficulty parameter range
    "ability_start": 0.0,                     # Starting ability estimate
    "ability_bounds": (-4.0, 4.0),           # Ability estimate bounds
    "se_target": 0.3,                        # Target standard error
    "min_questions": 10,                     # Minimum questions before stopping
    "max_questions": 50                      # Maximum questions
}
