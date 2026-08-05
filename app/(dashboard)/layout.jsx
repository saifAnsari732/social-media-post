import Sidebar from '@/components/layout/Sidebar';
import TopNavbar from '@/components/layout/TopNavbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopNavbar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
