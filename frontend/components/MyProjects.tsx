'use client';

import { Plus, Users, Calendar, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface MyProjectsProps {
  onCreateProject: () => void;
  onManageApplicants: (projectId: string) => void;
  onReviewTeam: (projectId: string) => void;
}

export function MyProjects({ onCreateProject, onManageApplicants, onReviewTeam }: MyProjectsProps) {
  // === 모킹 데이터 시작 ===
  const myProjects = [
    {
      id: '1',
      title: 'AI 기반 학습 도우미 앱 개발',
      status: 'Recruiting' as const,
      role: 'leader' as const,
      members: 2,
      capacity: 5,
      applicants: 3,
      deadline: '2025-11-15'
    },
    {
      id: '4',
      title: 'IoT 스마트 캠퍼스 프로젝트',
      status: 'In Progress' as const,
      role: 'member' as const,
      members: 4,
      capacity: 4,
      applicants: 0,
      deadline: '2025-11-08'
    },
    {
      id: '5',
      title: '데이터 시각화 대시보드',
      status: 'Completed' as const,
      role: 'member' as const,
      members: 3,
      capacity: 3,
      applicants: 0,
      deadline: '2025-10-30',
      needsReview: true
    }
  ];
  // === 모킹 데이터 끝 ===

  const recruitingProjects = myProjects.filter(p => p.status === 'Recruiting');
  const inProgressProjects = myProjects.filter(p => p.status === 'In Progress');
  const completedProjects = myProjects.filter(p => p.status === 'Completed');

  const statusColors = {
    'Recruiting': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Completed': 'bg-slate-50 text-slate-700 border-slate-200'
  };

  const ProjectCard = ({ project }: { project: typeof myProjects[0] }) => (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-slate-50/30 relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl -z-0" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-slate-900 leading-tight">{project.title}</h3>
              {project.role === 'leader' && (
                <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">리더</Badge>
              )}
            </div>
          </div>
          <Badge className={`${statusColors[project.status]} shadow-sm`}>
            {project.status === 'Recruiting' ? '모집중' : 
             project.status === 'In Progress' ? '진행중' : '완료'}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm mb-4">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100/70 rounded-lg">
            <Users className="h-4 w-4 text-indigo-600" />
            <span className="text-slate-700 font-medium">{project.members}/{project.capacity}명</span>
          </div>
          {project.applicants > 0 && (
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md">
              🔔 새 지원자 {project.applicants}명
            </Badge>
          )}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100/70 rounded-lg">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span className="text-slate-700 font-medium">{project.deadline}</span>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />

        <div className="flex flex-col sm:flex-row gap-2">
          {project.role === 'leader' && project.status === 'Recruiting' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onManageApplicants(project.id)}
              className="gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-colors w-full sm:w-auto"
            >
              <Users className="h-4 w-4" />
              지원자 관리
            </Button>
          )}
          {project.status === 'Completed' && project.needsReview && (
            <Button
              size="sm"
              onClick={() => onReviewTeam(project.id)}
              className="gap-2 shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto"
            >
              <Star className="h-4 w-4" />
              팀원 평가하기
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2>내 프로젝트</h2>
          <p className="text-gray-600">진행 중이거나 참여한 프로젝트를 관리하세요</p>
        </div>
        <Button onClick={onCreateProject} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          프로젝트 생성
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            전체 ({myProjects.length})
          </TabsTrigger>
          <TabsTrigger value="recruiting">
            모집중 ({recruitingProjects.length})
          </TabsTrigger>
          <TabsTrigger value="progress">
            진행중 ({inProgressProjects.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            완료 ({completedProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {myProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </TabsContent>

        <TabsContent value="recruiting" className="space-y-4">
          {recruitingProjects.length > 0 ? (
            recruitingProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>모집 중인 프로젝트가 없습니다.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {inProgressProjects.length > 0 ? (
            inProgressProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>진행 중인 프로젝트가 없습니다.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedProjects.length > 0 ? (
            completedProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>완료된 프로젝트가 없습니다.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
