"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X, Zap } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

export default function NewCommentRulePage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    account: "",
    platform: "instagram",
    type: "comment", // THIS IS THE KEY DIFFERENCE
    trigger: {
      type: "keyword",
      keywords: [],
      keywordMatchType: "any",
      caseSensitive: false
    },
    dmReply: {
      enabled: true,
      useAI: false,
      systemPrompt: "",
      messages: [{ text: "" }]
    }
  });

  const [kwInput, setKwInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const userStr = localStorage.getItem("yt_user");
      if (!userStr) return;
      const { userId } = JSON.parse(userStr);

      const res = await fetch("/api/accounts", { headers: { "x-user-id": userId } });
      const data = await res.json();
      setAccounts(data.accounts || []);
      if (data.accounts?.length > 0) {
        setFormData(f => ({ ...f, account: data.accounts[0]._id, platform: data.accounts[0].platform }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && kwInput.trim()) {
      e.preventDefault();
      if (!formData.trigger.keywords.includes(kwInput.trim())) {
        setFormData(f => ({
          ...f,
          trigger: { ...f.trigger, keywords: [...f.trigger.keywords, kwInput.trim()] }
        }));
      }
      setKwInput("");
    }
  };

  const removeKeyword = (kw) => {
    setFormData(f => ({
      ...f,
      trigger: { ...f.trigger, keywords: f.trigger.keywords.filter(k => k !== kw) }
    }));
  };

  const handleSave = async () => {
    if (!formData.name) return toast.error("Rule name is required");
    if (!formData.account) return toast.error("Select an account");
    if (formData.trigger.type === 'keyword' && formData.trigger.keywords.length === 0) {
      return toast.error("Add at least one trigger keyword");
    }
    
    if (formData.dmReply.useAI) {
      if (!formData.dmReply.systemPrompt) return toast.error("System prompt cannot be empty");
    } else {
      if (!formData.dmReply.messages[0].text) return toast.error("Reply message cannot be empty");
    }

    setSaving(true);
    try {
      const userStr = localStorage.getItem("yt_user");
      const { userId } = JSON.parse(userStr);

      const res = await fetch("/api/rules", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": userId
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success("Comment Rule saved successfully!");
        router.push("/comments");
      } else {
        toast.error("Failed to save rule");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/comments" className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-[#0F172A]">Create New Comment Rule</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#7C3AED]/20 hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Rule"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Step 1: Basics */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center text-xs">1</span> 
            Basics
          </h2>
          <div className="grid gap-5">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Rule Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Price Inquiry Auto Reply"
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Apply to Account</label>
              <select 
                value={formData.account}
                onChange={e => {
                  const acc = accounts.find(a => a._id === e.target.value);
                  setFormData({...formData, account: e.target.value, platform: acc?.platform || 'instagram'});
                }}
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              >
                <option value="">Select an account</option>
                {accounts.map(acc => (
                  <option key={acc._id} value={acc._id}>{acc.name} ({acc.platform})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Trigger */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center text-xs">2</span> 
            What comment should trigger this?
          </h2>
          
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Keywords</label>
            <p className="text-xs text-[#64748B] mb-3">Type a keyword and press Enter. Examples: price, cost, kitna, how much</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.trigger.keywords.map((kw, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-[#7C3AED]/10 text-[#7C3AED] px-3 py-1.5 rounded-full text-sm font-medium border border-[#7C3AED]/20">
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="text-[#7C3AED] hover:text-[#5B21B6]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <input 
              type="text" 
              value={kwInput}
              onChange={e => setKwInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              placeholder="Add keyword and press Enter..."
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>
        </div>

        {/* Step 3: Reply Message */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center text-xs">3</span> 
            What should the bot reply to the comment?
          </h2>
          
          <div className="flex items-center gap-4 mb-5 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#0F172A]">AI Generation (Gemini)</h3>
              <p className="text-xs text-[#64748B]">Let AI generate a smart reply based on a prompt instead of a static message.</p>
            </div>
            <button
              onClick={() => setFormData({...formData, dmReply: {...formData.dmReply, useAI: !formData.dmReply.useAI}})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.dmReply.useAI ? 'bg-[#7C3AED]' : 'bg-[#CBD5E1]'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.dmReply.useAI ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {formData.dmReply.useAI ? (
             <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#0F172A]">System Prompt (AI Instructions)</label>
                <span className="text-xs text-[#7C3AED] font-medium flex items-center gap-1"><Zap className="w-3 h-3" /> Gemini 3.5 Active</span>
              </div>
              <textarea 
                rows={5}
                value={formData.dmReply.systemPrompt || ""}
                onChange={e => setFormData({...formData, dmReply: { ...formData.dmReply, systemPrompt: e.target.value }})}
                placeholder="Example: You are a helpful sales assistant. If the user asks for the price in the comment, politely tell them it is ₹500 and ask them to check their DM. Keep it short and friendly."
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#7C3AED]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
              />
              <p className="text-xs text-[#64748B] mt-2">The AI will read the user's incoming comment and use these instructions to write a custom reply.</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#0F172A]">Static Reply Message</label>
              </div>
              <textarea 
                rows={4}
                value={formData.dmReply.messages[0].text}
                onChange={e => {
                  const newMessages = [...formData.dmReply.messages];
                  newMessages[0].text = e.target.value;
                  setFormData({...formData, dmReply: { ...formData.dmReply, messages: newMessages }});
                }}
                placeholder="Thanks for reaching out! Our price is..."
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
