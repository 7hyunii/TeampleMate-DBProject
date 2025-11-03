'use client';

import { Calendar, Users, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    leader: string;
    skills: string[];
    capacity: number;
    currentMembers: number;
    deadline: string;
    status: "Recruiting" | "In Progress" | "Completed";
  };
  onViewDetail: (id: string) => void;
}

export function ProjectCard({
  project,
  onViewDetail,
}: ProjectCardProps) {
  const statusColors = {
    Recruiting:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    "In Progress":
      "bg-indigo-50 text-indigo-700 border-indigo-200",
    Completed: "bg-slate-50 text-slate-700 border-slate-200",
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(project.deadline).getTime() -
      new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <Card
      className="p-4 md:p-6 hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 cursor-pointer group relative overflow-hidden bg-gradient-to-br from-white to-slate-50/50"
      onClick={() => onViewDetail(project.id)}
    >
      {/* Decorative gradient accent */}
      <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-3xl -z-0 group-hover:scale-150 transition-transform duration-500" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="flex-1 group-hover:text-indigo-600 transition-colors leading-tight pr-3">
            {project.title}
          </h3>
          <Badge
            className={`${statusColors[project.status]} shadow-sm`}
          >
            {project.status === "Recruiting"
              ? "모집중"
              : project.status === "In Progress"
                ? "진행중"
                : "완료"}
          </Badge>
        </div>

        <p className="text-slate-600 mb-5 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.skills.map((skill, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="bg-indigo-50/80 text-indigo-700 border-indigo-200 hover:bg-indigo-100 transition-colors backdrop-blur-sm"
            >
              {skill}
            </Badge>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100/70 rounded-lg">
              <Users className="h-4 w-4 text-indigo-600" />
              <span className="font-medium text-slate-700">
                {project.currentMembers}/{project.capacity}명
              </span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100/70 rounded-lg">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span
                className={`font-medium ${daysUntilDeadline <= 3 ? "text-rose-600" : "text-slate-700"}`}
              >
                {daysUntilDeadline > 0
                  ? `D-${daysUntilDeadline}`
                  : "마감"}
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100/50 px-2 py-1 rounded w-fit">
            리더: {project.leader}
          </span>
        </div>
      </div>
    </Card>
  );
}