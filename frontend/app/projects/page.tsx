'use client';
import { useRouter } from 'next/navigation';
import { ProjectList } from '@/components/projects/ProjectList';

export default function ProjectsPage() {
  const router = useRouter();

  const handleViewDetail = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    router.push('/projects/create');
  };

  return (
    <ProjectList
      onViewDetail={handleViewDetail}
      onCreateProject={handleCreateProject}
    />
  );
}
