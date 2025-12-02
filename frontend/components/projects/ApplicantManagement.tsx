"use client";
import { useEffect, useState } from 'react';
import { ArrowLeft, Check, X, Star, ExternalLink, MessageSquare } from 'lucide-react';
import { SKILL_DISPLAY_MAP } from '../../constants/skills';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';

interface ApplicantManagementProps {
  projectId: string;
  applicantId?: string;
  currentUserId: string;
  onBack: () => void;
}

type ApplicantStatus = 'Pending' | 'Accepted' | 'Rejected';

type PastReview = { score: number; comment: string };

type Applicant = {
  id: string;
  applicantUid?: string;
  name: string;
  skills: string[];
  profileText?: string;
  website?: string;
  motivation?: string;
  appliedDate?: string;
  status: ApplicantStatus;
  avgRating?: number;
  reviewCount?: number;
  pastReviews?: PastReview[];
};

type ApiApplicant = {
  leader_id: string;
  project_id: number;
  application_id: number;
  applicant_id: string;
  applicant_date?: string;
  applicant_name?: string;
  applicant_email?: string;
  applicant_profile_text?: string;
  applicant_website_link?: string;
  applicant_motivation?: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  applicant_skills?: string[];
  applicant_reviews?: Array<{ score?: number; comment?: string }>;
};

type ApiApplicationsResponse = { applications: ApiApplicant[] };

function mapApiApplicantToApplicant(api: ApiApplicant): Applicant {
  return {
    id: String(api.application_id),
    applicantUid: api.applicant_id,
    name: api.applicant_name ?? api.applicant_id,
    skills: Array.isArray(api.applicant_skills) ? api.applicant_skills : [],
    profileText: api.applicant_profile_text ?? '',
    website: api.applicant_website_link ?? '',
    motivation: api.applicant_motivation ?? '',
    appliedDate: api.applicant_date ?? '',
    status: api.status,
    avgRating: undefined,
    reviewCount: api.applicant_reviews ? api.applicant_reviews.length : 0,
    pastReviews: api.applicant_reviews
      ? api.applicant_reviews.map(r => ({ score: r.score ?? 0, comment: r.comment ?? '' }))
      : [],
  };
}

function displaySkill(skill: string): string {
  const key = skill.trim().toLowerCase();
  return SKILL_DISPLAY_MAP[key] || skill.charAt(0).toUpperCase() + skill.slice(1);
}

export function ApplicantManagement({ projectId, applicantId, currentUserId, onBack }: ApplicantManagementProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`http://127.0.0.1:8000/projects/${projectId}/applications?current_user_id=${currentUserId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
        return res.json();
      })
      .then((data: ApiApplicationsResponse | ApiApplicant[]) => {
        if (!mounted) return;
        let apiList: ApiApplicant[];
        if (Array.isArray(data)) {
          apiList = data;
        } else if (data && Array.isArray(data.applications)) {
          apiList = data.applications;
        } else {
          throw new Error('Unexpected response shape from applications API');
        }

        const mapped = apiList.map(mapApiApplicantToApplicant);
        setApplicants(mapped);
        if (applicantId) {
          const found = mapped.find(m => m.applicantUid === applicantId);
          if (found) setSelectedApplicant(found.id);
        }
      })
      .catch((err: any) => {
        if (mounted) setError(err?.message ?? 'Unknown error');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [projectId, currentUserId, applicantId]);

  const updateStatus = async (id: string, newStatus: ApplicantStatus) => {
    const idx = applicants.findIndex(a => a.id === id);
    if (idx === -1) return;
    const applicant = applicants[idx];
    if (!applicant.applicantUid) {
      alert('지원자 UID가 없습니다.');
      return;
    }

    const originalStatus = applicant.status;

    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    setUpdatingIds(prev => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });

    try {
      const res = await fetch(`http://127.0.0.1:8000/projects/${projectId}/applications/${applicant.applicantUid}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_status: newStatus, leader_id: currentUserId }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`업데이트 실패: ${res.status} ${text}`);
      }
    } catch (err: any) {
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: originalStatus } : a));
      const msg = err?.message ?? '알 수 없는 오류';
      setError(msg);
      alert(msg);
    } finally {
      setUpdatingIds(prev => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    }
  };

  const handleAccept = (id: string) => updateStatus(id, 'Accepted');
  const handleReject = (id: string) => updateStatus(id, 'Rejected');

  const safeApplicants = Array.isArray(applicants) ? applicants : [];
  const pendingApplicants = safeApplicants.filter(a => a.status === 'Pending');
  const acceptedApplicants = safeApplicants.filter(a => a.status === 'Accepted');
  const rejectedApplicants = safeApplicants.filter(a => a.status === 'Rejected');

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">로딩 중...</div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center text-red-600">에러: {error}</div>
    );
  }

  const ApplicantCard = ({ applicant }: { applicant: Applicant }) => (
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
              <h3 className="mb-1 font-medium">{applicant.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>평가 {applicant.reviewCount ?? 0}건</span>
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
                  disabled={updatingIds.has(applicant.id)}
                >
                  <X className="h-4 w-4" />
                  거절
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAccept(applicant.id)}
                  className="gap-2"
                  disabled={updatingIds.has(applicant.id)}
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
            {applicant.skills.map((skill: string, idx: number) => (
              <Badge key={idx} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                {displaySkill(skill)}
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
                {applicant.pastReviews?.map((review: PastReview, idx: number) => (
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
