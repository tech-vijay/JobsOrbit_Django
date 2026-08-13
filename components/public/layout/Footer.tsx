import Link from "next/link";
import { Globe, Send, ExternalLink } from "lucide-react";
import { siteConfig } from "@/config/site";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-auto">
      {/* Main footer */}
      <div className="container-main" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 bg-white/90 backdrop-blur rounded-xl p-2.5 inline-block border border-white/10">
              <Logo size="md" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs mb-5"
               style={{ color: "var(--color-neutral-400)" }}>
              Daily updated jobs and internship opportunities for students and freshers across India.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <SocialLink href={siteConfig.social.twitter} label="Twitter / X">
                <span className="text-xs font-bold">𝕏</span>
              </SocialLink>
              <SocialLink href={siteConfig.social.linkedin} label="LinkedIn">
                <ExternalLink className="w-3.5 h-3.5" />
              </SocialLink>
              <SocialLink href={siteConfig.social.instagram} label="Instagram">
                <Globe className="w-3.5 h-3.5" />
              </SocialLink>
              <SocialLink href={siteConfig.social.telegram} label="Telegram">
                <Send className="w-3.5 h-3.5" />
              </SocialLink>
            </div>
          </div>

          {/* Resources */}
          <FooterLinkGroup title="Opportunities" links={siteConfig.footerLinks.resources} />

          {/* Company */}
          <FooterLinkGroup title="Company" links={siteConfig.footerLinks.company} />

          {/* Legal */}
          <FooterLinkGroup title="Legal" links={siteConfig.footerLinks.legal} />
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container-main"
             style={{ paddingTop: "1.25rem", paddingBottom: "1.25rem",
                      display: "flex", flexWrap: "wrap", alignItems: "center",
                      justifyContent: "space-between", gap: "0.75rem" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--color-neutral-500)" }}>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--color-neutral-500)" }}>
            Updated daily with fresh opportunities for students &amp; freshers.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 style={{
        color: "white",
        fontWeight: 600,
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: "1rem",
      }}>
        {title}
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              style={{ fontSize: "0.875rem", color: "var(--color-neutral-400)",
                       textDecoration: "none", transition: "color 0.2s" }}
              className="hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        width: "2rem", height: "2rem",
        backgroundColor: "var(--color-neutral-800)",
        borderRadius: "0.5rem",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--color-neutral-400)",
        textDecoration: "none",
        transition: "all 0.2s",
      }}
      className="hover:bg-primary-600 hover:text-white"
    >
      {children}
    </a>
  );
}
