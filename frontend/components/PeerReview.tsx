'use client';

import { useState } from 'react';
import { ArrowLeft, Star, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

interface PeerReviewProps {
  projectId: string;
  onBack: () => void;
}

export function PeerReview({ projectId, onBack }: PeerReviewProps) {
  const [reviews, setReviews] = useState<{
    [key: string]: { score: number; comment: string };
  }>({});

  // === 모킹 데이터 시작 ===
  const project = {
    id: '5',
    title: '데이터 시각화 대시보드',
    members: [
      { id: 'user1', name: '정현우', role: '리더', skills: ['D3.js', 'React'] },
      { id: 'user2', name: '김민수', role: '팀원', skills: ['Python', 'FastAPI'] },
      { id: 'user3', name: '박서진', role: '팀원', skills: ['React', 'TypeScript'] }
    ]
  };

  const currentUserId = 'user2'; // 현재 사용자
  // === 모킹 데이터 끝 ===
  
  const membersToReview = project.members.filter(m => m.id !== currentUserId);

  const setScore = (memberId: string, score: number) => {
    setReviews(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], score, comment: prev[memberId]?.comment || '' }
    }));
  };

  const setComment = (memberId: string, comment: string) => {
    setReviews(prev => ({
      ...prev,
      [memberId]: { score: prev[memberId]?.score || 0, comment }
    }));
  };

  const handleSubmit = () => {
    console.log('Reviews submitted:', reviews);
    alert('평가가 제출되었습니다!');
    onBack();
  };

  const allReviewsComplete = membersToReview.every(
    member => reviews[member.id]?.score > 0 && reviews[member.id]?.comment?.trim()
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </Button>
      </div>

      <div>
        <h2>팀원 상호 평가</h2>
        <p className="text-gray-600">{project.title}</p>
        <p className="text-sm text-gray-500 mt-1">
          프로젝트에 참여한 팀원들의 기여도와 협업 태도를 평가해주세요
        </p>
      </div>

      <div className="space-y-6">
        {membersToReview.map(member => (
          <Card key={member.id} className="p-6 shadow-lg bg-gradient-to-br from-white to-slate-50/30">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-12 w-12 ring-2 ring-indigo-100 ring-offset-2">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                  {member.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-slate-900">{member.name}</h3>
                  {member.role === '리더' && (
                    <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">리더</Badge>
                  )}
                </div>
                <div className="flex gap-1.5">
                  {member.skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-slate-50">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />

            <div className="space-y-5">
              <div>
                <label className="text-sm mb-3 block font-semibold text-slate-700">평점 *</label>
                <div className="flex flex-wrap gap-2 sm:gap-3 items-center p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-xl border border-amber-100">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      onClick={() => setScore(member.id, score)}
                      className="transition-transform hover:scale-125 active:scale-110"
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
                <label className="text-sm mb-2 block font-semibold text-slate-700">평가 코멘트 *</label>
                <Textarea
                  placeholder="팀원의 기여도, 협업 태도, 책임감 등을 구체적으로 작성해주세요"
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
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-sm">
        <h4 className="mb-2 text-indigo-900">평가 가이드라인</h4>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• 5점: 매우 우수 - 기대 이상의 기여와 뛰어난 협업 태도</li>
          <li>• 4점: 우수 - 충분한 기여와 좋은 협업 태도</li>
          <li>• 3점: 보통 - 기본적인 역할 수행</li>
          <li>• 2점: 미흡 - 기여도나 협업 태도가 부족</li>
          <li>• 1점: 매우 미흡 - 프로젝트 진행에 방해가 됨</li>
        </ul>
        <p className="text-sm text-slate-600 mt-3">
          * 평가 결과는 익명으로 처리되며, 향후 다른 프로젝트의 리더가 참고 자료로 활용합니다.
        </p>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          나중에 하기
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!allReviewsComplete}
          className="flex-1 gap-2"
        >
          <Send className="h-4 w-4" />
          평가 제출
        </Button>
      </div>
    </div>
  );
}
