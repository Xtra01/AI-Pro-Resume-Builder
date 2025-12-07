import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { CVData } from "../types";

// Define the tool for updating CV data
const updateCVTool: FunctionDeclaration = {
  name: "update_cv",
  description: "Update the user's CV with new information. Use this when the user asks to add experience, education, skills, or update personal details.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: {
        type: Type.STRING,
        description: "The type of update action: 'add_item', 'update_personal', 'add_section'",
        enum: ["add_item", "update_personal", "add_section"]
      },
      sectionType: {
        type: Type.STRING,
        description: "Target section for items (EXPERIENCE, EDUCATION, SKILLS, PROJECTS)",
        enum: ["EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS", "LANGUAGES"]
      },
      data: {
        type: Type.OBJECT,
        description: "The data to add or update",
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          date: { type: Type.STRING },
          description: { type: Type.STRING },
          location: { type: Type.STRING },
          fullName: { type: Type.STRING },
          email: { type: Type.STRING },
          summary: { type: Type.STRING },
          linkedin: { type: Type.STRING }
        }
      }
    },
    required: ["action", "data"]
  }
};

export class GeminiService {
  private ai: GoogleGenAI;
  private model: string = "gemini-2.5-flash";

  constructor() {
    const apiKey = process.env.API_KEY || "";
    this.ai = new GoogleGenAI({ apiKey });
  }

  async chatWithCVContext(
    history: { role: 'user' | 'model'; parts: { text: string }[] }[],
    message: string,
    currentCV: CVData
  ) {
    // We inject the current CV state as a system instruction context implicitly
    // or by prepending it to the chat history, but systemInstruction is cleaner.
    const cvContext = JSON.stringify(currentCV);
    
    const systemInstruction = `
      Sen profesyonel bir İnsan Kaynakları uzmanı ve CV danışmanısın.
      Kullanıcının şu anki CV verisi: ${cvContext}
      
      Görevlerin:
      1. Kullanıcının CV'sine eklemesi gereken bilgiler konusunda tavsiye ver (tarih formatı, madde işaretleri, güçlü fiiller vb.).
      2. Kullanıcı "şunu ekle" dediğinde "update_cv" aracını kullanarak CV'yi güncelle.
      3. Türkçe konuş.
      4. Profesyonel, cesaretlendirici ve net ol.
    `;

    try {
      const chat = this.ai.chats.create({
        model: this.model,
        config: {
          systemInstruction: systemInstruction,
          tools: [{ functionDeclarations: [updateCVTool] }],
        },
        history: history
      });

      const result = await chat.sendMessage(message);
      
      // Check for function calls
      const toolCalls = result.functionCalls;
      
      let toolResponse = null;
      let modelResponseText = result.text || "";

      if (toolCalls && toolCalls.length > 0) {
        // Return the tool call data so the App can execute it
        toolResponse = toolCalls[0];
        modelResponseText = "CV'nizi güncelliyorum...";
      }

      return {
        text: modelResponseText,
        toolCall: toolResponse
      };

    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return { text: "Üzgünüm, şu an yanıt veremiyorum. Lütfen API anahtarını kontrol et.", toolCall: null };
    }
  }
}