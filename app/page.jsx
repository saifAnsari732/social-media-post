"use client";

import { useEffect, useRef, useState } from "react";

const PLATFORMS = [
  { id: "youtube", label: "YouTube" },
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "twitter", label: "X / Twitter" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "tiktok", label: "TikTok" }
];

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
    if (!topic) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.description) {
        const hashtags = data.hashtags?.length ? "\n\n" + data.hashtags.join(" ") : "";
        setDescription(data.description + hashtags);
      }
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

  return (
    <main className="wrap">
      <header>
        <div className="eyebrow"><span className="dot" /> yt-post Console</div>
        <h1>yt-post: One video. Every channel.</h1>
        <p className="subhead">
          <strong>Purpose of this application:</strong> yt-post is a tool designed to help creators publish their videos across multiple platforms simultaneously. By connecting your social accounts, you can upload a single media file and our app will securely post it to your connected YouTube channels and other social profiles on your behalf.
        </p>
      </header>

      <div className="layout-grid">
        {/* Left Column: Channels */}
        <aside>
          <div className="panel">
            <h2 className="section-label">01 — Connected Accounts</h2>
            
            {accounts.length === 0 ? (
              <div className="empty-state">No accounts connected yet.</div>
            ) : (
              <div className="accounts-list">
                {accounts.map((acc, index) => {
                  const isSelected = selectedIds.includes(acc._id);
                  return (
                    <div
                      key={acc._id || index}
                      className={`account-card ${isSelected ? "selected" : ""}`}
                      onClick={() => toggleSelect(acc._id)}
                    >
                      <div className="account-info">
                        <div className="checkbox" />
                        <div>
                          <div className="account-name">{acc.name || "Unnamed Account"}</div>
                          <div className="account-platform">{acc.platform}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <h2 className="section-label">Add Account</h2>
            <div className="add-account-section">
              {PLATFORMS.map(p => (
                <div key={p.id} className="btn-connect" onClick={() => handleConnect(p.id)}>
                  + {p.label}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Column: Editor */}
        <section>
          <div className="panel">
            <h2 className="section-label">02 — Create Post</h2>
            
            <div
              className={`dropzone ${file ? "has-file" : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropzone-icon">{file ? "✅" : "📁"}</div>
              <div className="dropzone-text">
                {file ? file.name : "Click to choose a video or image"}
              </div>
              {!file && <div className="dropzone-subtext">MP4, MOV, JPG, PNG</div>}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <div className="ai-generate">
              <input
                type="text"
                placeholder="Describe your video for AI generation..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button className="btn btn-secondary" onClick={handleGenerate} disabled={generating || !topic}>
                {generating ? "..." : "Generate AI"}
              </button>
            </div>

            <div className="field-group">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
            </div>

            <div className="field-group">
              <label>Description</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Post description / caption"
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

            <button
              className="btn btn-primary"
              onClick={handlePost}
              disabled={posting || !file || selectedIds.length === 0}
            >
              {posting ? "Publishing..." : `Publish to ${selectedIds.length || 0} Account${selectedIds.length === 1 ? "" : "s"}`}
            </button>

            {results && (
              <div className="results">
                {Object.entries(results).map(([accountId, r]) => {
                  const acc = accounts.find(a => a._id === accountId) || {};
                  return (
                    <div className="result-row" key={accountId}>
                      <span>{acc.name || accountId} ({acc.platform})</span>
                      <span className={`status-badge ${r.success ? "status-ok" : "status-fail"}`}>
                        {r.success ? "Published" : "Failed"}
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
