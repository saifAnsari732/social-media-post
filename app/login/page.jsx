"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function generateUserId(email) {
    const data = new TextEncoder().encode(email.toLowerCase().trim());
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
  }

  async function handleLogin(e) {
    e.preventDefault();
    const n = name.trim(), em = email.trim().toLowerCase();
    if (!n || !em) { setError("Please fill in both fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setError("Please enter a valid email."); return; }
    setLoading(true); setError("");
    try {
      const userId = await generateUserId(em);
      localStorage.setItem("yt_user", JSON.stringify({ userId, name: n, email: em }));
      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* ── Left Hero ── */}
      <div className="login-hero">
        <div className="login-hero-content">
          <div className="login-hero-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Publish everywhere, instantly.</h2>
          <p>Connect your social accounts once and post to all platforms simultaneously — YouTube, Instagram, Facebook, LinkedIn, TikTok and more.</p>
          <div className="login-hero-features">
            {[
              { icon: "🚀", text: "One-click multi-platform publishing" },
              { icon: "🤖", text: "AI-generated titles, captions & hashtags" },
              { icon: "🔐", text: "Private per-user account management" },
              { icon: "📊", text: "Real-time publish status tracking" },
            ].map(f => (
              <div key={f.text} className="login-hero-feature">
                <div className="login-hero-feature-dot">{f.icon}</div>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Form ── */}
      <div className="login-form-side">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="login-logo-text">yt-post</span>
          </div>

          <div className="login-header">
            <h1>Welcome back 👋</h1>
            <p>Enter your name and email to access your dashboard. No password needed.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label htmlFor="name">Full Name</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input id="name" type="text" placeholder="e.g. Saif Ansari" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="email">Email Address</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              </div>
            </div>

            {error && (
              <div className="login-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="login-spinner" /> : (
                <>
                  Continue to Dashboard
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="login-note">
            🔒 Your session is stored locally on this device only. No data is shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
