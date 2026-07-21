import { Outlet, useMatches } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import MobileNav from '../components/layout/MobileNav.jsx';
import TopBar from '../components/layout/TopBar.jsx';

export default function MainLayout() {
  const matches = useMatches();
  const current = matches[matches.length - 1]?.handle || {};

  return (
    <div className="flex h-screen overflow-hidden bg-void">
      <Sidebar />
      <MobileNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={current.title || 'Vector Lab'} subtitle={current.subtitle} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
