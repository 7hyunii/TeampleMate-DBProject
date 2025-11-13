'use client';

import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState, useEffect } from 'react';

interface Application {
    application_id: string;
    project_id: string;
    project_topic: string;
    project_leader_id: string;
    project_leader_name: string;
    applicant_date: string;
    motivation: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
  }

export function MyApplications({ currentUserId }: { currentUserId: string }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyApplications() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:8000/applications/me?current_user_id=${currentUserId}`);
        if (!res.ok) throw new Error("데이터를 불러올 수 없습니다.");
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : Array.isArray(data.applications) ? data.applications : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    }
    fetchMyApplications();
  }, [currentUserId]);

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
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl -z-0" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-2 text-slate-900 leading-tight">{app.project_topic}</h3>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{app.project_leader_name?.[0]}</span>
                </div>
                <span className="text-slate-600">리더: <span className="font-medium">{app.project_leader_name}</span></span>
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
              <span>{app.applicant_date}</span>
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

  function SkeletonCard() {
    return (
      <div className="animate-pulse bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col gap-3 min-h-[180px]">
        <div className="h-6 w-2/3 bg-slate-200 rounded mb-2" />
        <div className="h-4 w-1/2 bg-slate-100 rounded mb-1" />
        <div className="h-4 w-1/3 bg-slate-100 rounded mb-1" />
        <div className="flex gap-2 mt-2">
          <div className="h-6 w-16 bg-slate-100 rounded" />
          <div className="h-6 w-16 bg-slate-100 rounded" />
        </div>
        <div className="h-8 w-24 bg-slate-200 rounded mt-4" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 min-h-[800px]">
        <div>
          <h2>내 지원현황</h2>
          <p className="text-gray-600">지원한 프로젝트의 현황을 확인하세요</p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)}
        </div>
      </div>
    );
  }
  
  if (error) {
      return (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h2>내 지원현황</h2>
            <p className="text-gray-600">지원한 프로젝트의 현황을 확인하세요</p>
          </div>
          <div className="flex flex-col items-center justify-center text-red-600 mt-20">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">데이터를 불러올 수 없습니다</h3>
            <p className="mb-4">잠시 후 다시 시도하거나 새로고침 해주세요.</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              새로고침
            </Button>
          </div>
        </div>
      );
    }
  
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
          {applications.length > 0 ? (
            applications.map(app => (
              <ApplicationCard key={app.application_id} app={app} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>지원한 프로젝트가 없습니다.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          {pendingApps.length > 0 ? (
            pendingApps.map(app => (
              <ApplicationCard key={app.application_id} app={app} />
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
              <ApplicationCard key={app.application_id} app={app} />
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
              <ApplicationCard key={app.application_id} app={app} />
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
