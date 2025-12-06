import React, { useState } from 'react';
import { summarizeYouTube } from '../services/geminiService';
import { YouTubeSummary } from '../types';
import { Youtube, Loader2, List, Lightbulb } from 'lucide-react';

const YouTubeSummaries: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<YouTubeSummary | null>(null);

  const handleSummarize = async () => {
    if (!input) return;
    setIsLoading(true);
    const result = await summarizeYouTube(input);
    setSummary(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
         <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500 mb-2">
            <Youtube size={24} />
         </div>
         <h2 className="text-2xl font-bold text-white">Video Summarizer</h2>
         <p className="text-gray-400">Paste a Topic or Title to get key insights instantly.</p>
      </div>

      <div className="flex gap-2">
         <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Thermodynamics Crash Course or https://youtube.com/..."
            className="flex-1 px-4 py-3 bg-secondary border border-gray-700 rounded-xl focus:border-red-500 outline-none text-white"
         />
         <button
            onClick={handleSummarize}
            disabled={isLoading || !input}
            className="px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl disabled:opacity-50 transition-colors"
         >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Summarize'}
         </button>
      </div>

      {summary && (
        <div className="bg-secondary border border-gray-700 rounded-xl overflow-hidden">
           <div className="bg-red-600/10 p-4 border-b border-red-600/20">
              <h3 className="font-bold text-white text-lg">{summary.title}</h3>
           </div>
           
           <div className="p-6 space-y-6">
              <div>
                 <h4 className="flex items-center text-primary font-bold mb-3">
                    <List size={20} className="mr-2" /> Key Takeaways
                 </h4>
                 <ul className="space-y-2">
                    {summary.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start text-gray-300">
                            <span className="mr-2 text-gray-500">•</span>
                            {point}
                        </li>
                    ))}
                 </ul>
              </div>

              <div>
                 <h4 className="flex items-center text-yellow-500 font-bold mb-3">
                    <Lightbulb size={20} className="mr-2" /> Study Tips
                 </h4>
                 <div className="grid gap-2">
                    {summary.studyTips.map((tip, i) => (
                        <div key={i} className="bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-lg text-sm text-gray-300">
                            {tip}
                        </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeSummaries;
