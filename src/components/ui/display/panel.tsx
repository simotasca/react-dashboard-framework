import { ClassNameProps, cn } from "@/lib/utils";

type PanelProps = ClassNameProps<React.HTMLElProps<HTMLDivElement> & { open: boolean }>;

export function HPanel({ open, className, ...p }: PanelProps) {
  return (
    <div
      className={cn(
        "grid duration-300 [transition-property:grid-template-columns] *:overflow-hidden",
        open ? "grid-cols-[1fr]" : "grid-cols-[0fr]",
        className
      )}
      {...p}
    />
  );
}

export function VPanel({ open, className, ...p }: PanelProps) {
  return (
    <div
      className={cn(
        "grid duration-300 [transition-property:grid-template-rows] *:overflow-hidden", 
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]", 
        className
      )}
      {...p}
    />
  );
}
