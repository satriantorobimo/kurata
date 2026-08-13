import { cn } from "@/lib/cn";

type StatusTone = "info" | "success" | "warning" | "attention" | "neutral" | "primary";
const statusClasses: Record<StatusTone, string> = { info: "bg-status-info-container text-status-info", success: "bg-status-success-container text-status-success", warning: "bg-status-warning-container text-status-warning", attention: "bg-status-attention-container text-status-attention", neutral: "bg-status-neutral-container text-status-neutral", primary: "bg-primary text-on-primary" };

interface StatusBadgeProps extends React.ComponentPropsWithoutRef<"span"> { tone?: StatusTone; }

export function StatusBadge({ children, tone = "neutral", className, ...props }: StatusBadgeProps) {
  return <span className={cn("inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-label-sm font-label-sm", statusClasses[tone], className)} {...props}>{children}</span>;
}
