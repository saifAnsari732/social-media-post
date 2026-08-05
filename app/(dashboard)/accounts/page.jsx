"use client";
import { Link2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts", {
        headers: { "x-user-id": "saif@example.com" } // Temporary mock user ID for testing
      });
      const data = await res.json();
      if (data.accounts) setAccounts(data.accounts);
    } catch (error) {
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this account? Automation rules linked to it may stop working.")) return;
    try {
      const res = await fetch("/api/accounts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-user-id": "saif@example.com" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success("Account removed");
        setAccounts(accounts.filter(a => a._id !== id));
      }
    } catch (e) {
      toast.error("Failed to remove account");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Connected Accounts</h1>
          <p className="text-[#64748B] text-sm mt-1">Manage your connected Meta (Instagram & Facebook) accounts.</p>
        </div>
        <button className="bg-[#7C3AED] text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-[#6D28D9] transition-colors flex items-center gap-2">
          <Link2 className="w-4 h-4" /> Connect Meta Account
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#64748B]">Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
            <Link2 className="w-8 h-8 text-[#94A3B8]" />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A] mb-2">No accounts connected</h3>
          <p className="text-[#64748B] max-w-sm mx-auto mb-6">Connect your Instagram Professional account and Facebook Page to start automating replies.</p>
          <button className="bg-[#7C3AED] text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-[#6D28D9] transition-colors">
            Connect Account Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map(acc => (
            <div key={acc._id} className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col items-center text-center relative group">
              <button 
                onClick={() => handleDelete(acc._id)}
                className="absolute top-4 right-4 p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm ${
                acc.platform === 'instagram' ? 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]' :
                acc.platform === 'facebook' ? 'bg-[#1877F2]' : 'bg-[#0F172A]'
              }`}>
                {/* Basic initial if no specific icon */}
                <span className="font-bold text-2xl uppercase">{acc.platform[0]}</span>
              </div>
              <h3 className="font-bold text-[#0F172A] capitalize text-lg">{acc.name || acc.platform}</h3>
              <p className="text-[#64748B] text-sm mt-1 capitalize">{acc.platform} Account</p>
              
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] w-full flex justify-between items-center">
                 <span className="text-xs text-[#94A3B8]">Connected</span>
                 <span className="text-xs font-medium text-[#10B981] flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div> Active
                 </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
