
import { GoogleGenAI, Modality } from "@google/genai";

const fileToBase64 = (file: File): Promise<{ mimeType: string, data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(';')[0].split(':')[1];
      const data = result.split(',')[1];
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateTryOnImage = async (personImageFile: File, clothingImageFile: File): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const personImageData = await fileToBase64(personImageFile);
  const clothingImageData = await fileToBase64(clothingImageFile);

  const personImagePart = {
    inlineData: {
      mimeType: personImageData.mimeType,
      data: personImageData.data,
    },
  };

  const clothingImagePart = {
    inlineData: {
      mimeType: clothingImageData.mimeType,
      data: clothingImageData.data,
    },
  };

  const textPart = {
    text: "Take the person from the first image and the clothing from the second image. Generate a new image showing the person realistically wearing the clothing item.",
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [personImagePart, clothingImagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("The AI did not return an image. It might have refused the request due to safety policies. Please try with different images.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI model.");
  }
};
