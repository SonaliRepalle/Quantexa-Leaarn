import React, { useState } from 'react';
import { BoardType, SubscriptionTier, User } from '../types';
import { ArrowRight, BookOpen } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [board, setBoard] = useState<BoardType>(BoardType.CBSE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const mockUser: User = {
      username,
      board,
      subscription: SubscriptionTier.Basic,
      coins: 50,
      studyStreak: 1,
      totalFocusTime: 0,
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-background to-black p-4">
      <div className="w-full max-w-md bg-secondary/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4 text-primary">
            <BookOpen size={32} />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Quantexa Learn
          </h1>
          <p className="text-gray-400 mt-2">Smart Learning Made Simple</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-gray-500"
              placeholder="Enter your username"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Board / Exam</label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value as BoardType)}
                className="w-full px-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white"
              >
                {Object.values(BoardType).map((b) => (
                  <option key={b} value={b} className="bg-gray-800">
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!isLogin && (
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                type="password"
                className="w-full px-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-gray-500"
                placeholder="••••••••"
                />
             </div>
          )}

          {isLogin && (
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                type="password"
                className="w-full px-4 py-3 bg-black/20 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white placeholder-gray-500"
                placeholder="••••••••"
                />
             </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center transition-all transform active:scale-95"
          >
            {isLogin ? 'Login' : 'Get Started'}
            <ArrowRight size={20} className="ml-2" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent hover:text-white font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
