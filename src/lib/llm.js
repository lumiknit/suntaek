const llmConfigStorageKey = "--llm-config";

// Google Gemini

const GEMINI_DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com";
/**
 * Execute gemini to generate text.
 */
const runGemini = async (config, systemPrompt, userPrompt) => {
  const textPart = (role, text) => ({
    role,
    parts: [{ text }],
  });
  const prompt = systemPrompt + "\n\nUser:\n" + userPrompt;

  const baseURL = config.baseURL || GEMINI_DEFAULT_BASE_URL;
  const url = `${baseURL}/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [textPart("user", prompt)],
    }),
  });
  if (!resp.ok) {
    throw new Error("Failed to openai request: " + (await resp.text()));
  }
  const data = await resp.json();
  return data.candidates[0].content.parts[0].text;
};

// OpenAI GPT

const GPT_DEFAULT_BASE_URL = "https://api.openai.com";
/**
 * Execute gemini to generate text.
 */
const runGPT = async (config, systemPrompt, userPrompt) => {
  const baseURL = config.baseURL || GEMINI_DEFAULT_BASE_URL;
  const resp = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });
  if (!resp.ok) {
    throw new Error("Failed to openai request: " + (await resp.text()));
  }
  const data = await resp.json();
  return data.choices[0].message.content;
};

// Common interface

export const TYPES = ["gemini", "gpt"];

export const LLM_INFO = {
  gemini: {
    models: [
      "gemini-2.0-flash-lite",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-1.0-pro",
    ],
    apiKeyURL: "https://aistudio.google.com/app/apikey",
    defaultBaseURL: GEMINI_DEFAULT_BASE_URL,
    run: runGemini,
  },
  gpt: {
    models: ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo", "gpt-4"],
    apiKeyURL: "https://platform.openai.com/api-keys",
    defaultBaseURL: GPT_DEFAULT_BASE_URL,
    run: runGPT,
  },
};

export const runLLM = async (config, systemPrompt, userPrompt) => {
  const info = LLM_INFO[config.type];
  return info.run(config, systemPrompt, userPrompt);
};

const defaultLLMConfig = () => ({
  type: "gemini",
  model: "gemini-1.5-flash",
  apikey: "",
  baseURL: null,
});

export const saveLLMConfig = async (config) => {
  localStorage.setItem(llmConfigStorageKey, JSON.stringify(config));
};

/**
 * Load the LLM configuration from local storage.
 */
export const loadLLMConfig = () => {
  const config = defaultLLMConfig();
  const storedConfig = localStorage.getItem(llmConfigStorageKey);
  if (storedConfig) {
    try {
      Object.assign(config, JSON.parse(storedConfig));
    } catch (e) {
      console.error("Failed to parse LLM config from local storage", e);
      saveLLMConfig(config);
    }
  }
  return config;
};
