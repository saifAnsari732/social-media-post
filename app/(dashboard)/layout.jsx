import Sidebar from '@/components/layout/Sidebar';
import TopNavbar from '@/components/layout/TopNavbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f3ff_0%,_#f8fafc_35%,_#f8fafc_100%)] text-slate-800">
      <Sidebar />
      <div className="ml-72 flex min-h-screen flex-col">
        <TopNavbar />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
