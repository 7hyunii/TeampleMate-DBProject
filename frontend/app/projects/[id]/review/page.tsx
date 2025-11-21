'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { PeerReview } from '@/components/PeerReview';

interface PeerReviewPageProps {
  params: Promise<{ id: string }>;
}

export default function PeerReviewPage({ params }: PeerReviewPageProps) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <PeerReview
      projectId={id}
      onBack={() => router.push('/myprojects')}
    />
  );
}
