import { createBrowserRouter, Link, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CollectPage } from './pages/CollectPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ActionPlanPage } from './pages/ActionPlanPage';
import { HelpPage } from './pages/HelpPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AboutPage } from './pages/AboutPage';

function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl font-black text-brand">404</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">
        SMED Up
      </Link>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projetos', element: <ProjectsPage /> },
      { path: 'projeto/:id', element: <Navigate to="coleta" replace /> },
      { path: 'projeto/:id/coleta', element: <CollectPage /> },
      { path: 'projeto/:id/analise', element: <AnalyzePage /> },
      { path: 'projeto/:id/plano', element: <ActionPlanPage /> },
      { path: 'ajuda', element: <HelpPage /> },
      { path: 'privacidade', element: <PrivacyPage /> },
      { path: 'sobre', element: <AboutPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
