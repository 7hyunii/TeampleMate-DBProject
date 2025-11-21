'use client';
import { MyApplications } from '@/components/MyApplications';
import { useAuth } from '@/components/AuthProvider';
export default function ApplicationsPage() {
  const { userId } = useAuth();

  return (
    <MyApplications currentUserId={userId} />
  );
}
