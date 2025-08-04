import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";

export const styles = {
  base: ["inline-block"],
  colors: {
    dark: ["text-zinc-800 dark:text-zinc-200"],
    light: ["text-zinc-600 dark:text-zinc-400"],
  },
  sizes: {
    sm: ["text-sm/6 sm:text-xs/5"],
    base: ["text-base/7 sm:text-sm/6"],
  },
};

type Variants = {
  light?: boolean;
  size?: keyof typeof styles.sizes | "none";
};

export type TextProps = Variants & Omit<React.HTMLElProps<HTMLParagraphElement>, "className"> & { className?: ClassNameValue };

export function Text({ light, size, className, children, ...p }: TextProps) {
  const classes = cn(
    styles.base,
    styles.colors[light ? "light" : "dark"],
    size != "none" && styles.sizes[size ?? "base"],
    className
  );

  return (
    <span {...p} className={classes}>
      {children}
    </span>
  );
}
