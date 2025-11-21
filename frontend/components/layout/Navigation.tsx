'use client';
import { User, Home, FileText, Star } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useAuth } from '../auth/AuthProvider';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, openAuthModal, userName } = useAuth();

  const currentView = (() => {
    if (pathname?.startsWith('/myprojects')) return 'myprojects';
    if (pathname?.startsWith('/myapplications')) return 'myapplications';
    if (pathname?.startsWith('/profile')) return 'profile';
    return 'projects';
  })();

  const handleNavigate = (view: string) => {
    if (!isLoggedIn && (view === 'myprojects' || view === 'myapplications' || view === 'profile')) {
      openAuthModal();
      return;
    }

    const routes: Record<string, string> = {
      projects: '/projects',
      myprojects: '/myprojects',
      myapplications: '/myapplications',
      profile: '/profile',
    };

    router.push(routes[view] ?? '/projects');
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
                onClick={() => handleNavigate('projects')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                프로젝트 검색
              </Button>
              <Button
                variant={currentView === 'myprojects' ? 'default' : 'ghost'}
                onClick={() => handleNavigate('myprojects')}
                className="gap-2"
              >
                내 프로젝트
              </Button>
              <Button
                variant={currentView === 'myapplications' ? 'default' : 'ghost'}
                onClick={() => handleNavigate('myapplications')}
                className="gap-2"
              >
                지원 현황
              </Button>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleNavigate('profile')}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              <span className="font-semibold hidden sm:inline">{userName}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t bg-white">
        <nav className="flex items-center justify-around px-2 py-2">
          <Button
            variant={currentView === 'projects' ? 'default' : 'ghost'}
            onClick={() => handleNavigate('projects')}
            className="flex-1 gap-1 h-12 flex-col"
            size="sm"
          >
            <Home className="h-4 w-4" />
            <span className="text-xs">검색</span>
          </Button>
          <Button
            variant={currentView === 'myprojects' ? 'default' : 'ghost'}
            onClick={() => handleNavigate('myprojects')}
            className="flex-1 gap-1 h-12 flex-col"
            size="sm"
          >
            <FileText className="h-4 w-4" />
            <span className="text-xs">내 프로젝트</span>
          </Button>
          <Button
            variant={currentView === 'myapplications' ? 'default' : 'ghost'}
            onClick={() => handleNavigate('myapplications')}
            className="flex-1 gap-1 h-12 flex-col"
            size="sm"
          >
            <Star className="h-4 w-4" />
            <span className="text-xs">지원 현황</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
