
import React, { useState, useCallback } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { Header } from './components/Header';
import { generateTryOnImage } from './services/geminiService';
import { ArrowRightIcon } from './components/icons/ArrowRightIcon';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [clothingImage, setClothingImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTryOn = useCallback(async () => {
    if (!personImage || !clothingImage) {
      setError('Please upload both images before trying on.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateTryOnImage(personImage, clothingImage);
      setGeneratedImage(`data:image/png;base64,${resultBase64}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to generate image: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [personImage, clothingImage]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-200">
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Welcome to the future of shopping! Upload a photo of yourself and an item of clothing to see how it looks on you instantly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ImageUpload
              title="Step 1: Your Photo"
              description="Upload a clear, full-body photo."
              onImageSelect={setPersonImage}
            />
            <ImageUpload
              title="Step 2: Clothing Item"
              description="Upload a photo of the clothing."
              onImageSelect={setClothingImage}
            />
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={handleTryOn}
              disabled={!personImage || !clothingImage || isLoading}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              {isLoading ? 'Generating Your Look...' : 'Virtually Try On'}
              {!isLoading && <ArrowRightIcon />}
            </button>
          </div>

          <ResultDisplay
            isLoading={isLoading}
            error={error}
            generatedImage={generatedImage}
          />
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
