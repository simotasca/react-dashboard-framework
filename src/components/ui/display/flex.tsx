import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

type FlexBoxProps = React.HTMLElProps<HTMLDivElement> & {
  className?: ClassNameValue;
};

export const HBox = ({ className, ...p }: FlexBoxProps) => (
  <div {...p} className={cn("flex flex-wrap items-center gap-x-4 gap-y-1", className)} />
);
export const VBox = ({ className, ...p }: FlexBoxProps) => (
  <div {...p} className={cn("flex flex-col gap-y-4 gap-x-1", className)} />
);
