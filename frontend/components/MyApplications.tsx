'use client';

import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function MyApplications() {
  // === 모킹 데이터 시작 ===
  const applications = [
    {
      id: '1',
      projectTitle: '부산 대학가 맛집 추천 플랫폼',
      projectLeader: '박지영',
      appliedDate: '2025-11-01',
      status: 'Pending' as const,
      motivation: '지역 기반 서비스에 관심이 많아 지원했습니다. React와 지도 API 경험을 살려 기여하고 싶습니다.'
    },
    {
      id: '2',
      projectTitle: 'IoT 스마트 캠퍼스 프로젝트',
      projectLeader: '최서연',
      appliedDate: '2025-10-28',
      status: 'Accepted' as const,
      motivation: 'IoT에 관심이 있어 지원했습니다. Python과 하드웨어 경험을 바탕으로 참여하고 싶습니다.'
    },
    {
      id: '3',
      projectTitle: '블록체인 기반 중고거래 시스템',
      projectLeader: '이준호',
      appliedDate: '2025-10-25',
      status: 'Rejected' as const,
      motivation: '블록체인 기술을 배우고 싶어 지원했습니다.'
    },
    {
      id: '4',
      projectTitle: '데이터 시각화 대시보드',
      projectLeader: '정현우',
      appliedDate: '2025-10-20',
      status: 'Accepted' as const,
      motivation: 'D3.js를 활용한 데이터 시각화에 관심이 있어 지원했습니다.'
    }
  ];
  // === 모킹 데이터 끝 ===

  const pendingApps = applications.filter(a => a.status === 'Pending');
  const acceptedApps = applications.filter(a => a.status === 'Accepted');
  const rejectedApps = applications.filter(a => a.status === 'Rejected');

  const statusConfig = {
    Pending: {
      icon: Clock,
      text: '대기중',
      className: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    Accepted: {
      icon: CheckCircle,
      text: '승인됨',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    Rejected: {
      icon: XCircle,
      text: '거절됨',
      className: 'bg-slate-50 text-slate-700 border-slate-200'
    }
  };

  const ApplicationCard = ({ app }: { app: typeof applications[0] }) => {
    const config = statusConfig[app.status];
    const Icon = config.icon;

    return (
      <Card className="p-6 shadow-lg hover:shadow-xl transition-all hover:border-indigo-200 bg-gradient-to-br from-white to-slate-50/30 relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl -z-0" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="mb-2 text-slate-900 leading-tight">{app.projectTitle}</h3>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{app.projectLeader[0]}</span>
                </div>
                <span className="text-slate-600">리더: <span className="font-medium">{app.projectLeader}</span></span>
              </div>
            </div>
            <Badge className={`${config.className} shadow-sm`}>
              <Icon className="h-3 w-3 mr-1" />
              {config.text}
            </Badge>
          </div>

          <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-4 rounded-xl mb-4 border border-indigo-100/50">
            <p className="text-xs text-indigo-900 mb-1.5 font-semibold">지원 동기</p>
            <p className="text-sm text-slate-700 leading-relaxed">{app.motivation}</p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-3" />

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-600 bg-slate-100/70 px-2.5 py-1.5 rounded-lg">
              <Calendar className="h-3.5 w-3.5" />
              <span>{app.appliedDate}</span>
            </div>
            {app.status === 'Pending' && (
              <span className="text-amber-700 font-medium text-xs">리더의 승인을 기다리고 있습니다</span>
            )}
            {app.status === 'Accepted' && (
              <span className="text-emerald-700 font-medium text-xs">팀원으로 승인되었습니다</span>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2>내 지원현황</h2>
        <p className="text-gray-600">지원한 프로젝트의 현황을 확인하세요</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            전체 ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            대기중 ({pendingApps.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            승인됨 ({acceptedApps.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            거절됨 ({rejectedApps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {applications.map(app => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingApps.length > 0 ? (
            pendingApps.map(app => (
              <ApplicationCard key={app.id} app={app} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>대기 중인 지원이 없습니다.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {acceptedApps.length > 0 ? (
            acceptedApps.map(app => (
              <ApplicationCard key={app.id} app={app} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>승인된 지원이 없습니다.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedApps.length > 0 ? (
            rejectedApps.map(app => (
              <ApplicationCard key={app.id} app={app} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <XCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>거절된 지원이 없습니다.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
