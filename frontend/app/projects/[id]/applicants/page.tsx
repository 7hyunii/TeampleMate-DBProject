'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ApplicantManagement } from '@/components/ApplicantManagement';
import { useAuth } from '@/components/AuthProvider';

interface ApplicantsPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ applicantId?: string }>;
}

export default function ApplicantsPage({ params, searchParams }: ApplicantsPageProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const { id } = use(params);
  const resolvedSearch = searchParams ? use(searchParams) : undefined;

  return (
    <ApplicantManagement
      projectId={id}
      applicantId={resolvedSearch?.applicantId}
      currentUserId={userId}
      onBack={() => router.push('/myprojects')}
    />
  );
}
