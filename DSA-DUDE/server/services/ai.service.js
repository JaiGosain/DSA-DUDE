import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json"
  }
});


// ================= VALIDATE PROBLEM =================
export const aiValidateProblem = async (problem, constraints, code) => {
  const prompt = `
You are a DSA expert. Validate the following code for the given problem and constraints.

Rules:
- Language: C++ (primarily, but be flexible if code is clear)
- Identify if the logic is correct for the problem described.
- Output JSON only.

Respond format:
{
  "isCorrect": boolean,
  "reason": "Explain why it's correct or what is wrong",
  "correctedCode": "Provide well-formatted corrected code if incorrect, otherwise null",
  "problemType": "array, string, tree, graph, etc.",
  "complexity": { "time": "O(n)", "space": "O(1)" },
  "suggestedInput": "Example JSON input"
}

Problem:
${problem}

Constraints:
${constraints}

Code:
${code}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini validate error:", error);
    throw new Error("AI validation failed");
  }
};


// ================= GENERATE TRACE =================
export const aiGenerateTrace = async (code, input, problemType) => {
  // Split code into lines for line number reference
  const codeLines = code.split('\n');
  
  const prompt = `
You are a friendly coding tutor helping a beginner understand how code executes step-by-step.

Generate a detailed, beginner-friendly execution trace for the following code and input.

IMPORTANT RULES:
1. Write explanations in SIMPLE, CLEAR language that a beginner can understand
2. Use everyday analogies when helpful (e.g., "like checking each item in a shopping list")
3. Reference the EXACT line number being executed (1-indexed)
4. Explain WHAT is happening and WHY it matters
5. Show variable values clearly at each step
6. For arrays, show which element is being accessed and why
7. Make each step feel like a teacher explaining to a student

Schema (MUST follow exactly):
{
  "meta": { 
    "problemType": "${problemType || "array"}", 
    "activeStructure": "array/pointers/etc",
    "codeLines": ${JSON.stringify(codeLines)}
  },
  "input": ${JSON.stringify(input)},
  "steps": [
    {
      "lineNumber": number,  // Line number being executed (1-indexed)
      "explanation": "Simple, beginner-friendly explanation of what's happening. Use analogies. Explain WHY.",
      "codeSnippet": "The actual line of code being executed",
      "state": {
        "i": number,           // Current value of i (if exists)
        "j": number,           // Current value of j (if exists)
        "currentValue": any,   // Value being processed
        "resultState": any,    // Current state of result/output array
        "variables": {          // All relevant variables at this step
          "variableName": "value"
        }
      },
      "highlight": ["i", "j"]  // Which variables/indices to highlight
    }
  ]
}

Input: ${JSON.stringify(input)}
Code:
${code}

Generate a trace that helps a beginner understand every step clearly!
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini trace error:", error);
    throw new Error("AI trace generation failed");
  }
};
