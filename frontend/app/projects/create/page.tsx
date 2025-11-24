'use client';
import { useRouter } from 'next/navigation';
import { CreateProject } from '@/components/projects/CreateProject';

export default function CreateProjectPage() {
  const router = useRouter();

  return (
    <CreateProject
      onBack={() => router.push('/projects')}
      onSubmit={() => router.push('/projects')}
    />
  );
}
