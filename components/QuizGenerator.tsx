import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { BoardType, QuizQuestion } from '../types';
import { Loader2, Check, X, RefreshCw, Award, Mic } from 'lucide-react';

interface QuizGeneratorProps {
  board: BoardType;
  onReward: (amount: number) => void;
}

// Extend window for speech recognition
declare global {
    interface Window {
      webkitSpeechRecognition: any;
    }
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ board, onReward }) => {
  const [subject, setSubject] = useState('Physics');
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    setQuestions([]);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    
    const result = await generateQuiz(subject, topic, questionCount, board);
    setQuestions(result);
    setIsLoading(false);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    
    const isCorrect = index === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
        if (score > questions.length / 2) {
            onReward(10);
        }
      }
    }, 1500);
  };

  const reset = () => {
    setQuestions([]);
    setTopic('');
    setShowResults(false);
    setSelectedAnswer(null);
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
        setTopic(transcript);
      };
      
      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
        <Award size={64} className="mx-auto text-yellow-500 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
        <p className="text-xl text-gray-400 mb-8">You scored <span className="text-primary font-bold">{score}</span> out of {questions.length}</p>
        
        {score >= questions.length / 2 && (
             <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg inline-block">
                 <p className="text-yellow-500 font-bold">+10 Coins Earned!</p>
             </div>
        )}

        <button 
          onClick={reset}
          className="px-6 py-3 bg-secondary border border-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center mx-auto"
        >
          <RefreshCw size={20} className="mr-2" /> Try Another
        </button>
      </div>
    );
  }

  if (questions.length > 0) {
    const currentQ = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto py-6 animate-fade-in">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-secondary border border-gray-700 rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border border-gray-600 text-gray-200 transition-all hover:bg-gray-700";
              
              if (selectedAnswer !== null) {
                if (idx === currentQ.correctAnswer) {
                  btnClass = "w-full text-left p-4 rounded-xl border border-green-500 bg-green-500/20 text-white";
                } else if (idx === selectedAnswer) {
                   btnClass = "w-full text-left p-4 rounded-xl border border-red-500 bg-red-500/20 text-white";
                } else {
                   btnClass = "w-full text-left p-4 rounded-xl border border-gray-700 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedAnswer !== null && idx === currentQ.correctAnswer && <Check size={20} className="text-green-500"/>}
                    {selectedAnswer !== null && idx === selectedAnswer && idx !== currentQ.correctAnswer && <X size={20} className="text-red-500"/>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Quiz Generator</h2>
        <p className="text-gray-400">Test your knowledge with AI-crafted questions.</p>
      </div>

      <div className="bg-secondary border border-gray-700 rounded-xl p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
          <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white"
          >
            {['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Economics', 'Business', 'English'].map(s => (
              <option key={s} value={s} className="bg-gray-800">{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Specific Topic</label>
          <div className="relative">
            <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Kinematics, Organic Chemistry"
                className="w-full px-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-white pr-10"
            />
            <button 
                onClick={handleVoiceInput}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-700 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
                title="Use Voice Input"
            >
                <Mic size={18} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Number of Questions: {questionCount}</label>
          <input
            type="range"
            min="3"
            max="15"
            step="1"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic}
          className="w-full py-4 bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg flex items-center justify-center transition-all"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Start Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizGenerator;
