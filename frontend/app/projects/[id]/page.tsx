'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectDetail } from '@/components/ProjectDetail';
import { useAuth } from '@/components/AuthProvider';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const { id } = use(params);

  const handleBack = () => {
    router.push('/projects');
  };

  const handleManageApplicants = (projectId: string) => {
    router.push(`/projects/${projectId}/applicants`);
  };

  const handleReviewTeam = (projectId: string) => {
    router.push(`/projects/${projectId}/review`);
  };

  return (
    <ProjectDetail
      projectId={id}
      onBack={handleBack}
      currentUserId={userId}
      onManageApplicants={handleManageApplicants}
      onReviewTeam={handleReviewTeam}
    />
  );
}
