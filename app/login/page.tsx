import { Suspense } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/utils/seo";
import LoginForm from "./LoginForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Logo from "@/components/ui/Logo";

export const metadata = buildMetadata({
  title: "Admin Login",
  description: `Sign in to the ${siteConfig.name} admin panel.`,
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 inline-block mx-auto mb-3 shadow-xl border border-white/20">
            <Logo size="lg" />
          </div>
          <p className="text-primary-200 text-sm font-medium">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-display font-semibold text-neutral-900 mb-1">
            Welcome back
          </h2>
          <p className="text-neutral-500 text-sm mb-7">
            Sign in to manage your portal.
          </p>

          <Suspense fallback={<div className="py-8"><LoadingSpinner /></div>}>
            <LoginForm />
          </Suspense>

          <p className="text-center text-xs text-neutral-400 mt-6">
            This page is restricted to administrators only.
          </p>
        </div>

        {/* Back to site */}
        <div className="text-center mt-5">
          <Link
            href="/"
            className="text-primary-200 hover:text-white text-sm transition-colors no-underline"
          >
            ← Back to {siteConfig.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
