// src/services/stepFunCaller.ts
import { InvalidAIResponseError } from "../types";
const STEPFUN_API_KEY = import.meta.env.VITE_STEPFUN_KEY || "";

const callStepFunFlash = async (params: {
  systemInstruction: string;
  prompt: string;
  temperature: number;
}): Promise<{ text: string }> => {
  const { systemInstruction, prompt, temperature } = params;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${STEPFUN_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "stepfun/step-3.5-flash:free",
      temperature,
      messages: [
        {
          role: "system",
          content: systemInstruction
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  const data = await response.json();

  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new InvalidAIResponseError("StepFun returned empty response");
  }

  return { text };
};

export { callStepFunFlash };
