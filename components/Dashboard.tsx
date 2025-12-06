import React from 'react';
import { User } from '../types';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Clock, 
  CheckCircle, 
  HelpCircle, 
  Coins, 
  ArrowRight,
  Play,
  FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const data = [
    { name: 'Mon', hours: 2 },
    { name: 'Tue', hours: 3 },
    { name: 'Wed', hours: 1.5 },
    { name: 'Thu', hours: 4 },
    { name: 'Fri', hours: 2.5 },
    { name: 'Sat', hours: 5 },
    { name: 'Sun', hours: 3 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Hello, {user.username}! 👋</h1>
          <p className="text-gray-400">Ready to crush your {user.board} prep today?</p>
        </div>
        <div className="hidden md:flex items-center bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full text-yellow-500">
          <Coins size={20} className="mr-2" />
          <span className="font-bold">{user.coins} Coins</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center text-center">
          <Flame className="text-orange-500 mb-2" size={28} />
          <span className="text-2xl font-bold text-white">{user.studyStreak}</span>
          <span className="text-xs text-gray-400">Day Streak</span>
        </div>
        <div className="bg-secondary p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center text-center">
          <Clock className="text-blue-500 mb-2" size={28} />
          <span className="text-2xl font-bold text-white">{Math.round(user.totalFocusTime / 60)}h</span>
          <span className="text-xs text-gray-400">Focus Time</span>
        </div>
        <div className="bg-secondary p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center text-center">
          <CheckCircle className="text-green-500 mb-2" size={28} />
          <span className="text-2xl font-bold text-white">12</span>
          <span className="text-xs text-gray-400">Tests Done</span>
        </div>
        <div className="bg-secondary p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center text-center">
          <HelpCircle className="text-purple-500 mb-2" size={28} />
          <span className="text-2xl font-bold text-white">85</span>
          <span className="text-xs text-gray-400">Questions Gen</span>
        </div>
      </div>

      {/* Main Action & Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Focus */}
        <div className="md:col-span-2 bg-secondary rounded-xl border border-gray-700 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <h2 className="text-xl font-bold text-white mb-4">Today's Focus</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-gray-700/50">
              <div className="flex items-center">
                <div className="w-2 h-12 bg-accent rounded-full mr-3"></div>
                <div>
                  <h3 className="font-semibold text-white">Physics - Thermodynamics</h3>
                  <p className="text-sm text-gray-400">Practice: 45m • Revision: 15m</p>
                </div>
              </div>
              <Link to="/study-planner" className="p-2 bg-accent/10 text-accent rounded-full hover:bg-accent/20">
                <Play size={20} />
              </Link>
            </div>
            
            <div className="h-48 mt-4 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}>
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                      itemStyle={{ color: '#F9FAFB' }}
                      cursor={{fill: 'transparent'}}
                    />
                    <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 5 ? '#3B82F6' : '#6B46C1'} />
                      ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-secondary rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/study-planner" className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-primary/50 transition-all group">
               <div className="flex items-center">
                  <div className="p-2 rounded bg-purple-500/10 text-purple-400 mr-3">
                     <FileText size={18} />
                  </div>
                  <span className="font-medium">Plan Study</span>
               </div>
               <ArrowRight size={16} className="text-gray-500 group-hover:text-white" />
            </Link>
            <Link to="/quiz-generator" className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-primary/50 transition-all group">
               <div className="flex items-center">
                  <div className="p-2 rounded bg-green-500/10 text-green-400 mr-3">
                     <CheckCircle size={18} />
                  </div>
                  <span className="font-medium">Take Quiz</span>
               </div>
               <ArrowRight size={16} className="text-gray-500 group-hover:text-white" />
            </Link>
            <Link to="/focus-timer" className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-primary/50 transition-all group">
               <div className="flex items-center">
                  <div className="p-2 rounded bg-blue-500/10 text-blue-400 mr-3">
                     <Clock size={18} />
                  </div>
                  <span className="font-medium">Focus Timer</span>
               </div>
               <ArrowRight size={16} className="text-gray-500 group-hover:text-white" />
            </Link>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/10">
            <h3 className="text-sm font-semibold text-yellow-500 mb-1">Weekly Challenge</h3>
            <p className="text-xs text-gray-400 mb-2">Complete 3 quizzes to earn 50 coins.</p>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
               <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '66%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
