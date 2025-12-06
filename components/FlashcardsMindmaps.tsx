import React, { useState } from 'react';
import { generateFlashcards, generateMindMap } from '../services/geminiService';
import { Flashcard, MindMapNode } from '../types';
import { Layers, Zap, Loader2, RotateCw } from 'lucide-react';
import * as d3 from 'd3';

const MindMapTree: React.FC<{ data: MindMapNode }> = ({ data }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current || !data) return;

    // Clear previous SVG
    d3.select(containerRef.current).selectAll("*").remove();

    const width = containerRef.current.clientWidth;
    const height = 400;
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree<MindMapNode>().size([width - 100, height - 100]);
    treeLayout(root);

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(50, 50)");

    // Links
    svg.selectAll('line')
      .data(root.links())
      .enter()
      .append('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', '#4B5563')
      .attr('stroke-width', 2);

    // Nodes
    const nodes = svg.selectAll('g.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    nodes.append('circle')
      .attr('r', 6)
      .attr('fill', '#3B82F6');

    nodes.append('text')
      .attr('dy', -10)
      .attr('text-anchor', 'middle')
      .text(d => d.data.name)
      .attr('fill', '#F9FAFB')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .call(wrap, 100); 

      function wrap(text: any, width: number) {
        text.each(function(this: any) {
            // Basic text wrapping simplified for D3
            // In a real app, use a more robust logic
        });
      }

  }, [data]);

  return <div ref={containerRef} className="w-full h-[400px] border border-gray-700 rounded-lg bg-black/20 overflow-hidden" />;
};

const FlashcardsMindmaps: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'flashcards' | 'mindmap'>('flashcards');
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [mindmapData, setMindmapData] = useState<MindMapNode | null>(null);

  const handleGenerate = async () => {
    if (!notes) return;
    setIsLoading(true);
    
    if (activeTab === 'flashcards') {
        const result = await generateFlashcards(notes);
        setCards(result);
    } else {
        const result = await generateMindMap(notes.slice(0, 100)); // Use title/short text for root
        setMindmapData(result);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 space-y-4">
           <h2 className="text-2xl font-bold text-white">Study Aids</h2>
           <p className="text-gray-400 text-sm">Paste your notes or a topic to generate study materials.</p>
           
           <textarea
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             className="w-full h-48 bg-secondary border border-gray-700 rounded-xl p-4 text-white focus:border-primary outline-none resize-none"
             placeholder="Enter text here..."
           />
           
           <div className="flex gap-2">
             <button
               onClick={() => setActiveTab('flashcards')}
               className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'flashcards' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'}`}
             >
               Flashcards
             </button>
             <button
               onClick={() => setActiveTab('mindmap')}
               className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'mindmap' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'}`}
             >
               Mindmap
             </button>
           </div>

           <button
             onClick={handleGenerate}
             disabled={isLoading || !notes}
             className="w-full py-3 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white rounded-lg font-bold"
           >
             {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Generate'}
           </button>
        </div>

        <div className="md:w-2/3 bg-secondary rounded-xl border border-gray-700 p-6 min-h-[400px] flex flex-col items-center justify-center">
            {isLoading ? (
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary mb-2 mx-auto" size={32} />
                    <p className="text-gray-400">AI is working its magic...</p>
                </div>
            ) : activeTab === 'flashcards' ? (
                cards.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        {cards.map((card, idx) => (
                            <div key={idx} className="group perspective h-48 w-full cursor-pointer">
                                <div className="relative preserve-3d group-hover:my-rotate-y-180 w-full h-full duration-500">
                                    <div className="absolute backface-hidden border border-gray-600 bg-gray-800 rounded-xl p-6 flex items-center justify-center text-center shadow-lg w-full h-full">
                                        <p className="font-medium text-white">{card.front}</p>
                                    </div>
                                    <div className="absolute my-rotate-y-180 backface-hidden w-full h-full bg-primary/20 border border-primary rounded-xl p-6 flex items-center justify-center text-center overflow-auto">
                                        <p className="text-sm text-gray-200">{card.back}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <Layers size={48} className="mx-auto mb-3 opacity-50" />
                        <p>Generate flashcards to see them here.</p>
                    </div>
                )
            ) : (
                mindmapData ? (
                    <MindMapTree data={mindmapData} />
                ) : (
                    <div className="text-center text-gray-500">
                        <Zap size={48} className="mx-auto mb-3 opacity-50" />
                        <p>Generate a mindmap to visualize concepts.</p>
                    </div>
                )
            )}
        </div>
      </div>
      <style>{`
        .perspective { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .my-rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default FlashcardsMindmaps;
