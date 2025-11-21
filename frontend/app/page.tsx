'use client';

import { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { Navigation } from '../components/Navigation';
import { ProjectList } from '../components/ProjectList';
import { ProjectDetail } from '../components/ProjectDetail';
import { CreateProject } from '../components/CreateProject';
import { ApplicantManagement } from '../components/ApplicantManagement';
import { ProfileManagement } from '../components/ProfileManagement';
import { MyApplications } from '../components/MyApplications';
import { MyProjects } from '../components/MyProjects';
import { PeerReview } from '../components/PeerReview';
import { Footer } from '../components/Footer';

type View = 
  | 'projects' 
  | 'project-detail' 
  | 'create-project' 
  | 'applicant-management'
  | 'profile'
  | 'applications'
  | 'my-projects'
  | 'peer-review';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { userId, userName } = useAuth();

  const handleViewDetail = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('project-detail');
  };

  const handleBack = () => {
    setCurrentView('projects');
    setSelectedProjectId(null);
  };

  const handleCreateProject = () => {
    setCurrentView('create-project');
  };

  const handleProjectCreated = () => {
    setCurrentView('my-projects');
  };

  const handleManageApplicants = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('applicant-management');
  };

  const handleReviewTeam = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('peer-review');
  };

  const handleViewChange = (view: string) => {
    if (view === 'projects') {
      setCurrentView('projects');
    } else if (view === 'profile') {
      setCurrentView('profile');
    } else if (view === 'applications') {
      setCurrentView('applications');
    } else if (view === 'my-projects') {
      setCurrentView('my-projects');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Navigation
        currentView={currentView}
        onViewChange={handleViewChange}
      />
      <main className="container mx-auto px-4 py-4 md:py-8 pb-24 md:pb-8 flex-1">
        {currentView === 'projects' && (
          <ProjectList 
            onViewDetail={handleViewDetail}
            onCreateProject={handleCreateProject}
          />
        )}
        {currentView === 'project-detail' && selectedProjectId && (
          <ProjectDetail
            projectId={selectedProjectId}
            onBack={handleBack}
            currentUserId={userId}
            onManageApplicants={handleManageApplicants}
            onReviewTeam={handleReviewTeam}
          />
        )}
        {currentView === 'create-project' && (
          <CreateProject
            onBack={handleBack}
            onSubmit={handleProjectCreated}
          />
        )}
        {currentView === 'applicant-management' && selectedProjectId && (
          <ApplicantManagement
            projectId={selectedProjectId}
            currentUserId={userId}
            onBack={() => setCurrentView('my-projects')}
          />
        )}
        {currentView === 'profile' && (
          <ProfileManagement 
            currentUser={userName}
            onLogout={() => setCurrentView('projects')}
          />
        )}
        {currentView === 'applications' && (
          <MyApplications 
            currentUserId={userId}
          />
        )}
        {currentView === 'my-projects' && (
          <MyProjects
            onCreateProject={handleCreateProject}
            onManageApplicants={handleManageApplicants}
            onReviewTeam={handleReviewTeam}
            onViewProject={handleViewDetail}
          />
        )}
        {currentView === 'peer-review' && selectedProjectId && (
          <PeerReview
            projectId={selectedProjectId}
            onBack={() => setCurrentView('my-projects')}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
