
import { cn } from "@/lib/utils";

export * from "@heroicons/react/16/solid";

export function ProgressIcon({ className, ...p }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={3} stroke="currentColor" viewBox="0 0 24 24" className={cn("size-4", className)} data-slot="icon" {...p}>
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" opacity={0.15} />
      <path d="M12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19" />
    </svg>
  );
}