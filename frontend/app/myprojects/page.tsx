'use client';
import { useRouter } from 'next/navigation';
import { MyProjects } from '@/components/MyProjects';

export default function MyProjectsPage() {
  const router = useRouter();

  return (
    <MyProjects
      onCreateProject={() => router.push('/projects/create')}
      onManageApplicants={(projectId) => router.push(`/projects/${projectId}/applicants`)}
      onReviewTeam={(projectId) => router.push(`/projects/${projectId}/review`)}
      onViewProject={(projectId) => router.push(`/projects/${projectId}`)}
    />
  );
}
