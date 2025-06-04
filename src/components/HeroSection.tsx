
import React from 'react';
import { Upload, Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Lance sua música para o <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">mundo</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          A plataforma completa para artistas independentes distribuírem, promoverem e monetizarem sua música
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2">
            <Upload size={24} />
            Faça Upload da Sua Música
          </button>
          <button className="border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2">
            <Play size={24} />
            Explore Músicas
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
