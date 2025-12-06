import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { BoardType, StudyDay } from '../types';
import { Calendar, Clock, Book, Loader2 } from 'lucide-react';

interface StudyPlannerProps {
  board: BoardType;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ board }) => {
  const [subjects, setSubjects] = useState('');
  const [weakTopics, setWeakTopics] = useState('');
  const [hours, setHours] = useState(2);
  const [days, setDays] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<StudyDay[] | null>(null);

  const handleGenerate = async () => {
    if (!subjects) return;
    setIsLoading(true);
    const result = await generateStudyPlan(subjects, weakTopics, hours, days, board);
    setPlan(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-secondary border border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">AI Study Planner</h2>
        <p className="text-gray-400 mb-6">Tell us your goals, and we'll craft the perfect schedule.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subjects (comma separated)</label>
              <input
                type="text"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder="e.g. Physics, Chemistry, Math"
                className="w-full px-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Weak Topics (Optional)</label>
              <textarea
                value={weakTopics}
                onChange={(e) => setWeakTopics(e.target.value)}
                placeholder="e.g. Calculus, Organic Chemistry"
                className="w-full px-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white h-24 resize-none"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Daily Study Hours: {hours}h</label>
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Plan Duration: {days} Days</label>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isLoading || !subjects}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg flex items-center justify-center transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Generating...
                </>
              ) : (
                'Generate My Plan'
              )}
            </button>
          </div>
        </div>
      </div>

      {plan && plan.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Your Plan</h3>
          <div className="grid gap-4">
            {plan.map((day) => (
              <div key={day.day} className="bg-secondary/50 border border-gray-700 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between hover:border-primary/50 transition-colors">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg mr-4">
                    {day.day}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{day.subject}</h4>
                    <p className="text-gray-400 text-sm">Focus: <span className="text-gray-300">{day.focusTopic}</span></p>
                  </div>
                </div>
                
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                    <Book size={14} className="mr-2" />
                    Practice: {day.practiceTime}
                  </div>
                  <div className="flex items-center px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                    <Clock size={14} className="mr-2" />
                    Revision: {day.revisionTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
