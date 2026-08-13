"use client";

import { Share2, Link2, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <span style={{ display: "flex", alignItems: "center", gap: "0.375rem",
                     fontSize: "0.75rem", color: "var(--color-neutral-500)", fontWeight: 500 }}>
        <Share2 style={{ width: "0.875rem", height: "0.875rem" }} />
        Share
      </span>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        style={socialBtnStyle}
        className="hover:bg-neutral-900 hover:text-white"
      >
        <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>𝕏</span>
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        style={socialBtnStyle}
        className="hover:bg-blue-700 hover:text-white"
      >
        <ExternalLink style={{ width: "0.875rem", height: "0.875rem" }} />
      </a>

      {/* Copy link */}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        style={{
          ...socialBtnStyle,
          backgroundColor: copied ? "var(--color-success-100)" : "var(--color-neutral-100)",
          color: copied ? "var(--color-success-700)" : "var(--color-neutral-600)",
          border: "none",
          cursor: "pointer",
        }}
      >
        {copied ? (
          <Check style={{ width: "0.875rem", height: "0.875rem" }} />
        ) : (
          <Link2 style={{ width: "0.875rem", height: "0.875rem" }} />
        )}
      </button>
    </div>
  );
}

const socialBtnStyle: React.CSSProperties = {
  width: "2rem",
  height: "2rem",
  borderRadius: "0.5rem",
  backgroundColor: "var(--color-neutral-100)",
  color: "var(--color-neutral-600)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  transition: "all 0.2s",
};
