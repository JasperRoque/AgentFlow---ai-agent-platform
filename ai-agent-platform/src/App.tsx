import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from './stores/useAppStore';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentDetailPage } from './pages/AgentDetailPage';
import { TasksPage } from './pages/TasksPage';
import { AIDrivePage } from './pages/AIDrivePage';
import { ProfilePage } from './pages/ProfilePage';
import { SuperAgentPage } from './pages/SuperAgentPage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Toaster } from 'sonner';

function App() {
  const { loading, loadInitialData } = useAppStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/agents/:agentId" element={<AgentDetailPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/aidrive" element={<AIDrivePage />} />
            <Route path="/me" element={<ProfilePage />} />
            <Route path="/super-agent" element={<SuperAgentPage />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
