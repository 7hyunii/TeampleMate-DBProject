'use client';

import { Search, Plus, User, Home, FileText, Star } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from './AuthProvider';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { isLoggedIn, openAuthModal, userName } = useAuth();

  const handleViewChange = (view: string) => {
    if (!isLoggedIn && (view === 'my-projects' || view === 'applications' || view === 'profile')) {
      openAuthModal();
      return;
    }
    onViewChange(view);
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Teample Mate
              </h1>
            </div>
            <nav className="hidden md:flex gap-1">
              <Button
                variant={currentView === 'projects' ? 'default' : 'ghost'}
                onClick={() => handleViewChange('projects')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                프로젝트 탐색
              </Button>
              <Button
                variant={currentView === 'my-projects' ? 'default' : 'ghost'}
                onClick={() => handleViewChange('my-projects')}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                내 프로젝트
              </Button>
              <Button
                variant={currentView === 'applications' ? 'default' : 'ghost'}
                onClick={() => handleViewChange('applications')}
                className="gap-2"
              >
                <Star className="h-4 w-4" />
                내 지원현황
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleViewChange('profile')}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{userName}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-white">
        <nav className="flex items-center justify-around px-2 py-2">
          <Button
            variant={currentView === 'projects' ? 'default' : 'ghost'}
            onClick={() => handleViewChange('projects')}
            className="flex-1 gap-1 h-12 flex-col"
            size="sm"
          >
            <Home className="h-4 w-4" />
            <span className="text-xs">탐색</span>
          </Button>
          <Button
            variant={currentView === 'my-projects' ? 'default' : 'ghost'}
            onClick={() => handleViewChange('my-projects')}
            className="flex-1 gap-1 h-12 flex-col"
            size="sm"
          >
            <FileText className="h-4 w-4" />
            <span className="text-xs">내 프로젝트</span>
          </Button>
          <Button
            variant={currentView === 'applications' ? 'default' : 'ghost'}
            onClick={() => handleViewChange('applications')}
            className="flex-1 gap-1 h-12 flex-col"
            size="sm"
          >
            <Star className="h-4 w-4" />
            <span className="text-xs">지원현황</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
