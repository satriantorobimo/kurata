import { cn } from "@/lib/cn";

type BadgeVariant = "exclusive" | "broker";

interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  exclusive: "bg-primary text-on-primary",
  broker: "bg-badge-teal text-white",
};

const variantLabels: Record<BadgeVariant, string> = {
  exclusive: "Exclusive Kurata",
  broker: "Mitra Kurata",
};

export function Badge({ variant, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider",
        variantClasses[variant],
        className,
      )}
    >
      {variantLabels[variant]}
    </span>
  );
}
