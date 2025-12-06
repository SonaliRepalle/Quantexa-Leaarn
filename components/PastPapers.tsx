import React, { useState } from 'react';
import { solvePastPaperQuestion } from '../services/geminiService';
import { BoardType, PastPaperQuestion } from '../types';
import { FileText, ChevronRight, Loader2, X, GraduationCap, Filter } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PastPapersProps {
  board: BoardType;
}

// Mock Data
const MOCK_PAPERS: PastPaperQuestion[] = [
  { id: '1', year: '2023', subject: 'Physics', topic: 'Mechanics', source: 'Paper 1', question: 'A particle moves along a straight line with velocity v = 3t^2 - 2t. Calculate the acceleration at t=2s and the distance traveled in the first 2 seconds.' },
  { id: '2', year: '2022', subject: 'Chemistry', topic: 'Bonding', source: 'Paper 2', question: 'Explain the difference in boiling points between H2O and H2S in terms of intermolecular forces.' },
  { id: '3', year: '2023', subject: 'Mathematics', topic: 'Calculus', source: 'Paper 1', question: 'Find the area enclosed by the curve y = x^2 and the line y = 2x.' },
  { id: '4', year: '2021', subject: 'Biology', topic: 'Genetics', source: 'Paper 1', question: 'Describe the process of transcription in protein synthesis.' },
  { id: '5', year: '2023', subject: 'Physics', topic: 'Electricity', source: 'Paper 2', question: 'Calculate the total resistance of three resistors 2Ω, 4Ω, and 6Ω connected in parallel.' },
  { id: '6', year: '2022', subject: 'Chemistry', topic: 'Organic', source: 'Paper 1', question: 'Draw the mechanism for the nucleophilic substitution reaction of bromoethane with aqueous sodium hydroxide.' },
];

const PastPapers: React.FC<PastPapersProps> = ({ board }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<PastPaperQuestion | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterTopic, setFilterTopic] = useState('All');

  const handleGetSolution = async (q: PastPaperQuestion) => {
    setSelectedQuestion(q);
    setLoading(true);
    setSolution(null);
    const sol = await solvePastPaperQuestion(q.question, board);
    setSolution(sol);
    setLoading(false);
  };

  // Filter papers
  const filteredPapers = MOCK_PAPERS.filter(p => 
      (filterSubject === 'All' || p.subject === filterSubject) &&
      (filterTopic === 'All' || p.topic === filterTopic)
  );

  // Get available topics based on current subject selection
  const availableTopics = React.useMemo(() => {
    const papers = filterSubject === 'All' ? MOCK_PAPERS : MOCK_PAPERS.filter(p => p.subject === filterSubject);
    const topics = new Set(papers.map(p => p.topic));
    return ['All', ...Array.from(topics)];
  }, [filterSubject]);

  // Reset topic filter when subject changes
  React.useEffect(() => {
    setFilterTopic('All');
  }, [filterSubject]);

  return (
    <div className="flex flex-col md:flex-row h-[80vh] gap-6 animate-fade-in relative">
      
      {/* List Section */}
      <div className={`flex-1 overflow-y-auto ${selectedQuestion ? 'hidden md:block' : 'block'}`}>
        <div className="flex flex-col space-y-4 mb-6">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Past Papers</h2>
           </div>
           
           <div className="flex gap-2">
             <div className="relative flex-1">
                <select 
                    className="w-full bg-secondary border border-gray-700 text-sm rounded-lg pl-3 pr-8 py-2 text-white outline-none focus:border-primary appearance-none"
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                >
                    <option value="All">All Subjects</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                    <Filter size={14} />
                </div>
             </div>
             
             <div className="relative flex-1">
                <select 
                    className="w-full bg-secondary border border-gray-700 text-sm rounded-lg pl-3 pr-8 py-2 text-white outline-none focus:border-primary appearance-none"
                    value={filterTopic}
                    onChange={(e) => setFilterTopic(e.target.value)}
                >
                    {availableTopics.map(t => (
                        <option key={t} value={t}>{t === 'All' ? 'All Topics' : t}</option>
                    ))}
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                    <Filter size={14} />
                </div>
             </div>
           </div>
        </div>

        <div className="space-y-3">
          {filteredPapers.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                  <p>No papers found for this filter.</p>
              </div>
          ) : (
            filteredPapers.map(paper => (
                <div 
                key={paper.id}
                className="bg-secondary border border-gray-700 hover:border-primary/50 p-4 rounded-xl cursor-pointer transition-all group"
                onClick={() => handleGetSolution(paper)}
                >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold px-2 py-1 bg-gray-800 rounded text-gray-300">{paper.year}</span>
                    <div className="flex space-x-2">
                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">{paper.subject}</span>
                        <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded">{paper.topic}</span>
                    </div>
                </div>
                <h3 className="text-white font-medium mb-1 line-clamp-2">{paper.question}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                    <span>{paper.source}</span>
                    <span className="ml-auto text-accent flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        Solve with AI <ChevronRight size={14} />
                    </span>
                </div>
                </div>
            ))
          )}
        </div>
      </div>

      {/* Solution Panel (Sliding on mobile, fixed on desktop) */}
      {(selectedQuestion) && (
        <div className="absolute md:relative inset-0 md:inset-auto z-10 w-full md:w-1/2 bg-gray-900 md:bg-secondary md:border border-gray-700 md:rounded-xl p-6 overflow-y-auto flex flex-col shadow-2xl md:shadow-none">
           <button 
             onClick={() => setSelectedQuestion(null)}
             className="md:hidden absolute top-4 right-4 p-2 bg-gray-800 rounded-full"
           >
             <X size={20} />
           </button>

           <div className="mb-6 border-b border-gray-700 pb-4">
              <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Question</h3>
              <p className="text-white text-lg font-medium">{selectedQuestion.question}</p>
              <div className="mt-2 flex gap-2">
                 <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{selectedQuestion.topic}</span>
                 <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{selectedQuestion.year}</span>
              </div>
           </div>

           <div className="flex-1">
              <h3 className="text-sm text-accent uppercase tracking-wider mb-4 flex items-center">
                 <GraduationCap size={16} className="mr-2" /> AI Solution
              </h3>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                   <Loader2 className="animate-spin text-primary mb-4" size={32} />
                   <p className="text-gray-500">Solving step-by-step...</p>
                </div>
              ) : (
                <div className="prose prose-invert prose-p:text-gray-300">
                   <ReactMarkdown>{solution || ''}</ReactMarkdown>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default PastPapers;
