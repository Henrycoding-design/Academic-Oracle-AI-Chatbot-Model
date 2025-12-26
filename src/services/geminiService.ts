
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Message } from '../types';

const SYSTEM_INSTRUCTION = `You are the 'Academic Oracle', a world-class polymath and supportive mentor. 
Your scope is UNLIMITED: from primary education and competitive exams (IGCSE, SAT, AP, IELTS) to University-level research and professional Industrial practices.

Your Interaction Framework:
1. START: If you don't know the user's name, greet them warmly and ask for their name and what they are currently studying or working on.
2. VALIDATE: Always start by acknowledging the user's input. If they share a thought or answer, tell them exactly what they got right and where the logic might be slipping.
3. DECIDE:
   - If the student is close to a breakthrough, use the Socratic method (HINTING). Give them a small push to find the answer themselves.
   - If the topic is a new fundamental concept, a complex industrial process, or if the student is clearly frustrated/stuck, EXPLAIN it clearly with high-quality analogies.
4. PACING: Ask only ONE question at a time. Do not overwhelm the user with multiple questions or a wall of text. Wait for their response before moving to the next part of the dialogue.
5. TONE: Professional yet highly encouraging. Adapt your vocabulary to the user's level (e.g., simpler for IGCSE, more technical for University/Industrial).
6. CONCLUDE: After helping, offer a 'Mastery Check' question or suggest a practical industrial application of the concept.

Always maintain a hidden 'Student Profile' in your context: Name, Level, Confidence. Use this to maintain consistency across the session.`;


let chatInstance: Chat | null = null;
let currentApiKey: string | null = null;

export const getChat = (apiKey: string): Chat => {
  // 🔁 Same user, same chat → full context preserved
  if (chatInstance && currentApiKey === apiKey) {
    return chatInstance;
  }

  // 🆕 New user OR new session
  const ai = new GoogleGenAI({ apiKey });

  chatInstance = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  currentApiKey = apiKey;
  return chatInstance;
};

export const resetChat = () => {
  chatInstance = null;
  currentApiKey = null;
};

export const sendMessageToBot = async (
  message: string,
  apiKey: string
): Promise<string> => {
  const chat = getChat(apiKey);
  const response: GenerateContentResponse = await chat.sendMessage({ message });
  return response.text || "I'm sorry, I couldn't process that academic query.";
};