import {
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
} from "lucide-react";
import { siteConfig } from "@/config/site";

const settingsSections = [
  {
    icon: Globe,
    title: "Site Information",
    description: "Basic platform identity and branding settings.",
    fields: [
      { label: "Site Name", value: siteConfig.name, readOnly: true },
      { label: "Site URL", value: siteConfig.url, readOnly: true },
      { label: "Tagline", value: siteConfig.tagline, readOnly: true },
    ],
  },
  {
    icon: Mail,
    title: "Social Links",
    description: "Connected social media profiles.",
    fields: [
      { label: "Twitter / X", value: siteConfig.social.twitter, readOnly: true },
      { label: "LinkedIn", value: siteConfig.social.linkedin, readOnly: true },
      { label: "Instagram", value: siteConfig.social.instagram, readOnly: true },
      { label: "Telegram", value: siteConfig.social.telegram, readOnly: true },
    ],
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          Settings
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Platform configuration and admin preferences.
        </p>
      </div>

      {/* Config Sections */}
      {settingsSections.map((section) => {
        const Icon = section.icon;
        return (
          <div
            key={section.title}
            className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-5"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-display font-semibold text-neutral-900">
                  {section.title}
                </h2>
                <p className="text-xs text-neutral-400">{section.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.label} className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    {field.label}
                  </label>
                  <div className="input bg-neutral-50 text-neutral-700 text-sm cursor-default truncate">
                    {field.value || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Shield,
            title: "Auth & Security",
            desc: "Authentication is handled by Better Auth. Manage users from your DB.",
          },
          {
            icon: Database,
            title: "Database",
            desc: "Connected to MongoDB Atlas. Use Mongoose models to manage data.",
          },
          {
            icon: Bell,
            title: "Notifications",
            desc: "Toast notifications are shown via Sonner for all admin actions.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-neutral-100 shadow-card p-5 space-y-3"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Config file note */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 flex items-start gap-3">
        <Settings className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-primary-900">
            Configuration via{" "}
            <code className="font-mono text-xs bg-primary-100 px-1.5 py-0.5 rounded">
              config/site.ts
            </code>
          </p>
          <p className="text-xs text-primary-700 mt-1">
            To update site name, tagline, social links or navigation, edit{" "}
            <code className="font-mono text-xs">config/site.ts</code> in the
            project root. Environment variables (DB, Auth, Cloudinary) are
            managed in{" "}
            <code className="font-mono text-xs">.env</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
