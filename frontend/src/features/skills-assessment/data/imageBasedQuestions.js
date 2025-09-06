// Image path helper for spatial reasoning questions
// This makes it easy to update image paths when you add new screenshots

export const getQuestionImagePath = (questionId) => {
  return `/src/assets/images/spatial/questions/question_${questionId}.png`;
};

export const getOptionImagePath = (questionId, optionLetter) => {
  return `/src/assets/images/spatial/options/question_${questionId}_option_${optionLetter.toLowerCase()}.png`;
};

// Sample image-based test data structure
export const getImageBasedTestData = () => ({
  id: 1,
  title: "Spatial Reasoning Assessment",
  description: "Visual spatial intelligence test with image-based questions",
  duration_minutes: 25,
  total_questions: 6,
  questions: [
    {
      id: 1,
      question_type: "image_based",
      question_text: "Study the spatial pattern shown below and select the correct answer:",
      context: "Analyze the shape and its orientation carefully.",
      question_image: getQuestionImagePath(1),
      options: [
        { id: "A", image: getOptionImagePath(1, "A"), text: "Option A" },
        { id: "B", image: getOptionImagePath(1, "B"), text: "Option B" },
        { id: "C", image: getOptionImagePath(1, "C"), text: "Option C" },
        { id: "D", image: getOptionImagePath(1, "D"), text: "Option D" }
      ],
      correct_answer: "A",
      order: 1,
      complexity_score: 1
    },
    {
      id: 2,
      question_type: "image_based",
      question_text: "Identify the correct rotation or transformation:",
      context: "Compare the shapes and their spatial relationships.",
      question_image: getQuestionImagePath(2),
      options: [
        { id: "A", image: getOptionImagePath(2, "A"), text: "Option A" },
        { id: "B", image: getOptionImagePath(2, "B"), text: "Option B" },
        { id: "C", image: getOptionImagePath(2, "C"), text: "Option C" },
        { id: "D", image: getOptionImagePath(2, "D"), text: "Option D" }
      ],
      correct_answer: "B",
      order: 2,
      complexity_score: 2
    },
    {
      id: 3,
      question_type: "image_based",
      question_text: "Which option completes the spatial pattern?",
      context: "Look for the logical continuation of the sequence.",
      question_image: getQuestionImagePath(3),
      options: [
        { id: "A", image: getOptionImagePath(3, "A"), text: "Option A" },
        { id: "B", image: getOptionImagePath(3, "B"), text: "Option B" },
        { id: "C", image: getOptionImagePath(3, "C"), text: "Option C" },
        { id: "D", image: getOptionImagePath(3, "D"), text: "Option D" }
      ],
      correct_answer: "C",
      order: 3,
      complexity_score: 3
    },
    {
      id: 4,
      question_type: "image_based",
      question_text: "Select the view that shows the object from a different angle:",
      context: "Consider the 3D perspective and hidden surfaces.",
      question_image: getQuestionImagePath(4),
      options: [
        { id: "A", image: getOptionImagePath(4, "A"), text: "Option A" },
        { id: "B", image: getOptionImagePath(4, "B"), text: "Option B" },
        { id: "C", image: getOptionImagePath(4, "C"), text: "Option C" },
        { id: "D", image: getOptionImagePath(4, "D"), text: "Option D" }
      ],
      correct_answer: "D",
      order: 4,
      complexity_score: 2
    },
    {
      id: 5,
      question_type: "image_based",
      question_text: "Which shape can be folded to create the target object?",
      context: "Visualize the folding process and final 3D form.",
      question_image: getQuestionImagePath(5),
      options: [
        { id: "A", image: getOptionImagePath(5, "A"), text: "Option A" },
        { id: "B", image: getOptionImagePath(5, "B"), text: "Option B" },
        { id: "C", image: getOptionImagePath(5, "C"), text: "Option C" },
        { id: "D", image: getOptionImagePath(5, "D"), text: "Option D" }
      ],
      correct_answer: "A",
      order: 5,
      complexity_score: 4
    },
    {
      id: 6,
      question_type: "image_based",
      question_text: "Find the matching spatial relationship:",
      context: "Analyze the proportions and spatial arrangements.",
      question_image: getQuestionImagePath(6),
      options: [
        { id: "A", image: getOptionImagePath(6, "A"), text: "Option A" },
        { id: "B", image: getOptionImagePath(6, "B"), text: "Option B" },
        { id: "C", image: getOptionImagePath(6, "C"), text: "Option C" },
        { id: "D", image: getOptionImagePath(6, "D"), text: "Option D" }
      ],
      correct_answer: "B",
      order: 6,
      complexity_score: 3
    }
  ]
});
