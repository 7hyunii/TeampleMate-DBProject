'use client';

import { ArrowLeft, Calendar, Users, Clock, User, Send } from "lucide-react";
import { SKILL_DISPLAY_MAP } from "../constants/skills";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { useState, useEffect } from "react";

interface Member {
  id: string;
  name: string;
  role: string;
  skills: string[];
}

interface Project {
  project_id: number;
  leader_id: string;
  leader_name: string;
  topic: string;
  description1: string;
  description2: string;
  skills: string[];
  capacity: number;
  deadline: string;
  status: "Recruiting" | "In Progress" | "Completed";
  can_apply: boolean;
  members: Member[];
  current_members: number;
}

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
  currentUserId: string;
  onManageApplicants?: (projectId: string) => void;
}

function SkeletonDetail() {
    return (
      <div className="space-y-4 md:space-y-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-10 w-24 bg-slate-200 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="p-4 md:p-8 bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col gap-4">
              <div className="h-8 w-2/3 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-1/2 bg-slate-100 rounded mb-1" />
              <div className="h-4 w-1/3 bg-slate-100 rounded mb-1" />
              <div className="flex gap-2 mt-2">
                <div className="h-6 w-16 bg-slate-100 rounded" />
                <div className="h-6 w-16 bg-slate-100 rounded" />
              </div>
              <div className="h-8 w-24 bg-slate-200 rounded mt-4" />
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col gap-3">
              <div className="h-6 w-1/2 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-1/3 bg-slate-100 rounded mb-1" />
              <div className="flex gap-2 mt-2">
                <div className="h-6 w-16 bg-slate-100 rounded" />
                <div className="h-6 w-16 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col gap-3">
              <div className="h-6 w-1/2 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-1/3 bg-slate-100 rounded mb-1" />
              <div className="h-8 w-24 bg-slate-200 rounded mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }


export function ProjectDetail({
  projectId,
  onBack,
  currentUserId,
  onManageApplicants,
}: ProjectDetailProps) {
  const [motivation, setMotivation] = useState("");
  const [applied, setApplied] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:8000/projects/${projectId}?applicant_id=${currentUserId}`);
        if (!res.ok) throw new Error("프로젝트 정보를 불러올 수 없습니다.");
        const data = await res.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [projectId, currentUserId]);

  if (loading || !project) {
    return <SkeletonDetail />;
  }

  // if (error) {
  
  // }

  const ProjectDetails = {
    id: project.project_id,
    leaderId: project.leader_id,
    leader: project.leader_name,
    title: project.topic,
    description: project.description1,
    fullDescription: project.description2,
    skills: project.skills,
    capacity: project.capacity,
    currentMembers: 0,  // 현재 팀원 수 (추후 API에서 받아올 예정)
    deadline: project.deadline,
    status: project.status,
    can_apply: project.can_apply,
    members: [  // 팀원 정보
      // 예시 mock
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
  };

  const isLeader = ProjectDetails.leaderId === currentUserId;
  const daysUntilDeadline = Math.ceil(
    (new Date(ProjectDetails.deadline).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const handleApply = async () => {
    if (!motivation.trim()) return;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    try {
      const res = await fetch(`http://localhost:8000/projects/${projectId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: project?.project_id,
          applicant_id: currentUserId,
          applicant_date: today,
          motivation,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.detail || "지원에 실패했습니다.");
        return;
      }
      setApplied(true);
      setMotivation("");
    } catch (err) {
      alert("서버 오류로 지원에 실패했습니다.");
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
                <h2 className="font-semibold mb-2 md:mb-3 text-slate-900 text-xl md:text-2xl">
                  {ProjectDetails.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100/70 px-3 py-1.5 rounded-lg w-fit">
                  <User className="h-4 w-4 text-indigo-600" />
                  <span>
                    리더:{" "}
                    <span className="font-medium text-slate-700">
                      {ProjectDetails.leader}
                    </span>
                  </span>
                </div>
              </div>
              <Badge
                className={`${statusColors[ProjectDetails.status]} shadow-sm px-4 py-1.5 w-fit`}
              >
                {ProjectDetails.status === "Recruiting"
                  ? "모집중"
                  : ProjectDetails.status === "In Progress"
                    ? "진행중"
                    : "완료"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-1">
              {ProjectDetails.skills.map((skill: string, idx: number) => {
                const display = SKILL_DISPLAY_MAP[skill.toLowerCase()] || (skill.charAt(0).toUpperCase() + skill.slice(1));
                return (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-indigo-50/80 text-indigo-700 border-indigo-200 px-3 py-1"
                  >
                    {display}
                  </Badge>
                );
              })}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-1" />

            <div className="prose max-w-none">
              <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                {ProjectDetails.fullDescription}
              </p>
            </div>
          </Card>

          <Card className="p-6 shadow-lg bg-gradient-to-br from-white to-indigo-50/20">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900">
                팀원 ({ProjectDetails.currentMembers}/
                {ProjectDetails.capacity})
              </h3>
            </div>
            <div className="space-y-3">
              {ProjectDetails.members.map((member) => (
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
            <h3 className="font-semibold mb-2 text-slate-900">
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
                    {ProjectDetails.currentMembers}/{ProjectDetails.capacity}
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
                    {ProjectDetails.deadline}
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

          {!isLeader && ProjectDetails.status === "Recruiting" && (
            <Card className="p-6 shadow-lg bg-gradient-to-br from-white to-indigo-50/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Send className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900">
                  프로젝트 지원
                </h3>
              </div>
              {project && ProjectDetails.can_apply ? (
                !applied ? (
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
                )
              ) : (
                <div className="text-center py-8 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border border-slate-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full mb-4 shadow-lg">
                    <Send className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-slate-700 font-semibold text-lg mb-1">
                    이미 지원한 프로젝트입니다.
                  </p>
                </div>
              )}
            </Card>
          )}

          {isLeader && (
            <Button
              onClick={() => onManageApplicants && onManageApplicants(projectId)}
              className="w-full"
            >
              지원자 관리
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}