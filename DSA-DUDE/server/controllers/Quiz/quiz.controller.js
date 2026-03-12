import { callGemini as generateQuiz } from "../../utils/gemini.js";

// Expected question shape on the frontend:
// {
//   question: string,
//   options: string[],
//   correctAnswer: string,
//   explanation: string
// }

const generateQuizController = async (req, res) => {
    const { topic, level, count } = req.query;

    if (!topic || !level || !count) {
        return res.status(400).json({ error: "Missing param for generateQuiz" });
    }

    try {
        const n = Number(count) || 10;

        const prompt = `
You are a DSA instructor creating a multiple-choice quiz.

Create ${n} high-quality MCQ questions for data structures and algorithms on the topic: "${topic}".
Difficulty level: "${level}".

Rules:
- Questions should be focused on ${topic} concepts only
- Use clear, beginner-friendly language
- Each question must have 4 options (A, B, C, D style answers)
- Only ONE correct answer per question
- Provide a short explanation for each answer

Output format:
Return ONLY valid JSON (no markdown, no comments, no extra text) with the following exact shape:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": "must be one of the options exactly",
    "explanation": "short explanation of why this answer is correct"
  }
]
`;

        const raw = await generateQuiz(prompt);

        // Sometimes models wrap JSON in ```json ``` fences; strip them if present
        const cleaned = raw
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        if (!Array.isArray(parsed)) {
            return res.status(500).json({ error: "Quiz format invalid from AI" });
        }

        // Ensure minimal shape for frontend
        const questions = parsed.map(q => ({
            question: q.question || "",
            options: Array.isArray(q.options) ? q.options : [],
            correctAnswer: q.correctAnswer || "",
            explanation: q.explanation || ""
        }));

        return res.json({ questions });
    } catch (error) {
        console.error("Failed to generate quiz:", error);
        return res.status(500).json({ error: "Failed to generate quiz" });
    }
};

export default generateQuizController;