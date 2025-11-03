'use client';

import { useState } from 'react';
import { ArrowLeft, Check, X, Star, ExternalLink, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';

interface ApplicantManagementProps {
  projectId: string;
  onBack: () => void;
}

// === 모킹 데이터 시작 ===
const mockApplicants = [
  {
    id: 'app1',
    name: '홍길동',
    skills: ['React', 'TypeScript', 'Node.js'],
    profileText: '풀스택 개발에 관심이 많은 3학년 학생입니다. 다양한 프로젝트 경험을 쌓고 싶습니다.',
    website: 'https://github.com/honggildong',
    motivation: '이 프로젝트의 AI 기술 활용 부분에 큰 관심이 있습니다. React Native 경험을 살려 프론트엔드 개발에 기여하고 싶습니다.',
    appliedDate: '2025-11-01',
    status: 'Pending' as const,
    avgRating: 4.5,
    reviewCount: 3,
    pastReviews: [
      { score: 5, comment: '책임감이 강하고 코드 퀄리티가 우수합니다.', projectName: '웹 포트폴리오 제작' },
      { score: 4, comment: '커뮤니케이션이 원활하고 적극적입니다.', projectName: '쇼핑몰 프로젝트' },
      { score: 5, comment: '항상 기한을 잘 지키고 팀워크가 좋습니다.', projectName: '날씨 앱 개발' }
    ]
  },
  {
    id: 'app2',
    name: '김철수',
    skills: ['Python', 'Django', 'MySQL'],
    profileText: '백엔드 개발자를 목표로 하는 학생입니다. 데이터베이스 설계와 API 개발에 자신 있습니다.',
    website: 'https://github.com/kimcs',
    motivation: 'Node.js 기반 백엔드 개발 경험을 쌓고 싶어 지원했습니다. Python 경험을 바탕으로 빠르게 학습할 수 있습니다.',
    appliedDate: '2025-11-02',
    status: 'Pending' as const,
    avgRating: 4.8,
    reviewCount: 5,
    pastReviews: [
      { score: 5, comment: '기술적으로 뛰어나고 문제 해결 능력이 탁월합니다.', projectName: 'RESTful API 개발' },
      { score: 5, comment: '성실하고 책임감 있게 프로젝트를 완수했습니다.', projectName: '블로그 플랫폼' },
      { score: 4, comment: '적극적이고 배우려는 자세가 좋습니다.', projectName: '채팅 애플리케이션' }
    ]
  },
  {
    id: 'app3',
    name: '박영희',
    skills: ['UI/UX', 'Figma', 'React'],
    profileText: 'UI/UX 디자인과 프론트엔드 개발을 함께 하는 학생입니다.',
    website: 'https://behance.net/parkyh',
    motivation: '사용자 경험을 중시하는 학습 앱을 만들고 싶어 지원했습니다. 디자인부터 구현까지 기여하겠습니다.',
    appliedDate: '2025-11-02',
    status: 'Pending' as const,
    avgRating: 4.3,
    reviewCount: 2,
    pastReviews: [
      { score: 4, comment: '디자인 감각이 뛰어나고 세심합니다.', projectName: '여행 앱 UI' },
      { score: 4, comment: '사용자 관점에서 생각하는 능력이 좋습니다.', projectName: '대시보드 디자인' }
    ]
  }
];
// === 모킹 데이터 끝 ===

export function ApplicantManagement({ projectId, onBack }: ApplicantManagementProps) {
  const [applicants, setApplicants] = useState(mockApplicants);
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);

  const handleAccept = (id: string) => {
    setApplicants(prev => prev.map(app =>
      app.id === id ? { ...app, status: 'Accepted' as const } : app
    ));
  };

  const handleReject = (id: string) => {
    setApplicants(prev => prev.map(app =>
      app.id === id ? { ...app, status: 'Rejected' as const } : app
    ));
  };

  const pendingApplicants = applicants.filter(a => a.status === 'Pending');
  const acceptedApplicants = applicants.filter(a => a.status === 'Accepted');
  const rejectedApplicants = applicants.filter(a => a.status === 'Rejected');

  const ApplicantCard = ({ applicant }: { applicant: typeof mockApplicants[0] }) => (
    <Card className="p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-slate-50/30">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-indigo-100 ring-offset-2">
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
            {applicant.name[0]}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="mb-1">{applicant.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{applicant.avgRating.toFixed(1)}</span>
                </div>
                <span>·</span>
                <span>평가 {applicant.reviewCount}건</span>
                <span>·</span>
                <span>{applicant.appliedDate}</span>
              </div>
            </div>
            
            {applicant.status === 'Pending' && (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(applicant.id)}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  거절
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAccept(applicant.id)}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  승인
                </Button>
              </div>
            )}
            
            {applicant.status === 'Accepted' && (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">승인됨</Badge>
            )}
            
            {applicant.status === 'Rejected' && (
              <Badge className="bg-slate-50 text-slate-700 border-slate-200">거절됨</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {applicant.skills.map((skill, idx) => (
              <Badge key={idx} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                {skill}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-gray-700 mb-3">{applicant.profileText}</p>

          {applicant.website && (
            <a
              href={applicant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1 mb-3"
            >
              <ExternalLink className="h-3 w-3" />
              {applicant.website}
            </a>
          )}

          <div className="bg-indigo-50 p-4 rounded-lg mb-4 border border-indigo-100">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-indigo-900">지원 동기</p>
                <p className="text-sm text-slate-700 mt-1">{applicant.motivation}</p>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => setSelectedApplicant(
                selectedApplicant === applicant.id ? null : applicant.id
              )}
              className="text-sm text-primary hover:underline"
            >
              {selectedApplicant === applicant.id ? '과거 평가 숨기기' : '과거 평가 보기'}
            </button>

            {selectedApplicant === applicant.id && (
              <div className="mt-4 space-y-3">
                <Separator />
                {applicant.pastReviews.map((review, idx) => (
                  <div key={idx} className="pl-4 border-l-2 border-indigo-200 bg-indigo-50/30 py-2 rounded-r">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.score
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-600 font-medium">· {review.projectName}</span>
                    </div>
                    <p className="text-sm text-slate-700">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </Button>
      </div>

      <div>
        <h2>지원자 관리</h2>
        <p className="text-gray-600">AI 기반 학습 도우미 앱 개발</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            대기중 ({pendingApplicants.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            승인됨 ({acceptedApplicants.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            거절됨 ({rejectedApplicants.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApplicants.length > 0 ? (
            pendingApplicants.map(applicant => (
              <ApplicantCard key={applicant.id} applicant={applicant} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>대기 중인 지원자가 없습니다.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedApplicants.length > 0 ? (
            acceptedApplicants.map(applicant => (
              <ApplicantCard key={applicant.id} applicant={applicant} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>승인된 지원자가 없습니다.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedApplicants.length > 0 ? (
            rejectedApplicants.map(applicant => (
              <ApplicantCard key={applicant.id} applicant={applicant} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>거절된 지원자가 없습니다.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
