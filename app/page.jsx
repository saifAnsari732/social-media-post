"use client";

import { useEffect, useRef, useState } from "react";

const PLATFORMS = [
  { id: "youtube",   label: "YouTube",      icon: "▶" },
  { id: "facebook",  label: "Facebook",     icon: "f" },
  { id: "instagram", label: "Instagram",    icon: "◈" },
  { id: "twitter",   label: "X / Twitter",  icon: "𝕏" },
  { id: "linkedin",  label: "LinkedIn",     icon: "in" },
  { id: "tiktok",    label: "TikTok",       icon: "♪" },
];

const PLATFORM_COLORS = {
  youtube:   { bg: "linear-gradient(135deg,#fee2e2,#fecaca)", color: "#dc2626",  shadow: "rgba(220,38,38,.3)" },
  facebook:  { bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1d4ed8",  shadow: "rgba(29,78,216,.3)" },
  instagram: { bg: "linear-gradient(135deg,#fae8ff,#f3e8ff)", color: "#9333ea",  shadow: "rgba(147,51,234,.3)" },
  twitter:   { bg: "linear-gradient(135deg,#e0f2fe,#bae6fd)", color: "#0369a1",  shadow: "rgba(3,105,161,.3)" },
  linkedin:  { bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1e40af",  shadow: "rgba(30,64,175,.3)" },
  tiktok:    { bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)", color: "#065f46",  shadow: "rgba(6,95,70,.3)" },
};

export default function DashboardPage() {
  const [accounts, setAccounts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    const res = await fetch("/api/accounts");
    const data = await res.json();
    setAccounts(data.accounts || []);
  }

  function toggleSelect(id) {
    setSelectedIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function handleConnect(platformId) {
    window.location.href = `/api/auth/connect/${platformId}`;
  }

  async function handleGenerate() {
    if (!topic) {
      alert("Please enter a topic or description for the AI first!");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.hashtags) {
        const cleanedTags = data.hashtags.map(t => t.replace(/^#/, '')).join(", ");
        setTags(cleanedTags);
      }
    } catch(err) {
      console.error(err);
      alert("Failed to generate content.");
    } finally {
      setGenerating(false);
    }
  }

  async function handlePost() {
    if (!file || selectedIds.length === 0) return;
    setPosting(true);
    setResults(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      form.append("description", description);
      form.append("tags", tags);
      form.append("accountIds", JSON.stringify(selectedIds));
      const res = await fetch("/api/post", { method: "POST", body: form });
      const data = await res.json();
      setResults(data.results);
    } finally {
      setPosting(false);
    }
  }

  async function handleDeleteAccount(id) {
    if (!confirm("Are you sure you want to remove this account?")) return;
    try {
      const res = await fetch("/api/accounts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchAccounts();
        setSelectedIds((s) => s.filter((x) => x !== id));
      }
    } catch (e) {
      console.error("Failed to delete account", e);
    }
  }

  return (
    <main className="wrap">
      <header>
        <div className="eyebrow"><span className="dot" /> yt-post Console</div>
        <h1>One video. Every channel.</h1>
        <p className="subhead">
          <strong>yt-post</strong> helps creators publish content across multiple platforms simultaneously.
          Connect your accounts, upload once, and let us handle the rest.
          <br />
          <span style={{ display: 'inline-flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {['🎬 YouTube', '📘 Facebook', '📸 Instagram', '🐦 Twitter', '💼 LinkedIn', '🎵 TikTok'].map(p => (
              <span key={p} style={{ background: '#fff', border: '1.5px solid #e8e4f3', borderRadius: 999, padding: '3px 12px', fontSize: 12, fontWeight: 600, color: '#4a4568', boxShadow: '0 2px 8px rgba(124,58,237,.06)' }}>{p}</span>
            ))}
          </span>
        </p>
      </header>

      <div className="layout-grid">
        {/* ── Left: Accounts ── */}
        <aside>
          <div className="panel">
            <h2 className="section-label">Connected Accounts</h2>

            {accounts.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔗</div>
                No accounts connected yet.<br />
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Add an account below to get started.</span>
              </div>
            ) : (
              <div className="accounts-list">
                {accounts.map((acc, index) => {
                  const isSelected = selectedIds.includes(acc._id);
                  const colors = PLATFORM_COLORS[acc.platform] || { bg: "#f1f5f9", color: "#475569" };
                  return (
                    <div
                      key={acc._id || index}
                      className={`account-card ${isSelected ? "selected" : ""}`}
                      onClick={() => toggleSelect(acc._id)}
                    >
                      <div className="account-info">
                        <div className="checkbox" />
                        <div
                          className="platform-icon"
                          style={{ background: colors.bg, color: colors.color, boxShadow: `0 4px 12px ${colors.shadow}` }}
                        >
                          {PLATFORMS.find(p => p.id === acc.platform)?.icon || "●"}
                        </div>
                        <div>
                          <div className="account-name">{acc.name || "Unnamed Account"}</div>
                          <div className="account-platform">{acc.platform}</div>
                        </div>
                      </div>
                      <button
                        className="btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAccount(acc._id);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <h2 className="section-label">Add Account</h2>
            <div className="add-account-section">
              {PLATFORMS.map(p => (
                <div key={p.id} className="btn-connect" onClick={() => handleConnect(p.id)}>
                  <span style={{ fontSize: 13 }}>{p.icon}</span> {p.label}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Right: Post Editor ── */}
        <section>
          <div className="panel">
            <h2 className="section-label">Create Post</h2>

            {/* Dropzone */}
            <div
              className={`dropzone ${file ? "has-file" : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropzone-icon">{file ? "✅" : "☁️"}</div>
              <div className="dropzone-text">
                {file ? file.name : "Click to upload a video or image"}
              </div>
              {!file && <div className="dropzone-subtext">MP4, MOV, JPG, PNG supported</div>}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {/* AI Generate */}
            <div className="ai-generate">
              <input
                type="text"
                placeholder="Describe your post for AI content generation..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <button className="btn btn-secondary" onClick={handleGenerate} disabled={generating || !topic}>
                {generating ? "⏳ Generating..." : "✨ Generate AI"}
              </button>
            </div>

            {/* Fields */}
            <div className="field-group">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your post title..." />
            </div>

            <div className="field-group">
              <label>Description / Caption</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a caption or description..."
              />
            </div>

            <div className="field-group">
              <label>Tags (Optional)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="gaming, tutorial, funny (comma separated)"
              />
            </div>

            {/* Publish Button */}
            <button
              className="btn btn-primary"
              onClick={handlePost}
              disabled={posting || !file || selectedIds.length === 0}
            >
              {posting
                ? "⏳ Publishing..."
                : selectedIds.length === 0
                ? "Select accounts to publish"
                : `🚀 Publish to ${selectedIds.length} Account${selectedIds.length === 1 ? "" : "s"}`}
            </button>

            {/* Results */}
            {results && (
              <div className="results">
                {Object.entries(results).map(([accountId, r]) => {
                  const acc = accounts.find(a => a._id === accountId) || {};
                  return (
                    <div className="result-row" key={accountId}>
                      <span>
                        {acc.name || accountId}
                        <span style={{ color: "#94a3b8", fontWeight: 400, marginLeft: 6, fontSize: 12 }}>
                          ({acc.platform})
                        </span>
                      </span>
                      <span className={`status-badge ${r.success ? "status-ok" : "status-fail"}`}>
                        {r.success ? "✓ Published" : "✕ Failed"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
