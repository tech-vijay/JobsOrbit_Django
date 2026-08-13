import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

interface LogoProps {
  href?: string;
  className?: string;
  imgClassName?: string;
  textClassName?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({
  href = "/",
  className = "",
  imgClassName = "",
  showText = false,
  size = "md",
}: LogoProps) {
  const dimensions = {
    sm: { height: 38, width: 140 },
    md: { height: 46, width: 140 },
    lg: { height: 58, width: 180 },
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt={siteConfig.name}
        width={dimensions.width}
        height={dimensions.height}
        style={{ height: `${dimensions.height}px`, width: "auto", maxHeight: `${dimensions.height}px` }}
        className={`object-contain ${imgClassName}`}
        priority
        unoptimized
      />
      {showText && (
        <span className="font-display font-bold text-xl tracking-tight text-neutral-900">
          {siteConfig.name}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline flex items-center shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
