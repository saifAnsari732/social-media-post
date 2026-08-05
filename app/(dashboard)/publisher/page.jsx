"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* ── Platform Config ── */
const PLATFORMS = [
  { id: "youtube",   label: "YouTube",    icon: YouTubeIcon  },
  { id: "facebook",  label: "Facebook",   icon: FacebookIcon },
  { id: "instagram", label: "Instagram",  icon: InstagramIcon},
  { id: "twitter",   label: "X / Twitter",icon: TwitterIcon  },
  { id: "linkedin",  label: "LinkedIn",   icon: LinkedInIcon },
  { id: "tiktok",    label: "TikTok",     icon: TikTokIcon   },
];

const PLATFORM_STYLES = {
  youtube:   { bg: "#fef2f2", color: "#dc2626" },
  facebook:  { bg: "#eff6ff", color: "#2563eb" },
  instagram: { bg: "#fdf4ff", color: "#9333ea" },
  twitter:   { bg: "#f0f9ff", color: "#0284c7" },
  linkedin:  { bg: "#eff6ff", color: "#1d4ed8" },
  tiktok:    { bg: "#f0fdf4", color: "#166534" },
};

/* ── SVG Icons ── */
function YouTubeIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
    </svg>
  );
}

function FacebookIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function InstagramIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function TwitterIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function LinkedInIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function TikTokIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.11a8.16 8.16 0 0 0 4.77 1.52V7.17a4.85 4.85 0 0 1-1-.48z"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

/* ── Dashboard ── */
export default function DashboardPage() {
  const [user, setUser] = useState(null);
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
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("yt_user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    fetchAccounts(parsed.userId);
  }, []);

  async function fetchAccounts(userId) {
    const res = await fetch("/api/accounts", {
      headers: { "x-user-id": userId }
    });
    const data = await res.json();
    setAccounts(data.accounts || []);
  }

  function toggleSelect(id) {
    setSelectedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  function handleConnect(platformId) {
    if (!user) return;
    window.location.href = `/api/auth/connect/${platformId}?userId=${encodeURIComponent(user.userId)}`;
  }

  function handleLogout() {
    localStorage.removeItem("yt_user");
    router.push("/login");
  }

  async function handleGenerate() {
    if (!topic) { alert("Please enter a topic first!"); return; }
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
      if (data.hashtags) setTags(data.hashtags.map(t => t.replace(/^#/, '')).join(", "));
    } catch (err) {
      alert("Failed to generate content.");
    } finally {
      setGenerating(false);
    }
  }

  async function handlePost() {
    if (!file || selectedIds.length === 0 || !user) return;
    setPosting(true);
    setResults(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      form.append("description", description);
      form.append("tags", tags);
      form.append("accountIds", JSON.stringify(selectedIds));
      const res = await fetch("/api/post", {
        method: "POST",
        body: form,
        headers: { "x-user-id": user.userId }
      });
      const data = await res.json();
      setResults(data.results);
    } finally {
      setPosting(false);
    }
  }

  async function handleDeleteAccount(id) {
    if (!confirm("Remove this account?")) return;
    try {
      const res = await fetch("/api/accounts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-user-id": user?.userId || "" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        fetchAccounts(user.userId);
        setSelectedIds(s => s.filter(x => x !== id));
      }
    } catch (e) {
      console.error("Failed to delete account", e);
    }
  }

  // Show nothing while checking session
  if (!user) return null;

  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>

      <main className="wrap">
        <div className="page-header">
          <h1>Social Media Publisher</h1>
          <p>Connect your accounts and publish content to multiple platforms at once. Each account is private to your profile.</p>
        </div>

        <div className="layout-grid">
          {/* ── Left: Accounts ── */}
          <aside>
            <div className="panel">
              {/* Dark header */}
              <div className="panel-left-header">
                <h2 className="section-label">Connected Accounts</h2>
              </div>

              <div className="panel-left-body">
                {accounts.length === 0 ? (
                  <div className="empty-state">
                    <div style={{ fontSize: 32, marginBottom: 10 }}>🔗</div>
                    <strong>No accounts connected</strong>
                    <span>Add a platform below to get started</span>
                  </div>
                ) : (
                  <div className="accounts-list">
                    {accounts.map((acc, idx) => {
                      const isSelected = selectedIds.includes(acc._id);
                      const style = PLATFORM_STYLES[acc.platform] || { bg: "#f3f4f6", color: "#374151" };
                      const platform = PLATFORMS.find(p => p.id === acc.platform);
                      const IconComp = platform?.icon;
                      return (
                        <div
                          key={acc._id || idx}
                          className={`account-card ${isSelected ? "selected" : ""}`}
                          onClick={() => toggleSelect(acc._id)}
                        >
                          <div className="account-info">
                            <div className="checkbox" />
                            <div className="platform-icon" style={{ background: style.bg }}>
                              {IconComp ? <IconComp size={16} color={style.color} /> : <span style={{ color: style.color, fontWeight: 700 }}>●</span>}
                            </div>
                            <div>
                              <div className="account-name">{acc.name || "Unnamed"}</div>
                              <div className="account-platform">{acc.platform}</div>
                            </div>
                          </div>
                          <button className="btn-delete" onClick={e => { e.stopPropagation(); handleDeleteAccount(acc._id); }} title="Remove">
                            <TrashIcon />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <h2 className="section-label" style={{ marginTop: 4 }}>Add Platform</h2>
                <div className="add-account-section">
                  {PLATFORMS.map(p => {
                    const IconComp = p.icon;
                    const style = PLATFORM_STYLES[p.id];
                    return (
                      <div key={p.id} className="btn-connect" onClick={() => handleConnect(p.id)}>
                        <IconComp size={13} color={style.color} />
                        {p.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Right: Post Editor ── */}
          <section>
            <div className="panel panel-right">
              <h2 className="section-label">Create Post</h2>

              {/* Dropzone */}
              <div
                className={`dropzone ${file ? "has-file" : ""}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="dropzone-icon">
                  {file ? (
                    <span style={{ fontSize: 40 }}>✅</span>
                  ) : (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16"/>
                      <line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                  )}
                </div>
                <div className="dropzone-text">
                  {file ? file.name : "Click or drag to upload media"}
                </div>
                {!file && <div className="dropzone-subtext">MP4, MOV, JPG, PNG · Max 500 MB</div>}
              </div>
              <input ref={fileInputRef} type="file" accept="video/*,image/*" hidden onChange={e => setFile(e.target.files?.[0] || null)} />

              {/* AI Generate */}
              <div className="ai-generate">
                <input
                  type="text"
                  placeholder="🤖  Describe your content for AI title, caption & tags..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleGenerate()}
                />
                <button className="btn btn-secondary" onClick={handleGenerate} disabled={generating || !topic}>
                  {generating ? "⏳ Generating..." : "✨ Generate"}
                </button>
              </div>

              {/* Fields */}
              <div className="field-group">
                <label>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Title
                </label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter your post title..." />
              </div>

              <div className="field-group">
                <label>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Description / Caption
                </label>
                <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Write a caption or description for your post..." />
              </div>

              <div className="field-group">
                <label>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  Tags <span style={{ fontWeight: 400, textTransform: 'none', fontSize: 11, color: '#94a3b8', letterSpacing: 0 }}>(comma separated)</span>
                </label>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. gaming, tutorial, funny, trending" />
              </div>

              {/* Publish CTA */}
              <div className="publish-box">
                {selectedIds.length > 0 && (
                  <div className="publish-meta">
                    <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 600 }}>Publishing to:</span>
                    {selectedIds.map(id => {
                      const acc = accounts.find(a => a._id === id);
                      const style = PLATFORM_STYLES[acc?.platform] || { bg: '#f3f4f6', color: '#374151' };
                      return acc ? (
                        <span key={id} className="publish-tag" style={{ background: style.bg, color: style.color, border: `1px solid ${style.color}22` }}>
                          {acc.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  onClick={handlePost}
                  disabled={posting || !file || selectedIds.length === 0}
                  style={{ margin: 0 }}
                >
                  {posting
                    ? "⏳ Publishing..."
                    : selectedIds.length === 0
                    ? "← Select accounts from the left panel"
                    : `🚀 Publish to ${selectedIds.length} Account${selectedIds.length === 1 ? "" : "s"}`}
                </button>
              </div>

              {/* Results */}
              {results && (
                <div className="results">
                  {Object.entries(results).map(([accountId, r]) => {
                    const acc = accounts.find(a => a._id === accountId) || {};
                    return (
                      <div className="result-row" key={accountId}>
                        <span>
                          <strong>{acc.name || accountId}</strong>
                          <span style={{ color: "#94a3b8", fontWeight: 400, marginLeft: 6, fontSize: 12 }}>({acc.platform})</span>
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
    </>
  );
}
