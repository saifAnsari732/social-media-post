"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlatformIcon } from "@/components/ui/SocialIcons";
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  User, 
  Mail, 
  Layers, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound,
  RotateCcw
} from "lucide-react";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  
  // Normal Login/Signup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Forgot Password fields
  const [resetEmail, setResetEmail] = useState("");
  const [resetVerifying, setResetVerifying] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetUpdating, setResetUpdating] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("yt_user") || localStorage.getItem("socialflow_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u && u.userId) {
          router.replace("/dashboard");
        }
      } catch (e) {}
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const em = email.trim().toLowerCase();
    const p = password.trim();
    const n = name.trim();

    if (isSignUp && !n) {
      setError("Please enter your full name.");
      return;
    }

    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!p || p.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
      const payload = isSignUp ? { name: n, email: em, password: p } : { name: n, email: em, password: p };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed. Please check your details.");
      }

      setSuccessMsg(isSignUp ? "Account created successfully! Redirecting..." : "Login successful! Accessing workspace...");

      // Save user session in localStorage
      const userData = data.user;
      localStorage.setItem("yt_user", JSON.stringify(userData));
      localStorage.setItem("socialflow_user", JSON.stringify(userData));

      setTimeout(() => {
        router.push("/dashboard");
      }, 600);

    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleDemoAdminLogin() {
    setName("Saifuddin Ansari");
    setEmail("ansarisaifuddin732@gmail.com");
    setPassword("admin123");
    setIsSignUp(false);
    setIsForgot(false);
  }

  // Handle Verify Email in DB (Step 1 of Password Reset)
  async function handleVerifyEmail(e) {
    if (e) e.preventDefault();
    setResetError("");
    setResetSuccess("");
    setVerifiedUser(null);

    const em = resetEmail.trim().toLowerCase();
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setResetError("Please enter a valid email address to verify.");
      return;
    }

    setResetVerifying(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_email", email: em })
      });

      const data = await res.json();

      if (!res.ok || !data.exists) {
        throw new Error(data.error || "No account found with this email in our database. Password reset is not permitted.");
      }

      setVerifiedUser(data.user);
      setResetSuccess(`Account verified for ${data.user.name || em}. You can now create your new password.`);
    } catch (err) {
      setResetError(err.message || "Verification failed. User does not exist in database.");
    } finally {
      setResetVerifying(false);
    }
  }

  // Handle Update Password in DB (Step 2 of Password Reset)
  async function handleResetPasswordSubmit(e) {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!verifiedUser) {
      setResetError("Please verify your email address first.");
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setResetError("Password must be at least 4 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match. Please verify both fields.");
      return;
    }

    setResetUpdating(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_password",
          email: resetEmail.trim().toLowerCase(),
          newPassword
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password. Please try again.");
      }

      setResetSuccess("Password successfully updated! Redirecting to Sign In...");
      setEmail(resetEmail);
      setPassword("");

      setTimeout(() => {
        setIsForgot(false);
        setVerifiedUser(null);
        setNewPassword("");
        setConfirmPassword("");
        setResetSuccess("");
        setSuccessMsg("Password reset successfully! Please sign in with your new password.");
      }, 1600);

    } catch (err) {
      setResetError(err.message || "An unexpected error occurred during password update.");
    } finally {
      setResetUpdating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 lg:p-8 font-sans relative overflow-hidden">
      
      {/* Top Navigation Bar */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between z-10 py-2">
        <Link 
          href="/landing" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:border-slate-300 font-bold text-xs shadow-2xs transition-all no-underline"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" /> Back to Home
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-500">Live Production Authentication</span>
        </div>
      </div>

      {/* Main Auth Card Container */}
      <div className="w-full max-w-5xl mx-auto my-auto bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10">
        
        {/* Left Branding Section */}
        <div className="lg:col-span-6 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="bg-white/95 rounded-2xl p-2 px-3 shadow-md shadow-indigo-950/40">
                <img src="/postflyLOGO.png" alt="Postfly" className="h-10 sm:h-11 w-auto max-w-[180px] object-contain" />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-snug mb-3">
              {isForgot 
                ? "Secure Account & Password Recovery"
                : isSignUp 
                  ? "Start Your 5-Day Free Trial Today" 
                  : "Manage All Social Channels in One Hub"}
            </h1>
            <p className="text-indigo-200 text-xs leading-relaxed mb-8 font-normal">
              {isForgot
                ? "Verify your registered email against MongoDB Atlas to directly set a new encrypted password."
                : "Publish content, schedule posts across 7 major networks, and automate audience replies with real database state."}
            </p>

            {/* Supported Channels */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs mb-8 space-y-3">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Supported Channels:</span>
              <div className="flex flex-wrap items-center gap-2">
                {["Instagram", "Facebook", "LinkedIn", "YouTube", "Twitter", "Threads", "Pinterest"].map((plat) => (
                  <span key={plat} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    <PlatformIcon platform={plat} className="w-4 h-4" />
                  </span>
                ))}
              </div>
            </div>

            {/* Feature Checkmarks */}
            <div className="space-y-3">
              {[
                "Instant Multi-Channel Social Publishing",
                "Automated DM & Comment Response Rules",
                "Official Meta Graph & YouTube API OAuth Security"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-indigo-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-300 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Enterprise SSL Database Security
            </span>
            <span>v2.5 Live</span>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full space-y-6">
            
            {/* Conditional Rendering: Forgot Password vs Sign In / Sign Up */}
            {isForgot ? (
              <div className="space-y-5">
                {/* Back button */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgot(false);
                      setVerifiedUser(null);
                      setResetError("");
                      setResetSuccess("");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                  </button>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase tracking-wider border border-indigo-100">
                    Direct Recovery
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                    Reset Password 🔑
                  </h2>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    Enter your registered email address. If it matches an account in our database, you can immediately create a new password.
                  </p>
                </div>

                {/* Step 1: Email verification */}
                <form onSubmit={handleVerifyEmail} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                      Registered Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          placeholder="you@company.com"
                          value={resetEmail}
                          onChange={(e) => {
                            setResetEmail(e.target.value);
                            setVerifiedUser(null);
                            setResetError("");
                            setResetSuccess("");
                          }}
                          disabled={resetVerifying || verifiedUser !== null}
                          className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all disabled:opacity-75 disabled:bg-slate-100"
                          required
                        />
                      </div>
                      {!verifiedUser && (
                        <button
                          type="submit"
                          disabled={resetVerifying || !resetEmail}
                          className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer shrink-0 flex items-center gap-1.5"
                        >
                          {resetVerifying ? (
                            <>
                              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                              <span>Checking...</span>
                            </>
                          ) : (
                            <span>Verify Email</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </form>

                {/* Verified user card */}
                {verifiedUser && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-emerald-950">
                          Account Verified: {verifiedUser.name}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium">
                          Found in database ({verifiedUser.email})
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVerifiedUser(null);
                        setNewPassword("");
                        setConfirmPassword("");
                        setResetError("");
                        setResetSuccess("");
                      }}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Error message */}
                {resetError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 leading-snug flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{resetError}</span>
                  </div>
                )}

                {/* Success message */}
                {resetSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 leading-snug flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{resetSuccess}</span>
                  </div>
                )}

                {/* Step 2: New Password input - ONLY shown if email was verified in DB */}
                {verifiedUser && (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                        Create New Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password (min. 4 chars)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                        Confirm New Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Re-enter your new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={resetUpdating}
                      className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer disabled:opacity-60"
                    >
                      {resetUpdating ? (
                        <span>Updating Password in Database...</span>
                      ) : (
                        <>
                          <span>Save & Update Password</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
                {/* Tab Switcher: Sign In vs Create Account */}
                <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setError(""); setSuccessMsg(""); }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      !isSignUp 
                        ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80" 
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(true); setError(""); setSuccessMsg(""); }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isSignUp 
                        ? "bg-indigo-600 text-white shadow-sm" 
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                    {isSignUp ? "Create Your Account" : "Welcome Back"}
                  </h2>
                  <p className="text-xs text-slate-500 font-normal">
                    {isSignUp 
                      ? "Enter your name, email & password to register your new workspace."
                      : "Enter your registered email and password to access your workspace."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Full Name field (Only in Sign Up mode) */}
                  {isSignUp && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          placeholder="e.g. Saifuddin Ansari"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 tracking-wider">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Password + Forgot Password link */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgot(true);
                            setResetEmail(email || "");
                            setError("");
                            setSuccessMsg("");
                            setVerifiedUser(null);
                            setResetError("");
                            setResetSuccess("");
                          }}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 leading-snug">
                      {error}
                    </div>
                  )}

                  {/* Success Alert */}
                  {successMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 leading-snug flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <span>{isSignUp ? "Creating Account..." : "Signing In..."}</span>
                    ) : (
                      <>
                        <span>{isSignUp ? "Create Free Account" : "Sign In to Dashboard"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>

                {/* Demo Helper Button */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleDemoAdminLogin}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 hover:bg-indigo-100 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" /> Fill Super Admin Demo Credentials
                  </button>
                  <p className="text-[11px] text-center text-slate-400 font-normal">
                    🔒 Protected by SHA-256 password hashing & MongoDB persistence.
                  </p>
                </div>
              </>
            )}

          </div>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-slate-400 font-medium py-2">
        © 2026 SocialFlow Inc. All rights reserved.
      </div>
    </div>
  );
}
