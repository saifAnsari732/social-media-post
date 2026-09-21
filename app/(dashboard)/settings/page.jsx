"use client";

import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save, Key, User, Building, Bell, Shield, Cpu, Globe } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("API & AI");
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

  const navSections = [
    { name: "API & AI", icon: Cpu },
    { name: "Account Profile", icon: User },
    { name: "Workspace", icon: Building },
    { name: "Notifications", icon: Bell },
    { name: "Security & Keys", icon: Shield },
    { name: "Integrations", icon: Globe }
  ];

  return (
    <div className="space-y-8 font-sans">
      <div className="pb-6 border-b border-slate-200/80">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Configure your Gemini AI Engine, Meta integrations, and workspace preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Settings Sub-Nav (Matches Section 16 of Prompt) */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm space-y-1">
          {navSections.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveSection(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                activeSection === item.name
                  ? "bg-violet-50 text-violet-700 border border-violet-100 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeSection === item.name ? "text-violet-600" : "text-slate-400"}`} />
              {item.name}
            </button>
          ))}
        </div>

        {/* Right Settings Content Area */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          
          {activeSection === "API & AI" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Gemini 3.5 AI Copilot Integration</h3>
                <p className="text-xs text-slate-500 mt-1">Configure your Google Gemini API key to enable AI caption generation and automated DM responses.</p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Gemini API Key</label>
                  <div className="flex gap-3">
                    <input 
                      type="password"
                      placeholder={loading ? "Loading key..." : "AIzaSy..."}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-mono focus:outline-none focus:border-violet-600"
                    />
                    <button 
                      onClick={handleSave}
                      disabled={saving || loading}
                      className="bg-violet-600 text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md shadow-violet-600/20 hover:bg-violet-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Key"}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Get your key from Google AI Studio. Stored encrypted in your database.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection !== "API & AI" && (
            <div className="text-center py-12 space-y-3">
              <Building className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">{activeSection} Preferences</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                These settings are automatically managed by your active SaaS subscription plan.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
