"use client";

export function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ig-grad" cx="20%" cy="105%" r="130%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <path
        d="M12 7.2A4.8 4.8 0 1016.8 12 4.8 4.8 0 0012 7.2zm0 7.85A3.05 3.05 0 1115.05 12 3.05 3.05 0 0112 15.05zm4.99-7.93a1.12 1.12 0 11-1.12-1.12 1.12 1.12 0 011.12 1.12zm2.96 1.14a5.1 5.1 0 00-1.4-3.66 5.1 5.1 0 00-3.66-1.4C13.45 3.05 10.55 3.05 9.11 3.2a5.1 5.1 0 00-3.66 1.4 5.1 5.1 0 00-1.4 3.66C3.9 9.7 3.9 12.6 4.05 14.04a5.1 5.1 0 001.4 3.66 5.1 5.1 0 003.66 1.4c1.44.15 4.34.15 5.78 0a5.1 5.1 0 003.66-1.4 5.1 5.1 0 001.4-3.66c.15-1.44.15-4.34 0-5.78zm-1.85 7.42a3.3 3.3 0 01-1.86 1.86c-1.15.45-3.87.35-5.24.35s-4.09.1-5.24-.35a3.3 3.3 0 01-1.86-1.86c-.45-1.15-.35-3.87-.35-5.24s-.1-4.09.35-5.24a3.3 3.3 0 011.86-1.86c1.15-.45 3.87-.35 5.24-.35s4.09-.1 5.24.35a3.3 3.3 0 011.86 1.86c.45 1.15.35 3.87.35 5.24s.1 4.09-.35 5.24z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function FacebookIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#1877F2" />
      <path
        d="M16.5 12.5h-2.5v7.5h-3.2v-7.5H9v-2.8h1.8V7.9c0-2.3 1.3-3.6 3.4-3.6 1 0 2.1.2 2.1.2v2.3h-1.2c-1.1 0-1.5.7-1.5 1.5v1.4h2.7l-.4 2.8z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function YoutubeIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#FF0000" />
      <path
        d="M19.6 8.3a2 2 0 00-1.4-1.4C16.9 6.5 12 6.5 12 6.5s-4.9 0-6.2.4a2 2 0 00-1.4 1.4C4 9.6 4 12 4 12s0 2.4.4 3.7a2 2 0 001.4 1.4c1.3.4 6.2.4 6.2.4s4.9 0 6.2-.4a2 2 0 001.4-1.4c.4-1.3.4-3.7.4-3.7s0-2.4-.4-3.7z"
        fill="#ffffff"
      />
      <path d="M10.5 14.5l4-2.5-4-2.5v5z" fill="#FF0000" />
    </svg>
  );
}

export function TwitterXIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#000000" />
      <path
        d="M16.9 5.5h2.1l-4.6 5.3 5.4 7.2h-4.3l-3.4-4.4-3.9 4.4H6.1l4.9-5.6L5.8 5.5h4.4l3.1 4.1 3.6-4.1zm-.7 11.2h1.2L8.9 6.7H7.6l8.6 10z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function ThreadsIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#000000" />
      <path
        d="M14.6 11.8c-.1-.3-.2-.5-.4-.7-.4-.6-1-1-1.8-1-1.1 0-1.9.8-1.9 2.1 0 1.2.7 2 1.7 2 .8 0 1.3-.4 1.7-.9.4.5 1 .9 1.8.9 1.4 0 2.4-1.1 2.4-2.9 0-2.3-1.6-4.1-4.2-4.1-2.7 0-4.5 1.9-4.5 4.5 0 2.6 1.7 4.5 4.3 4.5 1.3 0 2.3-.4 3-1.2l-1.1-1c-.5.5-1.2.8-2 .8-1.7 0-2.8-1.2-2.8-3.1s1-3.1 2.9-3.1c1.7 0 2.7 1.1 2.7 2.6 0 1.1-.6 1.7-1.3 1.7-.4 0-.8-.2-1-.6-.2.4-.7.7-1.3.7-.8 0-1.2-.5-1.2-1.3 0-.9.6-1.5 1.5-1.5.4 0 .8.1 1.1.3v-.1c0-.7-.4-1.1-1.1-1.1-.5 0-.9.2-1.2.5l-.8-.9c.5-.5 1.2-.8 2.1-.8 1.4 0 2.3.8 2.3 2.3v3c0 .5.1.8.3 1.1-.4.2-.9.3-1.3.3z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function TikTokIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#000000" />
      <path
        d="M16.6 8.3a4.5 4.5 0 01-2.7-.9v6a4.4 4.4 0 11-4.4-4.4c.3 0 .7 0 1 .1V11a2.6 2.6 0 102 2.5V4h2.2c.2 1.2 1 2.2 2.2 2.5v1.8h-.3z"
        fill="#ffffff"
      />
      <path
        d="M16.4 8.1a4.5 4.5 0 01-2.5-.9v6a4.4 4.4 0 01-4.4 4.4 4.4 4.4 0 01-4.4-4.4 4.4 4.4 0 014.4-4.4c.3 0 .7 0 1 .1V11a2.6 2.6 0 102 2.5V4h2.2c.2 1.2 1 2.2 2.2 2.5v1.6h-.5z"
        fill="#25F4EE"
        opacity="0.6"
      />
    </svg>
  );
}

export function LinkedInIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#0A66C2" />
      <path
        d="M7.7 9H5.3v7.7h2.4V9zM6.5 7.9c.8 0 1.4-.6 1.4-1.4 0-.8-.6-1.4-1.4-1.4-.8 0-1.4.6-1.4 1.4 0 .8.6 1.4 1.4 1.4zM18.7 12.3c0-2.1-1.1-3.1-2.7-3.1-1.3 0-1.8.7-2.1 1.2V9h-2.4c.03.7 0 7.7 0 7.7h2.4v-4.3c0-.2 0-.5.1-.6.2-.5.7-1 1.5-1 1.1 0 1.5.8 1.5 2v4h2.4v-4.5h.3z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function PinterestIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#E60023" />
      <path
        d="M12 4a8 8 0 00-2.8 15.5c-.1-.7-.1-1.8.02-2.5l1.1-4.7s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.3 0 .8-.5 2-.8 3.1-.2 1 .5 1.7 1.5 1.7 1.8 0 3-2.3 3-5 0-2.1-1.4-3.6-4-3.6-2.9 0-4.8 2.2-4.8 4.6 0 .8.3 1.6.7 2.1.08.1.09.2.06.3l-.2.9c-.04.16-.13.2-.3.12-1.2-.5-1.7-1.9-1.7-3.4 0-2.5 2.1-5.5 6.4-5.5 3.4 0 5.7 2.5 5.7 5.2 0 3.5-1.9 6.1-4.9 6.1-1 0-1.9-.5-2.2-1.1l-.6 2.3c-.2.8-.7 1.8-1.1 2.4A8 8 0 1012 4z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function PlatformIcon({ platform, className = "w-5 h-5" }) {
  const p = (platform || "").toLowerCase();
  if (p === "instagram") return <InstagramIcon className={className} />;
  if (p === "facebook") return <FacebookIcon className={className} />;
  if (p === "youtube") return <YoutubeIcon className={className} />;
  if (p === "twitter" || p === "x") return <TwitterXIcon className={className} />;
  if (p === "threads") return <ThreadsIcon className={className} />;
  if (p === "tiktok") return <TikTokIcon className={className} />;
  if (p === "linkedin") return <LinkedInIcon className={className} />;
  if (p === "pinterest") return <PinterestIcon className={className} />;
  return <div className={`${className} rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px]`}>{(platform || "S")[0].toUpperCase()}</div>;
}
