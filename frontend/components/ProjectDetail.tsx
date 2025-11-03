'use client';

import {
  ArrowLeft,
  Calendar,
  Users,
  Clock,
  User,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
  currentUserId: string;
}

// === 모킹 데이터 시작 ===
const mockProjectDetails = {
  "1": {
    id: "1",
    title: "AI 기반 학습 도우미 앱 개발",
    description:
      "ChatGPT API를 활용한 학생들을 위한 학습 도우미 애플리케이션을 개발합니다. React Native로 크로스 플랫폼 앱을 만들 예정입니다.",
    fullDescription: `이 프로젝트는 AI 기술을 활용하여 학생들의 학습을 도와주는 모바일 애플리케이션을 개발하는 것을 목표로 합니다.

주요 기능:
- ChatGPT API를 활용한 질문-답변 시스템
- 학습 진도 추적 및 분석
- 개인화된 학습 추천
- 플래시카드 자동 생성
- 학습 통계 대시보드

기술 스택:
- Frontend: React Native, TypeScript
- Backend: Node.js, Express
- Database: MongoDB
- AI: OpenAI API

예상 일정:
- 1-2주차: 기획 및 설계
- 3-6주차: 개발
- 7-8주차: 테스트 및 배포`,
    leader: "김민수",
    leaderId: "user1",
    skills: ["React Native", "TypeScript", "Node.js", "AI/ML"],
    capacity: 5,
    currentMembers: 2,
    deadline: "2025-11-15",
    status: "Recruiting" as const,
    members: [
      {
        id: "user1",
        name: "김민수",
        role: "리더",
        skills: ["React Native", "TypeScript"],
      },
      {
        id: "user2",
        name: "이지은",
        role: "팀원",
        skills: ["Node.js", "MongoDB"],
      },
    ],
  },
};
// === 모킹 데이터 끝 ===

export function ProjectDetail({
  projectId,
  onBack,
  currentUserId,
}: ProjectDetailProps) {
  const [motivation, setMotivation] = useState("");
  const [applied, setApplied] = useState(false);

  const project =
    mockProjectDetails[
      projectId as keyof typeof mockProjectDetails
    ];

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          프로젝트를 찾을 수 없습니다.
        </p>
        <Button onClick={onBack} className="mt-4">
          돌아가기
        </Button>
      </div>
    );
  }

  const isLeader = project.leaderId === currentUserId;
  const daysUntilDeadline = Math.ceil(
    (new Date(project.deadline).getTime() -
      new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const handleApply = () => {
    if (motivation.trim()) {
      setApplied(true);
      setMotivation("");
    }
  };

  const statusColors = {
    Recruiting:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    "In Progress":
      "bg-indigo-50 text-indigo-700 border-indigo-200",
    Completed: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">뒤로가기</span>
          <span className="sm:hidden">뒤로</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card className="p-4 md:p-8 shadow-lg bg-gradient-to-br from-white to-slate-50/30">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
              <div className="flex-1">
                <h2 className="mb-2 md:mb-3 text-slate-900 text-xl md:text-2xl">
                  {project.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100/70 px-3 py-1.5 rounded-lg w-fit">
                  <User className="h-4 w-4 text-indigo-600" />
                  <span>
                    리더:{" "}
                    <span className="font-medium text-slate-700">
                      {project.leader}
                    </span>
                  </span>
                </div>
              </div>
              <Badge
                className={`${statusColors[project.status]} shadow-sm px-4 py-1.5 w-fit`}
              >
                {project.status === "Recruiting"
                  ? "모집중"
                  : project.status === "In Progress"
                    ? "진행중"
                    : "완료"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.skills.map((skill, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-indigo-50/80 text-indigo-700 border-indigo-200 px-3 py-1"
                >
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />

            <div className="prose max-w-none">
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                {project.fullDescription}
              </p>
            </div>
          </Card>

          <Card className="p-6 shadow-lg bg-gradient-to-br from-white to-indigo-50/20">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-slate-900">
                팀원 ({project.members.length}/
                {project.capacity})
              </h3>
            </div>
            <div className="space-y-3">
              {project.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-slate-900">
                        {member.name}
                      </span>
                      {member.role === "리더" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                          리더
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      {member.skills.map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs bg-slate-50"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 shadow-lg bg-gradient-to-br from-white via-white to-indigo-50/30">
            <h3 className="mb-5 text-slate-900">
              프로젝트 정보
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-600 mb-1">
                    모집 인원
                  </div>
                  <div className="font-semibold text-slate-900">
                    {project.currentMembers}/{project.capacity}
                    명
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-600 mb-1">
                    모집 마감
                  </div>
                  <div className="font-semibold text-slate-900">
                    {project.deadline}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    daysUntilDeadline <= 3
                      ? "bg-gradient-to-br from-rose-500 to-rose-600"
                      : "bg-gradient-to-br from-emerald-500 to-emerald-600"
                  }`}
                >
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-600 mb-1">
                    남은 기간
                  </div>
                  <div
                    className={`font-semibold ${daysUntilDeadline <= 3 ? "text-rose-600" : "text-slate-900"}`}
                  >
                    {daysUntilDeadline > 0
                      ? `D-${daysUntilDeadline}`
                      : "마감"}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {!isLeader && project.status === "Recruiting" && (
            <Card className="p-6 shadow-lg bg-gradient-to-br from-white to-indigo-50/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Send className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-slate-900">
                  프로젝트 지원
                </h3>
              </div>
              {!applied ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-700 mb-2 block font-medium">
                      지원 동기
                    </label>
                    <Textarea
                      placeholder="이 프로젝트에 지원하는 이유와 기여할 수 있는 부분을 작성해주세요..."
                      value={motivation}
                      onChange={(e) =>
                        setMotivation(e.target.value)
                      }
                      rows={6}
                      className="bg-white border-slate-200"
                    />
                  </div>
                  <Button
                    onClick={handleApply}
                    className="w-full gap-2 shadow-md hover:shadow-lg transition-shadow"
                    disabled={!motivation.trim()}
                  >
                    <Send className="h-4 w-4" />
                    지원하기
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-4 shadow-lg">
                    <Send className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-emerald-700 font-semibold text-lg mb-1">
                    지원이 완료되었습니다!
                  </p>
                  <p className="text-sm text-slate-600">
                    리더의 승인을 기다려주세요.
                  </p>
                </div>
              )}
            </Card>
          )}

          {isLeader && (
            <Button onClick={() => {}} className="w-full">
              지원자 관리
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}