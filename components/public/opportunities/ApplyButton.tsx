"use client";

import { ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ApplyButtonProps {
  url: string;
  isExpired?: boolean;
  className?: string;
}

export default function ApplyButton({
  url,
  isExpired = false,
  className,
}: ApplyButtonProps) {
  if (isExpired) {
    return (
      <Button
        variant="secondary"
        size="lg"
        disabled
        className={`w-full sm:w-auto ${className ?? ""}`}
      >
        <Lock className="w-4 h-4" />
        <span>Application Closed (Expired)</span>
      </Button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-primary btn-lg no-underline w-full sm:w-auto ${className ?? ""}`}
    >
      <span>Apply Now</span>
      <ExternalLink className="w-4 h-4" />
    </a>
  );
}
