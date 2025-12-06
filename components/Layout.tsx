import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  BrainCircuit, 
  Clock, 
  User, 
  LogOut, 
  Menu, 
  X,
  FileText,
  Youtube,
  GraduationCap,
  Layers
} from 'lucide-react';
import { BoardType, User as UserType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserType | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on route change
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  if (!user) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Study Planner', path: '/study-planner', icon: BookOpen },
    { name: 'AI Explanations', path: '/ai-explanations', icon: BrainCircuit },
    { name: 'Quiz Generator', path: '/quiz-generator', icon: GraduationCap },
    { name: 'Past Papers', path: '/past-papers', icon: FileText },
    { name: 'Flashcards & Maps', path: '/flashcards-mindmaps', icon: Layers },
    { name: 'Focus Timer', path: '/focus-timer', icon: Clock },
    { name: 'YT Summaries', path: '/youtube-summaries', icon: Youtube },
    { name: 'Subscriptions', path: '/subscriptions', icon: User },
    { name: 'About & Team', path: '/about-team', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background text-text flex relative overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 w-full z-20 bg-secondary/90 backdrop-blur border-b border-gray-700 px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-lg text-primary">Quantexa Learn</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-secondary border-r border-gray-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-700 hidden md:block">
             <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
               Quantexa Learn
             </h1>
             <p className="text-xs text-gray-400 mt-1">Smart Learning Made Simple</p>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary/20 text-accent border-l-4 border-accent' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} className="mr-3" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700">
             <div className="flex items-center mb-4 px-2">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold mr-3">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.username}</p>
                  <p className="text-xs text-gray-400">{user.board}</p>
                </div>
             </div>
             <button 
               onClick={onLogout}
               className="w-full flex items-center justify-center px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
             >
               <LogOut size={18} className="mr-2" />
               Logout
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen pt-16 md:pt-0 p-4 md:p-8">
        <div className="max-w-5xl mx-auto pb-20 md:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-secondary border-t border-gray-700 flex justify-around py-3 px-2 z-20">
        <NavLink to="/dashboard" className={({isActive}) => `flex flex-col items-center p-1 ${isActive ? 'text-accent' : 'text-gray-500'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[10px] mt-1">Home</span>
        </NavLink>
        <NavLink to="/study-planner" className={({isActive}) => `flex flex-col items-center p-1 ${isActive ? 'text-accent' : 'text-gray-500'}`}>
          <BookOpen size={20} />
          <span className="text-[10px] mt-1">Plan</span>
        </NavLink>
        <NavLink to="/quiz-generator" className={({isActive}) => `flex flex-col items-center p-1 ${isActive ? 'text-accent' : 'text-gray-500'}`}>
          <GraduationCap size={20} />
          <span className="text-[10px] mt-1">Quiz</span>
        </NavLink>
        <NavLink to="/focus-timer" className={({isActive}) => `flex flex-col items-center p-1 ${isActive ? 'text-accent' : 'text-gray-500'}`}>
          <Clock size={20} />
          <span className="text-[10px] mt-1">Timer</span>
        </NavLink>
        <NavLink to="/subscriptions" className={({isActive}) => `flex flex-col items-center p-1 ${isActive ? 'text-accent' : 'text-gray-500'}`}>
          <User size={20} />
          <span className="text-[10px] mt-1">Profile</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Layout;
