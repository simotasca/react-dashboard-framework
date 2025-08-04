import { twMerge, type ClassNameValue } from "tailwind-merge";

/** this enforces bad habits */
export type ClassNameProps<T = {}> = Omit<T, "className"> & { className?: ClassNameValue };
export function cn(...classLists: ClassNameValue[]) {
  return twMerge(...classLists);
}
