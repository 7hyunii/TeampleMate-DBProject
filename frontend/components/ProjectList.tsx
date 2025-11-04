'use client';

import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ProjectCard } from './ProjectCard';
import { useAuth } from './AuthProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface ProjectListProps {
  onViewDetail: (id: string) => void;
  onCreateProject: () => void;
}


import { useEffect } from 'react';

const allSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'Spring Boot', 'MySQL', 'AI/ML', 'React Native', 'Solidity', 'Web3.js'];



export function ProjectList({ onViewDetail, onCreateProject }: ProjectListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('deadline');
  const { isLoggedIn, openAuthModal } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8000/projects?orderBy=${sortBy}`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setProjects(data.projects.map((p: any) => ({
          id: p.project_id,
          title: p.topic,
          description: p.description1,
          fullDescription: p.description2,
          leader: p.leader_name,
          skills: p.skills,
          capacity: p.capacity,
          // currentMembers: 0, // TODO: 실제 인원 구현 시 수정
          deadline: p.deadline,
          status: p.status,
        })));
      })
      .catch(() => setProjects([]));
  }, [sortBy]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesSkills = selectedSkills.length === 0 ||
        selectedSkills.some(skill => project.skills.includes(skill));
      return matchesSearch && matchesStatus && matchesSkills;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

  const handleCreateProject = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    onCreateProject();
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2>프로젝트 탐색</h2>
          <p className="text-gray-600">함께할 팀 프로젝트를 찾아보세요</p>
        </div>
  <Button onClick={handleCreateProject} className="gap-2 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          프로젝트 생성
        </Button>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-gradient-to-br from-white via-white to-indigo-50/30 p-4 md:p-6 rounded-2xl border border-slate-200 shadow-lg space-y-4 md:space-y-5 relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-3xl -z-0" />
        
        <div className="relative z-10">
          {/* Search and Selects */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 md:mb-5">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
              <Input
                placeholder="프로젝트 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-11 bg-white border-slate-200 shadow-sm"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1 sm:w-32 md:w-44 h-11 bg-white border-slate-200 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="Recruiting">모집중</SelectItem>
                  <SelectItem value="In Progress">진행중</SelectItem>
                  <SelectItem value="Completed">완료</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1 sm:w-32 md:w-44 h-11 bg-white border-slate-200 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">마감일순</SelectItem>
                  <SelectItem value="capacity">모집인원순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />

          {/* Skill Filters */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Filter className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm text-slate-900 font-semibold">필요 스킬 필터</span>
              {selectedSkills.length > 0 && (
                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-xs">
                  {selectedSkills.length}개 선택됨
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(skill => (
                <Badge
                  key={skill}
                  variant="outline"
                  className={`cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                    selectedSkills.includes(skill)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-md hover:shadow-lg'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-200 shadow-sm'
                  }`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {selectedSkills.length > 0 && filteredProjects.length > 0 && (
        <div className="flex items-center gap-2 px-2">
          <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />
          <p className="text-sm text-slate-600">
            <span className="font-bold text-indigo-600">{filteredProjects.length}개</span>의 프로젝트를 찾았습니다
          </p>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onViewDetail={onViewDetail}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-4">
            <Search className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-slate-900 mb-2">프로젝트를 찾을 수 없습니다</h3>
          <p className="text-slate-500 text-sm mb-6">검색 조건을 변경하거나 필터를 초기화해보세요</p>
          {(searchTerm || statusFilter !== 'all' || selectedSkills.length > 0) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSelectedSkills([]);
              }}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              필터 초기화
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
