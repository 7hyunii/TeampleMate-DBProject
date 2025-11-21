'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useAuth } from '../auth/AuthProvider';
import { SKILL_DISPLAY_MAP } from '../../constants/skills';

interface PeerReviewProps {
  projectId: string;
  onBack: () => void;
}

type ProjectMember = {
  id: string;
  name: string;
  skills: string[];
  isLeader?: boolean;
};

type ProjectInfo = {
  id: string;
  title: string;
  leaderId: string;
  members: ProjectMember[];
};

export function PeerReview({ projectId, onBack }: PeerReviewProps) {
  const { userId } = useAuth();
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [reviews, setReviews] = useState<Record<string, { score: number; comment: string }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingMap, setSubmittingMap] = useState<Record<string, boolean>>({});
  const [submittedMap, setSubmittedMap] = useState<Record<string, boolean>>({});

  function displaySkill(skill: string): string {
    const key = (skill || '').trim().toLowerCase();
    return SKILL_DISPLAY_MAP[key] || (skill ? skill.charAt(0).toUpperCase() + skill.slice(1) : '');
  }

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      setReviews({});
      try {
        const res = await fetch(`http://localhost:8000/projects/${projectId}`);
        if (!res.ok) throw new Error('프로젝트 정보를 불러오지 못했습니다.');
        const data = await res.json();

        const members: ProjectMember[] = Array.isArray(data.members)
          ? data.members.map((m: any) => ({
              id: m.uid || m.id,
              name: m.name,
              skills: m.skills || [],
              isLeader: (m.uid || m.id) === data.leader_id,
            }))
          : [];

        setProject({
          id: String(data.project_id),
          title: data.topic || '',
          leaderId: data.leader_id,
          members,
        });
        try {
          if (userId) {
            const statusRes = await fetch(
              `http://localhost:8000/projects/${projectId}/reviews/status?reviewer_id=${encodeURIComponent(
                userId
              )}`
            );
            if (statusRes.ok) {
              const statusJson = await statusRes.json();
              const done: Record<string, boolean> = {};
              if (Array.isArray(statusJson.completed)) {
                statusJson.completed.forEach((uid: string) => (done[uid] = true));
              } else if (Array.isArray(statusJson.members)) {
                statusJson.members.forEach((m: any) => {
                  if (m.reviewed) done[m.uid] = true;
                });
              }
              setSubmittedMap(done);
            }
          }
        } catch (e) {
          console.warn('리뷰 상태를 불러오지 못함', e);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '프로젝트 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, userId]);

  const membersToReview = project?.members.filter((m) => m.id !== userId) || [];

  const setScore = (memberId: string, score: number) => {
    setReviews((prev) => ({
      ...prev,
      [memberId]: { ...prev[memberId], score, comment: prev[memberId]?.comment || '' },
    }));
  };

  const setComment = (memberId: string, comment: string) => {
    setReviews((prev) => ({
      ...prev,
      [memberId]: { score: prev[memberId]?.score || 0, comment },
    }));
  };

  const submitForMember = async (memberId: string) => {
    if (!project) return;
    if (!userId) {
      alert('로그인 후 이용해 주세요.');
      return;
    }
    const score = reviews[memberId]?.score || 0;
    const comment = (reviews[memberId]?.comment || '').trim();
    if (score <= 0 || !comment) {
      alert('평점과 한 줄 코멘트를 입력해주세요.');
      return;
    }

    setSubmittingMap((s) => ({ ...s, [memberId]: true }));
    try {
      const payload = {
        reviewer_id: userId,
        reviewee_id: memberId,
        score,
        comment,
      };

      const res = await fetch(`http://localhost:8000/projects/${projectId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `리뷰 작성에 실패했습니다.`);
      }

      setSubmittedMap((s) => ({ ...s, [memberId]: true }));
      alert('해당 팀원 리뷰가 제출되었습니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : '프로젝트 리뷰 저장 중 오류가 발생했습니다.');
    } finally {
      setSubmittingMap((s) => ({ ...s, [memberId]: false }));
    }
  };

  

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Button>
        </div>
        <Card className="p-6 shadow-lg">
          <p className="text-slate-700">프로젝트 정보를 불러오는 중입니다.</p>
        </Card>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Button>
        </div>
        <Card className="p-6 shadow-lg">
          <p className="text-red-600 mb-3">{error || '프로젝트 정보를 찾을 수 없습니다.'}</p>
          <Button onClick={onBack}>뒤로가기</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          돌아가기
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">프로젝트 상호 리뷰</h2>
        <p className="text-gray-600 mt-4 font-semibold">{project.title}</p>
        <p className="text-sm text-gray-500 mt-1">
          프로젝트에 함께한 팀원들의 기여도와 협업 태도를 간단히 남겨주세요.
        </p>
      </div>

      <div className="space-y-6">
        {membersToReview.length === 0 && (
          <Card className="p-6 shadow-lg bg-gradient-to-br from-white to-slate-50/30">
            <p className="text-slate-700">리뷰할 팀원이 없습니다.</p>
          </Card>
        )}

        {membersToReview.map((member) => (
          <Card key={member.id} className="p-6 shadow-lg bg-gradient-to-br from-white to-slate-50/30">
            <div className="flex items-start gap-4 mb-1">
              <Avatar className="h-12 w-12 ring-2 ring-indigo-100 ring-offset-2">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                  {member.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-slate-900">{member.name}</h3>
                  {member.isLeader && (
                    <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                      리더
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1.5">
                  {member.skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-slate-50">
                      {displaySkill(skill)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            {submittedMap[member.id] ? (
              <div className="py-6 flex items-center">
                <Badge variant="outline" className="text-sm">
                  이미 작성하셨습니다.
                </Badge>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="text-sm mb-3 block font-semibold text-slate-700">평점 *</label>
                  <div className="flex flex-wrap gap-2 sm:gap-3 items-center p-4 ">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        onClick={() => setScore(member.id, score)}
                        className="transition-transform hover:scale-125 active:scale-110"
                        type="button"
                      >
                        <Star
                          className={`h-8 sm:h-9 w-8 sm:w-9 transition-all ${
                            (reviews[member.id]?.score || 0) >= score
                              ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                              : 'text-slate-300 hover:text-slate-400'
                          }`}
                        />
                      </button>
                    ))}
                    {reviews[member.id]?.score > 0 && (
                      <span className="ml-0 sm:ml-3 text-slate-700 font-bold text-base sm:text-lg flex items-center bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-sm">
                        {reviews[member.id].score}.0
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm mb-2 block font-semibold text-slate-700">한 줄 코멘트 *</label>
                  <Textarea
                    placeholder="팀원의 기여도와 협업 태도를 간단히 남겨주세요."
                    value={reviews[member.id]?.comment || ''}
                    onChange={(e) => setComment(member.id, e.target.value)}
                    rows={4}
                    className="bg-white border-slate-200"
                  />
                  {reviews[member.id]?.comment && (
                    <p className="text-xs text-slate-500 mt-2">
                      {reviews[member.id].comment.length} / 500자
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <>
                    <Button
                      onClick={() => submitForMember(member.id)}
                      disabled={
                        submittingMap[member.id] ||
                        !(reviews[member.id]?.score > 0 && (reviews[member.id]?.comment || '').trim())
                      }
                      className="gap-2"
                    >
                      {submittingMap[member.id] ? '제출 중...' : '제출'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setReviews((prev) => ({ ...prev, [member.id]: { score: 0, comment: '' } }))}
                    >
                      입력 초기화
                    </Button>
                  </>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
        <h4 className="mb-2 text-indigo-900">평점 가이드라인</h4>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>⭐ 5점: 뛰어난 기여도와 적극적인 협업</li>
          <li>⭐ 4점: 충분한 기여와 좋은 협업</li>
          <li>⭐ 3점: 보통의 참여와 협업</li>
          <li>⭐ 2점: 기여나 협업 태도가 아쉬움</li>
          <li>⭐ 1점: 프로젝트 진행에 도움을 주지 못함</li>
        </ul>
        <p className="text-sm text-slate-600 mt-3">
          * 리뷰는 익명으로 처리되며 리더가 프로젝트 회고 시 참고 자료로 활용합니다.
        </p>
      </Card>

    </div>
  );
}
