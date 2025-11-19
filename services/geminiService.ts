
import { GoogleGenAI, Type } from "@google/genai";
import { Emotion, emotionList } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: base64EncodedData, mimeType: file.type },
  };
};

export const analyzeAudioForEmotion = async (audioBlob: Blob) => {
  const audioFile = new File([audioBlob], "audio.webm", { type: "audio/webm" });
  const audioPart = await fileToGenerativePart(audioFile);

  const prompt = `You are a professional transcriber and emotion analyst.
  Task 1: Transcribe the user's speech in the provided audio exactly as spoken. Be verbatim. Do not summarize, do not rephrase, and do not interpret the meaning in the transcript. If they say "Umm, I am sad", write "Umm, I am sad".
  Task 2: Identify the single most dominant emotion from this list: ${emotionList.join(', ')}.
  Pay close attention to the semantic content. If they explicitly state an emotion, prioritize that.
  If no clear emotion is detected, classify it as 'neutral'.
  Return a valid JSON object.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: prompt },
                audioPart,
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    transcript: { type: Type.STRING },
                    emotion: { type: Type.STRING, enum: [...emotionList, 'default'] }
                },
                required: ['transcript', 'emotion']
            }
        }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    return result;

  } catch (error) {
    console.error("Error analyzing audio with Gemini:", error);
    throw new Error("Failed to analyze emotion from audio.");
  }
};

// Updated function for real-time analysis with context
export const analyzeAudioChunkForEmotion = async (audioBlob: Blob, contextTranscript: string): Promise<{ transcript: string; emotion: Emotion }> => {
  const audioFile = new File([audioBlob], "audio.webm", { type: "audio/webm" });
  const audioPart = await fileToGenerativePart(audioFile);

  const prompt = `You are a professional transcriber. The user is speaking.
  Previous Context: "${contextTranscript}"
  Task 1: Transcribe the NEW audio clip exactly as spoken. Do NOT summarize. Write exactly what was said.
  Task 2: Determine the dominant emotion of this clip from: ${emotionList.join(', ')}.
  Return a valid JSON object with 'transcript' and 'emotion'.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: prompt },
                audioPart,
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    transcript: { type: Type.STRING },
                    emotion: { type: Type.STRING, enum: [...emotionList, 'default'] }
                },
                required: ['transcript', 'emotion']
            }
        }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    return {
        transcript: result.transcript || '',
        emotion: result.emotion as Emotion || 'default'
    };

  } catch (error) {
    console.error("Error analyzing audio chunk with Gemini:", error);
    // Don't throw; return default to prevent UI interruption during live analysis.
    return { transcript: '', emotion: 'default' };
  }
};
