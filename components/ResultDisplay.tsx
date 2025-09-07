
import React from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null;
}

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center p-8 bg-indigo-50 rounded-lg">
    <LoadingSpinner />
    <p className="mt-4 text-lg font-semibold text-indigo-700">Our virtual stylist is at work...</p>
    <p className="text-sm text-indigo-500">This might take a moment.</p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-6 bg-red-50 border-l-4 border-red-400 rounded-lg">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </div>
  </div>
);

const GeneratedImageState: React.FC<{ src: string }> = ({ src }) => (
    <div className="p-2 border border-gray-200 rounded-lg bg-gray-100 shadow-inner">
      <img src={src} alt="Generated Try-On" className="w-full h-auto object-contain rounded-md" style={{ maxHeight: '70vh' }} />
    </div>
);

const InitialState: React.FC = () => (
    <div className="text-center p-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <h4 className="text-lg font-medium text-gray-700">Your Result Will Appear Here</h4>
        <p className="text-gray-500 mt-1">Upload your photos and click "Virtually Try On" to see the magic happen.</p>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, generatedImage }) => {
  return (
    <div className="w-full min-h-[200px] flex items-center justify-center">
      {isLoading && <LoadingState />}
      {error && !isLoading && <ErrorState message={error} />}
      {generatedImage && !isLoading && !error && <GeneratedImageState src={generatedImage} />}
      {!isLoading && !error && !generatedImage && <InitialState />}
    </div>
  );
};
