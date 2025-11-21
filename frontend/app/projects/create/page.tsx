'use client';

import { useRouter } from 'next/navigation';

import { CreateProject } from '@/components/CreateProject';

export default function CreateProjectPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/projects');
  };

  const handleSubmit = () => {
    router.push('/myprojects');
  };

  return (
    <CreateProject
      onBack={handleBack}
      onSubmit={handleSubmit}
    />
  );
}
