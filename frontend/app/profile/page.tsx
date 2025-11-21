'use client';
import { useRouter } from 'next/navigation';
import { ProfileManagement } from '@/components/profile/ProfileManagement';
import { useAuth } from '@/components/auth/AuthProvider';

export default function ProfilePage() {
  const router = useRouter();
  const { userName } = useAuth();

  return (
    <ProfileManagement
      currentUser={userName}
      onLogout={() => router.push('/projects')}
    />
  );
}
