import { GoogleGenAI, Type, FunctionDeclaration, Content, Part } from "@google/genai";
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
        description: "The type of update action: 'add_item', 'update_personal'",
        enum: ["add_item", "update_personal"]
      },
      sectionType: {
        type: Type.STRING,
        description: "Target section for items (EXPERIENCE, EDUCATION, SKILLS, PROJECTS, LANGUAGES)",
        enum: ["EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS", "LANGUAGES"]
      },
      data: {
        type: Type.OBJECT,
        description: "The data to add or update",
        properties: {
          title: { type: Type.STRING, description: "Job title, School name, or Skill name" },
          subtitle: { type: Type.STRING, description: "Company, Degree, or Role" },
          date: { type: Type.STRING },
          description: { type: Type.STRING },
          location: { type: Type.STRING },
          fullName: { type: Type.STRING },
          email: { type: Type.STRING },
          summary: { type: Type.STRING },
          linkedin: { type: Type.STRING },
          phone: { type: Type.STRING },
          website: { type: Type.STRING }
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
    // Context preparation
    const cvContext = JSON.stringify(currentCV);
    
    const systemInstructionText = `
      Sen profesyonel bir İnsan Kaynakları uzmanı ve CV danışmanısın.
      Kullanıcının şu anki CV verisi: ${cvContext}
      
      Görevlerin:
      1. Kullanıcının CV'sine eklemesi gereken bilgiler konusunda tavsiye ver (tarih formatı, madde işaretleri, güçlü fiiller vb.).
      2. Kullanıcı "şunu ekle" dediğinde "update_cv" aracını kullanarak CV'yi güncelle.
      3. Türkçe konuş.
      4. Profesyonel, cesaretlendirici ve net ol.
    `;

    // Ensure strictly typed Content array for history
    const validHistory: Content[] = history.map(h => ({
      role: h.role,
      parts: h.parts.map(p => ({ text: p.text || " " } as Part))
    }));

    try {
      const chat = this.ai.chats.create({
        model: this.model,
        config: {
          systemInstruction: systemInstructionText,
          tools: [{ functionDeclarations: [updateCVTool] }],
        },
        history: validHistory
      });

      // Send message with correct signature { message: ... }
      const result = await chat.sendMessage({ message: message });
      
      const toolCalls = result.functionCalls;
      
      let toolResponse = null;
      let modelResponseText = result.text || "";

      if (toolCalls && toolCalls.length > 0) {
        toolResponse = toolCalls[0];
        // Provide a fallback text if the model only returned a function call
        if (!modelResponseText) {
          modelResponseText = "İsteğiniz üzerine CV'nizi güncelliyorum...";
        }
      }

      return {
        text: modelResponseText,
        toolCall: toolResponse
      };

    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return { text: "Üzgünüm, bir bağlantı hatası oluştu. Lütfen tekrar deneyin.", toolCall: null };
    }
  }
}