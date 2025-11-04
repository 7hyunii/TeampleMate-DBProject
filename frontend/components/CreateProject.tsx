'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';

interface CreateProjectProps {
  onBack: () => void;
  onSubmit: () => void;
}

// === 모킹 데이터 시작 ===
const availableSkills = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'Spring Boot',
  'MySQL', 'MongoDB', 'AI/ML', 'React Native', 'Vue.js', 'Angular',
  'Docker', 'Kubernetes', 'AWS', 'Firebase', 'GraphQL', 'Redis'
];
// === 모킹 데이터 끝 ===

export function CreateProject({ onBack, onSubmit }: CreateProjectProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [capacity, setCapacity] = useState('5');
  const [deadline, setDeadline] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');


  // AuthProvider에서 userId 가져오기 (-> leader_id)
  const { userId } = require("./AuthProvider").useAuth();

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8000/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leader_id: userId,
          topic: title,
          description1: description,
          description2: fullDescription,
          capacity: parseInt(capacity),
          deadline,
          skills: selectedSkills,
        }),
      });
      if (res.ok) {
        onSubmit();
      } else {
        const data = await res.json();
        alert(data.detail || "프로젝트 생성 실패");
      }
    } catch (e) {
      alert("서버 오류로 프로젝트 생성에 실패했습니다.");
    }
  };

  const isValid = title && description && fullDescription && capacity && deadline && selectedSkills.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </Button>
      </div>

      <div>
        <h2>새 프로젝트 생성</h2>
        <p className="text-gray-600">팀원을 모집할 프로젝트를 등록하세요</p>
      </div>

      <Card className="p-8 shadow-lg bg-gradient-to-br from-white to-slate-50/30">
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">프로젝트 제목 *</Label>
            <Input
              id="title"
              placeholder="예: AI 기반 학습 도우미 앱 개발"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">간단한 설명 *</Label>
            <Textarea
              id="description"
              placeholder="프로젝트를 한 줄로 소개해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="fullDescription">상세 설명 *</Label>
            <Textarea
              id="fullDescription"
              placeholder="프로젝트의 목표, 주요 기능, 기술 스택, 예상 일정 등을 자세히 작성해주세요"
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              rows={10}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">모집 인원 *</Label>
              <Input
                id="capacity"
                type="number"
                min="2"
                max="10"
                placeholder="5"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">리더 포함 총 인원</p>
            </div>

            <div>
              <Label htmlFor="deadline">모집 마감일 *</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-2"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <Label>필요한 스킬 * ({selectedSkills.length}개 선택)</Label>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSkills.map(skill => (
                  <Badge
                    key={skill}
                    className="bg-primary text-primary-foreground gap-1 pr-1"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="mb-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="직접 입력..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCustomSkill}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    추가
                  </Button>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-slate-600 mb-2 font-medium">추천 스킬</p>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map(skill => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className={`cursor-pointer transition-all ${
                        selectedSkills.includes(skill)
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-indigo-50 hover:border-indigo-200'
                      }`}
                      onClick={() => !selectedSkills.includes(skill) && toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex-1"
            >
              프로젝트 생성
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
