import React from 'react';
import { Linkedin, Mail, Globe } from 'lucide-react';

const AboutTeam: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Quantexa Learn
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Empowering students with AI-driven tools to master their potential and conquer examinations.
        </p>
      </div>

      <div className="bg-secondary/50 border border-gray-700 p-8 rounded-2xl">
         <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
         <p className="text-gray-400 leading-relaxed">
            We believe that every student deserves personalized guidance. Traditional classrooms can't always cater to individual learning paces. Quantexa Learn bridges that gap by using advanced AI to create adaptive study plans, explain complex concepts simply, and provide unlimited practice resources.
         </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Meet the Founders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Founder 1 */}
            <div className="bg-secondary border border-gray-700 p-6 rounded-2xl flex flex-col items-center text-center hover:border-primary/50 transition-colors group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    A
                </div>
                <h3 className="text-xl font-bold text-white">Akshith</h3>
                <p className="text-primary font-medium mb-3">Technical Lead & Co-Founder</p>
                <p className="text-sm text-gray-400 mb-6">
                    Architecting the AI engines and scalable infrastructure that powers the learning experience.
                </p>
                <div className="flex space-x-4 mt-auto">
                    <button className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors text-white"><Linkedin size={18}/></button>
                    <button className="p-2 bg-gray-800 rounded-full hover:bg-red-500 transition-colors text-white"><Mail size={18}/></button>
                </div>
            </div>

            {/* Founder 2 */}
            <div className="bg-secondary border border-gray-700 p-6 rounded-2xl flex flex-col items-center text-center hover:border-primary/50 transition-colors group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    S
                </div>
                <h3 className="text-xl font-bold text-white">Sonali</h3>
                <p className="text-primary font-medium mb-3">Business & Strategy Lead & Co-Founder</p>
                <p className="text-sm text-gray-400 mb-6">
                    Driving vision, partnerships, and ensuring the product delivers real value to students worldwide.
                </p>
                <div className="flex space-x-4 mt-auto">
                    <button className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors text-white"><Linkedin size={18}/></button>
                    <button className="p-2 bg-gray-800 rounded-full hover:bg-red-500 transition-colors text-white"><Mail size={18}/></button>
                </div>
            </div>
        </div>
      </div>
      
      <div className="text-center pt-8 border-t border-gray-800">
         <p className="text-gray-500 text-sm">© 2024 Quantexa Learn. All rights reserved.</p>
         <p className="text-gray-600 text-xs mt-1">Version 1.0.0 (Beta)</p>
      </div>
    </div>
  );
};

export default AboutTeam;
