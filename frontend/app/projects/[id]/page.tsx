'use client';
import { useEffect, useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { ApplicantManagement } from '@/components/projects/ApplicantManagement';
import { PeerReview } from '@/components/projects/PeerReview';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { useAuth } from '@/components/auth/AuthProvider';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | undefined>>;
}

export default function ProjectDetailPage({ params, searchParams }: ProjectDetailPageProps) {
  const router = useRouter();
  const { userId, isLoggedIn } = useAuth();
  const { id } = use(params);
  const resolvedSearch = searchParams ? use(searchParams) : {};
  if ('view' in resolvedSearch || 'applicantId' in resolvedSearch) {
    notFound();
  }
  const [view, setView] = useState<'detail' | 'applicants' | 'review'>('detail');
  const [initialApplicant, setInitialApplicant] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedView = sessionStorage.getItem(`projectView:${id}`);
    const storedApplicant = sessionStorage.getItem(`projectViewApplicant:${id}`) || undefined;
    if (storedView === 'applicants' || storedView === 'review') {
      setView(storedView);
      setInitialApplicant(storedApplicant);
      sessionStorage.removeItem(`projectView:${id}`);
      sessionStorage.removeItem(`projectViewApplicant:${id}`);
    }
  }, [id]);

  useEffect(() => {
    if ((view === 'applicants' || view === 'review') && !isLoggedIn) {
      setView('detail');
    }
  }, [view, isLoggedIn]);

  const goToDetail = () => {
    setView('detail');
  };

  const goToApplicants = (applicantId?: string) => {
    setView('applicants');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`projectView:${id}`, 'applicants');
      if (applicantId) {
        sessionStorage.setItem(`projectViewApplicant:${id}`, applicantId);
      } else {
        sessionStorage.removeItem(`projectViewApplicant:${id}`);
      }
    }
  };

  const goToReview = () => {
    setView('review');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`projectView:${id}`, 'review');
      sessionStorage.removeItem(`projectViewApplicant:${id}`);
    }
  };

  const handleBackToList = () => {
    router.push('/projects');
  };

  if (view === 'applicants') {
    return (
      <ApplicantManagement
        projectId={id}
        applicantId={initialApplicant}
        currentUserId={userId}
        onBack={() => {
          setView('detail');
        }}
      />
    );
  }

  if (view === 'review') {
    return (
      <PeerReview
        projectId={id}
        onBack={goToDetail}
      />
    );
  }

  return (
    <ProjectDetail
      projectId={id}
      onBack={handleBackToList}
      currentUserId={userId}
      onManageApplicants={() => goToApplicants()}
      onReviewTeam={() => goToReview()}
    />
  );
}
