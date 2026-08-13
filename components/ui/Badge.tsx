import { cn } from "@/lib/utils/cn";

type BadgeVariant = "primary" | "accent" | "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClass: Record<BadgeVariant, string> = {
  primary: "badge-primary",
  accent: "badge-accent",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
  neutral: "badge-neutral",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span className={cn("badge", variantClass[variant], className)}>
      {children}
    </span>
  );
}
