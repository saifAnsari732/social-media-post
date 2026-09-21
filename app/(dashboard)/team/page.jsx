"use client";

import { useState } from "react";
import { Users, UserPlus, ShieldCheck, Mail, CheckCircle2, MoreVertical, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TeamPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Editor");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: "Saifuddin Ansari",
      email: "ansarisaifuddin732@gmail.com",
      role: "Owner",
      status: "Active",
      lastActive: "Just Now",
      posts: "128"
    },
    {
      id: 2,
      name: "Brooklyn Simmons",
      email: "brook.sim@example.com",
      role: "Admin",
      status: "Active",
      lastActive: "2 hours ago",
      posts: "45"
    },
    {
      id: 3,
      name: "Dwayne Tatum",
      email: "dwayne.t@agency.com",
      role: "Manager",
      status: "Active",
      lastActive: "1 day ago",
      posts: "22"
    }
  ];

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    toast.success(`Invite sent to ${inviteEmail} as ${inviteRole}!`);
    setInviteEmail("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Team & Workspace Members</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage your agency team members, permissions, and roles.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <th className="py-3.5 px-6">Member</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Last Active</th>
              <th className="py-3.5 px-4">Posts Created</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                      <span className="text-[11px] text-slate-400">{member.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-800 text-[11px]">
                    {member.role}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    <CheckCircle2 className="w-3 h-3" /> {member.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-500">{member.lastActive}</td>
                <td className="py-4 px-4 font-bold text-slate-900">{member.posts}</td>
                <td className="py-4 px-6 text-right">
                  {member.role !== "Owner" && (
                    <button onClick={() => toast.success("Member removed")} className="p-1.5 text-slate-400 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Invite New Team Member</h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="colleague@agency.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:border-violet-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-violet-600"
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Manager">Manager (Publish & Automation)</option>
                  <option value="Editor">Editor (Create & Draft)</option>
                  <option value="Viewer">Viewer (Read Only)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-700 shadow-md shadow-violet-600/20"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
