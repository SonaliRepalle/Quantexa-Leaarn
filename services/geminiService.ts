import { GoogleGenAI, Type } from "@google/genai";
import { StudyDay, QuizQuestion, Flashcard, MindMapNode, YouTubeSummary, BoardType } from "../types";

const apiKey = process.env.API_KEY || '';

// Helper to get AI instance safely
const getAI = () => {
  // Always create a new instance to ensure we pick up the latest key if it changed
  // (e.g. via window.aistudio.openSelectKey)
  const key = process.env.API_KEY || '';
  if (!key) {
    console.warn("No API Key provided. AI features will fail.");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const generateStudyPlan = async (
  subjects: string,
  weakTopics: string,
  hours: number,
  days: number,
  board: BoardType
): Promise<StudyDay[]> => {
  const ai = getAI();
  const prompt = `Create a structured ${days}-day study plan for a ${board} student.
  Subjects: ${subjects}.
  Weak Areas: ${weakTopics}.
  Daily Study Time: ${hours} hours.
  
  Return ONLY a JSON array where each object has:
  - day (number)
  - subject (string)
  - focusTopic (string)
  - practiceTime (string, e.g. "45 mins")
  - revisionTime (string, e.g. "30 mins")`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER },
              subject: { type: Type.STRING },
              focusTopic: { type: Type.STRING },
              practiceTime: { type: Type.STRING },
              revisionTime: { type: Type.STRING },
            }
          }
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text) as StudyDay[];
    }
    return [];
  } catch (error) {
    console.error("Error generating plan:", error);
    return [];
  }
};

export const generateExplanation = async (topic: string, board: BoardType): Promise<string> => {
  const ai = getAI();
  const prompt = `Explain the concept "${topic}" for a ${board} student. 
  Provide a step-by-step breakdown. Use markdown for formatting. 
  Keep it clear, concise, and educational.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Error generating explanation:", error);
    return "Error communicating with AI.";
  }
};

export const generateQuiz = async (subject: string, topic: string, count: number, board: BoardType): Promise<QuizQuestion[]> => {
  const ai = getAI();
  const prompt = `Generate ${count} multiple choice questions for ${board} ${subject} on the topic "${topic}".
  Return a JSON array. Each object must have:
  - id (number)
  - question (string)
  - options (array of 4 strings)
  - correctAnswer (index of the correct option, 0-3)`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const solvePastPaperQuestion = async (question: string, board: BoardType): Promise<string> => {
  const ai = getAI();
  const prompt = `Solve this ${board} exam question step-by-step:\n\n"${question}"\n\nProvide the final answer clearly at the end.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate solution.";
  } catch (error) {
    console.error("Error solving question:", error);
    return "Error communicating with AI.";
  }
};

export const generateFlashcards = async (notes: string): Promise<Flashcard[]> => {
  const ai = getAI();
  const prompt = `Create flashcards from the following notes. Return JSON array with 'front' and 'back' properties.\n\nNotes: ${notes}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING },
              back: { type: Type.STRING },
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Flashcard[];
    }
    return [];
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return [];
  }
};

export const generateMindMap = async (topic: string): Promise<MindMapNode> => {
  const ai = getAI();
  const prompt = `Create a hierarchical mindmap structure for the topic: "${topic}".
  Return a JSON object representing the root node. 
  Each node has 'name' (string) and optional 'children' (array of nodes).
  Limit depth to 3 levels.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    if (response.text) {
      return JSON.parse(response.text) as MindMapNode;
    }
    return { name: topic, children: [] };
  } catch (error) {
    console.error("Error generating mindmap:", error);
    return { name: topic, children: [] };
  }
};

export const summarizeYouTube = async (urlOrTopic: string): Promise<YouTubeSummary> => {
  const ai = getAI();
  const prompt = `Provide a comprehensive educational summary for a video or topic about: "${urlOrTopic}".
  
  Return JSON with:
  - title (string)
  - keyPoints (array of strings)
  - studyTips (array of strings)`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                studyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as YouTubeSummary;
    }
    return { title: "Error", keyPoints: [], studyTips: [] };
  } catch (error) {
    console.error("Error generating summary:", error);
    return { title: "Error", keyPoints: [], studyTips: [] };
  }
};

export const generateEducationalVideo = async (topic: string, board: BoardType): Promise<string | null> => {
  const ai = getAI();
  const prompt = `Create a short, engaging educational video animation explaining: "${topic}". The target audience is a ${board} student. Focus on visual clarity.`;
  
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;

    // Fetch the video content using the current API Key
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error generating video:", error);
    return null;
  }
};
