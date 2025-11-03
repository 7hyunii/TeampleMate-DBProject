'use client';

import { useState } from "react";
import { Plus, X, Save, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface ProfileManagementProps {
  currentUser: string;
}

export function ProfileManagement({
  currentUser,
}: ProfileManagementProps) {
  // === 모킹 데이터 시작 ===
  const [name, setName] = useState("김민수");
  const [email, setEmail] = useState("minsu.kim@pusan.ac.kr");
  const [profileText, setProfileText] = useState(
    "컴퓨터공학과 3학년 학생입니다. 웹 개발과 AI에 관심이 많으며, 다양한 프로젝트 경험을 통해 실력을 키우고 있습니다.",
  );
  const [website, setWebsite] = useState(
    "https://github.com/minsukim",
  );
  const [skills, setSkills] = useState([
    "React",
    "TypeScript",
    "Node.js",
    "Python",
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);

  const availableSkills = [
    "JavaScript",
    "Java",
    "C++",
    "Spring Boot",
    "Django",
    "Flask",
    "MySQL",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "Firebase",
    "Git",
    "Figma",
    "UI/UX",
  ];
  // === 모킹 데이터 끝 ===

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = () => {
    // 실제로는 데이터 저장
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2>프로필 관리</h2>
        <p className="text-gray-600">
          다른 사용자에게 보여질 내 정보를 관리하세요
        </p>
      </div>

      <Card className="p-8 shadow-lg bg-gradient-to-br from-white to-slate-50/30">
        <div className="flex items-start gap-6 mb-8 pb-6 border-b border-slate-200">
          <Avatar className="h-24 w-24 ring-4 ring-indigo-100 ring-offset-4">
            <AvatarFallback className="text-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
              {name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="mb-2 text-slate-900">{name}</h3>
            <p className="text-sm text-slate-600 mb-1">
              {email}
            </p>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
              <span className="text-xs font-medium text-indigo-700">
                학생 ID: {currentUser}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="profileText">자기소개</Label>
            <Textarea
              id="profileText"
              placeholder="자신을 소개하고 관심사를 작성해주세요"
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
              rows={4}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              {profileText.length} / 500자
            </p>
          </div>

          <div>
            <Label htmlFor="website">참고 사이트</Label>
            <div className="flex gap-2 mt-2">
              <div className="flex-1 relative">
                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="website"
                  type="url"
                  placeholder="https://github.com/username"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="pl-10"
                />
              </div>
              {website && (
                <Button
                  variant="outline"
                  onClick={() => window.open(website, "_blank")}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  방문
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              GitHub, 포트폴리오 사이트 등을 추가할 수 있습니다
            </p>
          </div>

          <div>
            <Label>보유 스킬 ({skills.length}개)</Label>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
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
                    placeholder="스킬 직접 입력..."
                    value={newSkill}
                    onChange={(e) =>
                      setNewSkill(e.target.value)
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && addSkill(newSkill)
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSkill(newSkill)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    추가
                  </Button>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-slate-600 mb-2 font-medium">
                  추천 스킬
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className={`cursor-pointer transition-all ${
                        skills.includes(skill)
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-indigo-50 hover:border-indigo-200"
                      }`}
                      onClick={() =>
                        !skills.includes(skill) &&
                        addSkill(skill)
                      }
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              {saved ? "저장됨" : "저장하기"}
            </Button>
            {saved && (
              <span className="text-sm text-green-600 flex items-center">
                프로필이 저장되었습니다!
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}