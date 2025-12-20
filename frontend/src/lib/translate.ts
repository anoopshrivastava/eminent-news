import axios from "axios";

export const translateText = async (
  text: string,
  source: "en" | "hi",
  target: "en" | "hi"
): Promise<string> => {
  if (!text.trim()) return text;

  const response = await axios.post(
    "https://libretranslate.de/translate",
    {
      q: text,
      source,
      target,
      format: "text",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.translatedText;
};
