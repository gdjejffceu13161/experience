import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Difficulty, GeneratedPuzzle } from "../types";

const apiKey = process.env.API_KEY;

// Create the AI instance
const ai = new GoogleGenAI({ apiKey });

const puzzleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative title for the crossword theme" },
    dimensions: { type: Type.INTEGER, description: "The grid size (e.g. 9, 12, or 15)" },
    words: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "The word answer in Arabic. No spaces." },
          clue: { type: Type.STRING, description: "The hint/clue for the word." },
          row: { type: Type.INTEGER, description: "0-based starting row index" },
          col: { type: Type.INTEGER, description: "0-based starting column index" },
          direction: { type: Type.STRING, enum: ["across", "down"] },
          clueType: { 
            type: Type.STRING, 
            enum: ["standard", "math", "metaphor", "compound", "encrypted", "cultural"],
            description: "The type of smart hint used."
          }
        },
        required: ["text", "clue", "row", "col", "direction", "clueType"],
      }
    }
  },
  required: ["title", "words", "dimensions"]
};

export const generatePuzzle = async (difficulty: Difficulty): Promise<GeneratedPuzzle> => {
  let gridSize = 9;
  let wordCount = 8;
  
  if (difficulty === 'medium') {
    gridSize = 12;
    wordCount = 15;
  } else if (difficulty === 'hard') {
    gridSize = 15;
    wordCount = 20;
  }

  const prompt = `
    You are an expert crossword puzzle architect for Arabic speakers.
    Create a valid crossword puzzle layout.
    
    Difficulty: ${difficulty}.
    Grid Size: ${gridSize}x${gridSize}.
    Target Word Count: Approx ${wordCount} words.
    
    CRITICAL RULES:
    1. All words MUST intersect correctly. The letter at the intersection point must be the same for both the Across and Down words.
    2. All words must be valid Arabic words.
    3. Words must be placed within the 0 to ${gridSize - 1} index range.
    4. Provide a variety of "Smart Hint" types:
       - Standard: Direct definition.
       - Compound: "طائر + فاكهة" (e.g., Bird + Fruit).
       - Metaphorical: "ما يكتبه التاريخ..." (Abstract riddles).
       - Encrypted: Numbers representing alphabet positions (e.g., 1=أ, 2=ب).
       - Cultural: Egyptian/Arab movies, history, famous figures.
       - Math: "5 x 5 - 3" (Answer is a number word or the digits written out).
    
    Output JSON ONLY matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: puzzleSchema,
        temperature: 0.7, // Lower temperature for better structural logic
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");
    
    const puzzleData = JSON.parse(jsonText) as GeneratedPuzzle;
    
    // Fallback if AI hallucinates dimensions
    puzzleData.dimensions = gridSize;

    return puzzleData;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("فشل في توليد اللغز. يرجى المحاولة مرة أخرى.");
  }
};