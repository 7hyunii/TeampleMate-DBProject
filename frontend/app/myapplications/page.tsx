'use client';
import { MyApplications } from '@/components/applications/MyApplications';
import { useAuth } from '@/components/auth/AuthProvider';
export default function ApplicationsPage() {
  const { userId } = useAuth();

  return (
    <MyApplications currentUserId={userId} />
  );
}
