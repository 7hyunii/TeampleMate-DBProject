'use client';
import { useEffect, useState } from "react";
import { Plus, Users, Calendar, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '../auth/AuthProvider';


function MyProjectSkeletonCard() {
  return (
    <Card className="p-6 shadow-lg rounded-xl animate-pulse bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-4 w-2/3 bg-slate-200 rounded mb-3" />
          <div className="h-3 w-1/2 bg-slate-100 rounded" />
        </div>
        <div className="h-8 w-20 bg-slate-200 rounded" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 bg-slate-100 rounded" />
        <div className="h-8 w-24 bg-slate-100 rounded" />
      </div>
    </Card>
  );
}

interface MyProjectsProps {
  onCreateProject: () => void;
  onManageApplicants: (projectId: string) => void;
  onReviewTeam: (projectId: string) => void;
  onViewProject: (projectId: string) => void;
}

type ProjectItem = {
  project_id: number;
  leader_id?: string;
  title: string;
  status: string;
  members_count: number;
  capacity: number;
  deadline: string;
  needsReview?: boolean;
};

export function MyProjects({ onCreateProject, onReviewTeam, onViewProject }: MyProjectsProps) {
  const { userId } = useAuth();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'all'|'recruiting'|'progress'|'completed'>('all');

  useEffect(() => {
    if (!userId) return;
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/projects/me?current_user_id=${encodeURIComponent(userId)}`);
        if (!res.ok) throw new Error(`서버 오류 ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.projects || [];
        const normalized = list.map((p: any) => ({
          ...p,
          deadline: typeof p.deadline === 'string' ? p.deadline : p.deadline ? new Date(p.deadline).toISOString().slice(0,10) : ''
        }));
        setProjects(normalized);
      } catch (e: any) {
        setError(e.message || '데이터를 불러오는 중 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [userId]);

  const byStatus = (s: string) => projects.filter(p => {
    if (s === 'Recruiting') return p.status === 'Recruiting';
    if (s === 'In Progress' || s === 'In_Progress') return p.status === 'In Progress' || p.status === 'In_Progress';
    if (s === 'Completed') return p.status === 'Completed';
    return true;
  });

  const recruitingProjects = byStatus('Recruiting');
  const inProgressProjects = byStatus('In Progress');
  const completedProjects = byStatus('Completed');

  const statusColors: Record<string,string> = {
    'Recruiting': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'In Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'In_Progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Completed': 'bg-slate-50 text-slate-700 border-slate-200'
  };

  const ProjectCard = ({ project }: { project: ProjectItem }) => (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onViewProject(String(project.project_id))}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onViewProject(String(project.project_id));
        }
      }}
      className="p-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-slate-50/30 relative overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl -z-0" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900 leading-tight truncate">{project.title}</h3>
              {project.leader_id && project.leader_id === userId && (
                <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">리더</Badge>
              )}
            </div>
          </div>
          <Badge className={`${statusColors[project.status] || statusColors['In_Progress']} shadow-sm`}>
            {project.status === 'Recruiting' ? '모집중' : project.status === 'Completed' ? '완료' : '진행중'}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm mb-4">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100/70 rounded-lg">
            <Users className="h-4 w-4 text-indigo-600" />
            <span className="text-slate-700 font-medium">{project.members_count}/{project.capacity}명</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100/70 rounded-lg">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span className="text-slate-700 font-medium">{project.deadline}</span>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />

        <div className="flex flex-col sm:flex-row gap-2">
          {project.status === 'Completed' && project.needsReview && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReviewTeam(String(project.project_id));
                  }}
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

      <Tabs defaultValue="all" value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">전체 ({projects.length})</TabsTrigger>
          <TabsTrigger value="recruiting">모집중 ({recruitingProjects.length})</TabsTrigger>
          <TabsTrigger value="progress">진행중 ({inProgressProjects.length})</TabsTrigger>
          <TabsTrigger value="completed">완료 ({completedProjects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <MyProjectSkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            projects.map(project => (
              <ProjectCard key={project.project_id} project={project} />
            ))
          )}
        </TabsContent>

        <TabsContent value="recruiting" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <MyProjectSkeletonCard key={i} />
              ))}
            </div>
          ) : recruitingProjects.length > 0 ? (
            recruitingProjects.map(project => (
              <ProjectCard key={project.project_id} project={project} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>모집 중인 프로젝트가 없습니다.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <MyProjectSkeletonCard key={i} />
              ))}
            </div>
          ) : inProgressProjects.length > 0 ? (
            inProgressProjects.map(project => (
              <ProjectCard key={project.project_id} project={project} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>진행 중인 프로젝트가 없습니다.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <MyProjectSkeletonCard key={i} />
              ))}
            </div>
          ) : completedProjects.length > 0 ? (
            completedProjects.map(project => (
              <ProjectCard key={project.project_id} project={project} />
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
