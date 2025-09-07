
import React from 'react';
import { WardrobeIcon } from './icons/WardrobeIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-5 flex items-center justify-center">
        <WardrobeIcon />
        <h1 className="text-3xl font-bold text-gray-800 ml-3 tracking-tight">
          Virtual Try-On AI
        </h1>
      </div>
    </header>
  );
};
