'use client';
import { useRouter } from 'next/navigation';
import { MyProjects } from '@/components/projects/MyProjects';

export default function MyProjectsPage() {
  const router = useRouter();

  return (
    <MyProjects
      onCreateProject={() => router.push('/projects/create')}
      onManageApplicants={(projectId) => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`projectView:${projectId}`, 'applicants');
        }
        router.push(`/projects/${projectId}`);
      }}
      onReviewTeam={(projectId) => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`projectView:${projectId}`, 'review');
        }
        router.push(`/projects/${projectId}`);
      }}
      onViewProject={(projectId) => router.push(`/projects/${projectId}`)}
    />
  );
}
