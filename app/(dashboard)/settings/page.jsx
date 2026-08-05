"use client";
import { Settings, Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings?.geminiApiKey) {
            setApiKey(data.settings.geminiApiKey);
          }
        }
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiApiKey: apiKey })
      });
      if (res.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (err) {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Settings</h1>
        <p className="text-[#64748B] text-sm mt-1">Configure your workspace and AI integration.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm divide-y divide-[#E2E8F0]">
        
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-bold text-[#0F172A]">AI Engine Setup</h3>
            <p className="text-[#64748B] text-sm mt-1">Your system is currently configured to use Gemini 3.5 Flash for AI generated replies.</p>
          </div>
          
          <div className="max-w-xl">
            <label className="block text-sm font-medium text-[#0F172A] mb-2">Gemini API Key</label>
            <div className="flex gap-3">
              <input 
                type="password"
                placeholder={loading ? "Loading..." : "Enter your Google Gemini API Key"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
              />
              <button 
                onClick={handleSave}
                disabled={saving || loading}
                className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-[#6D28D9] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
              </button>
            </div>
            <p className="text-xs text-[#64748B] mt-2">Get your API key from Google AI Studio. Keep this secret.</p>
          </div>
        </div>

        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-[#0F172A]">Workspace Preferences</h3>
            <p className="text-[#64748B] text-sm mt-1">Manage your team and billing details.</p>
          </div>
          <button className="bg-[#F8FAFC] text-[#0F172A] px-4 py-2 rounded-lg font-medium border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors">
            Manage (Coming Soon)
          </button>
        </div>

      </div>
    </div>
  );
}
