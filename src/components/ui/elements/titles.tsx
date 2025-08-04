import { cn } from "@/lib/utils";

type TitleProps = { h?: 1 | 2 | 3 | 4 | 5 | 6 } & React.ComponentPropsWithoutRef<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;

export function Title({ className, h = 1, ...props }: TitleProps) {
  let Element: `h${typeof h}` = `h${h}`;
  return <Element {...props} className={cn(className, "text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white")} />;
}

export function Subtitle({ className, h = 2, ...props }: TitleProps) {
  let Element: `h${typeof h}` = `h${h}`;
  return <Element {...props} className={cn(className, "text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white")} />;
}
