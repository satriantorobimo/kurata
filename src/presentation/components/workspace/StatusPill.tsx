import { WORKSPACE_STATUS, type WorkspaceStatus } from "@/application/config/workspaceDemoData";
import { cn } from "@/lib/cn";

export function StatusPill({ status }: { status: WorkspaceStatus }) { const item = WORKSPACE_STATUS[status]; return <span className={cn("inline-flex rounded-full px-3 py-1.5 text-label-sm font-label-sm", item.className)}>{item.label}</span>; }
