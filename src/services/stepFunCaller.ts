// src/services/stepFunCaller.ts
import { InvalidAIResponseError } from "../types";
import { getNextEnvKey } from "./envKeys";

let cachedKey: string | null = null;

const getStepFunKey = async () => {
  if (cachedKey) return cachedKey;

  cachedKey = await getNextEnvKey("stepfun");
  return cachedKey;
};

const callStepFunFlash = async (params: {
  systemInstruction: string;
  prompt: string;
  temperature: number;
}): Promise<{ text: string }> => {
  const STEPFUN_API_KEY = await getStepFunKey();

  if (!STEPFUN_API_KEY) {
    throw new Error("CANNOT_RETRIEVE_STEPFUN_KEY");
  }
  
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
