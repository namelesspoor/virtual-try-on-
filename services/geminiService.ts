
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
    text: "You will be provided with two images. One contains a person and the other contains an article of clothing. Your task is to first identify which image contains the person and which contains the clothing. Then, identify the category of the clothing item (e.g., t-shirt, jacket, dress) to determine where on the person's body it should be placed. Finally, create a new, highly photorealistic image of the person wearing the clothing. Pay close attention to the material texture of the garment, the interplay of light and shadow, and the natural folds and wrinkles as the fabric conforms to the person's body shape. The final output must be a high-quality image showing the person naturally wearing the garment. Do not include any text in the output image.",
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
