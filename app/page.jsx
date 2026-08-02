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
  const [selected, setSelected] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch("/api/accounts")
      .then((r) => r.json())
      .then((d) => setAccounts(d.accounts || []));
  }, []);

  function toggleSelect(id) {
    if (!accounts.some(a => a.platform === id)) {
      window.location.href = `/api/auth/connect/${id}`;
      return;
    }
    setSelected((s) => (s.includes(id) ? s.filter((p) => p !== id) : [...s, id]));
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
    if (!file || selected.length === 0) return;
    setPosting(true);
    setResults(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      form.append("description", description);
      form.append("platforms", JSON.stringify(selected));
      const res = await fetch("/api/post", { method: "POST", body: form });
      const data = await res.json();
      setResults(data.results);
    } finally {
      setPosting(false);
    }
  }

  return (
    <main className="wrap">
      <div className="eyebrow"><span className="dot" /> Broadcast Console</div>
      <h1>One video. Every channel.</h1>
      <p className="subhead">
        Connect your social accounts once, drop in a video or image, and publish
        to all of them in a single pass — no more re-uploading the same clip six times.
      </p>

      <p className="section-label">01 — Select channels</p>
      <div className="channel-grid">
        {PLATFORMS.map((p) => {
          const acc = accounts.find(a => a.platform === p.id);
          const isConnected = !!acc;
          const isSelected = selected.includes(p.id);
          return (
            <div
              key={p.id}
              className={`channel-card ${isSelected ? "selected" : ""} ${!isConnected ? "disconnected" : ""}`}
              onClick={() => toggleSelect(p.id)}
            >
              <div className="channel-name">{p.label}</div>
              <div className={`channel-status ${isConnected ? "connected" : "off"}`}>
                {isConnected ? `● connected${acc?.name ? ` as ${acc.name}` : ""}` : "○ offline"}
              </div>
              {!isConnected && <button className="connect-btn">Connect</button>}
            </div>
          );
        })}
      </div>

      <p className="section-label">02 — Add your media</p>
      <div className="panel">
        <div
          className={`dropzone ${file ? "has-file" : ""}`}
          onClick={() => fileInputRef.current?.click()}
        >
          {file ? `Selected: ${file.name}` : "Click to choose a video or image file"}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*"
          hidden
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <label className="field-label">Generate with Gemini (optional)</label>
        <div className="gen-row">
          <input
            type="text"
            placeholder="Describe your video in a few words…"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button className="btn btn-ghost" onClick={handleGenerate} disabled={generating || !topic}>
            {generating ? "Writing…" : "Generate"}
          </button>
        </div>

        <label className="field-label">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />

        <label className="field-label">Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Post description / caption"
        />

        <button
          className="btn btn-primary"
          onClick={handlePost}
          disabled={posting || !file || selected.length === 0}
        >
          {posting ? "Publishing…" : `Publish to ${selected.length || 0} channel${selected.length === 1 ? "" : "s"}`}
        </button>

        {results && (
          <div className="results">
            {Object.entries(results).map(([platform, r]) => (
              <div className="result-row" key={platform}>
                <span>{platform}</span>
                <span className={r.success ? "result-ok" : "result-fail"}>
                  {r.success ? "✓ published" : `✕ ${r.error}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="footer-note">
        Connect a channel above with the "Connect" button — you'll need API credentials
        for each platform set in your .env file first.
      </p>
    </main>
  );
}
