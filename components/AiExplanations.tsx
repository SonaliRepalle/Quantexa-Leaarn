import React, { useState } from 'react';
import { generateExplanation, generateEducationalVideo } from '../services/geminiService';
import { BoardType } from '../types';
import { BrainCircuit, Send, Loader2, Copy, Mic, Video, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AiExplanationsProps {
  board: BoardType;
}

// Extend window for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const AiExplanations: React.FC<AiExplanationsProps> = ({ board }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode] = useState<'text' | 'video'>('text');
  const [isKeySelected, setIsKeySelected] = useState<boolean>(true);

  // Check key status when entering video mode
  React.useEffect(() => {
    if (mode === 'video' && window.aistudio) {
      window.aistudio.hasSelectedApiKey().then((hasKey: boolean) => {
        setIsKeySelected(hasKey);
      });
    }
  }, [mode]);

  const handleExplain = async () => {
    if (!query) return;
    setIsLoading(true);
    setResult(null);
    setVideoUrl(null);

    if (mode === 'text') {
      const explanation = await generateExplanation(query, board);
      setResult(explanation);
    } else {
      // Check Key again before call
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
          setIsKeySelected(false);
          setIsLoading(false);
          return;
      }
      const url = await generateEducationalVideo(query, board);
      setVideoUrl(url);
    }
    
    setIsLoading(false);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };
      
      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
        await window.aistudio.openSelectKey();
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsKeySelected(hasKey);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col animate-fade-in">
       {/* Mode Toggle */}
       <div className="flex justify-center mb-4">
          <div className="bg-secondary border border-gray-700 p-1 rounded-lg flex space-x-1">
             <button
               onClick={() => setMode('text')}
               className={`px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${mode === 'text' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
             >
                <FileText size={16} className="mr-2" /> Text Explanation
             </button>
             <button
               onClick={() => setMode('video')}
               className={`px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${mode === 'video' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
             >
                <Video size={16} className="mr-2" /> AI Video
             </button>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
         {/* Introduction */}
         {!result && !videoUrl && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 opacity-60">
                {mode === 'text' ? (
                   <BrainCircuit size={64} className="mb-4 text-primary" />
                ) : (
                   <Video size={64} className="mb-4 text-accent" />
                )}
                <p className="text-lg">
                    {mode === 'text' 
                        ? `Ask me to explain any concept in Physics, Chem, Math, or Bio.`
                        : `Generate a short AI animated video explanation.`
                    }
                </p>
                <p className="text-sm">Tailored for {board}.</p>
            </div>
         )}

         {/* Query Bubble */}
         {(result || videoUrl) && (
            <div className="flex justify-end">
                <div className="bg-primary/20 border border-primary/30 text-white px-4 py-3 rounded-2xl rounded-tr-none max-w-[80%]">
                    <p className="font-semibold text-sm text-primary mb-1">You asked:</p>
                    {query}
                </div>
            </div>
         )}

         {/* AI Response Bubble */}
         {isLoading && (
            <div className="flex justify-start">
               <div className="bg-secondary border border-gray-700 px-6 py-4 rounded-2xl rounded-tl-none flex items-center">
                  <Loader2 className="animate-spin text-primary mr-3" />
                  <span className="text-gray-300">
                      {mode === 'text' ? 'Generating explanation...' : 'Rendering video (this may take a minute)...'}
                  </span>
               </div>
            </div>
         )}

         {/* Text Result */}
         {result && !isLoading && mode === 'text' && (
            <div className="flex justify-start">
                <div className="bg-secondary border border-gray-700 p-6 rounded-2xl rounded-tl-none max-w-[95%] prose prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-accent">
                    <ReactMarkdown>{result}</ReactMarkdown>
                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end">
                        <button 
                          onClick={() => navigator.clipboard.writeText(result)}
                          className="text-xs text-gray-500 hover:text-white flex items-center"
                        >
                           <Copy size={12} className="mr-1" /> Copy
                        </button>
                    </div>
                </div>
            </div>
         )}

         {/* Video Result */}
         {videoUrl && !isLoading && mode === 'video' && (
            <div className="flex justify-start w-full">
                <div className="bg-secondary border border-gray-700 p-4 rounded-2xl rounded-tl-none w-full max-w-lg">
                    <video controls src={videoUrl} className="w-full rounded-lg" autoPlay />
                </div>
            </div>
         )}
         
         {/* No Key Warning for Video */}
         {mode === 'video' && !isKeySelected && !isLoading && !videoUrl && (
             <div className="flex flex-col items-center justify-center p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                 <p className="text-white mb-4 text-center">Video generation requires a paid API key.</p>
                 <button 
                    onClick={handleSelectKey}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                 >
                     Select API Key
                 </button>
             </div>
         )}
       </div>

       {/* Input Area */}
       <div className="bg-secondary p-4 rounded-xl border border-gray-700 flex items-center gap-2 sticky bottom-0">
          <div className="relative flex-1">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
                placeholder={mode === 'text' ? "Explain Quantum Entanglement..." : "Describe the video you want..."}
                className="w-full bg-black/30 text-white pl-4 pr-10 py-3 rounded-lg outline-none border border-transparent focus:border-primary/50 transition-colors"
            />
            <button 
                onClick={handleVoiceInput}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-700 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
            >
                <Mic size={18} />
            </button>
          </div>
          <button
            onClick={handleExplain}
            disabled={isLoading || !query || (mode === 'video' && !isKeySelected)}
            className="p-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
             <Send size={20} />
          </button>
       </div>
    </div>
  );
};

export default AiExplanations;