import { cn } from "@/lib/utils";
import * as h from "@headlessui/react";
import React, { forwardRef } from "react";
import { ClassNameValue } from "tailwind-merge";

type InputGroupProps = Omit<React.ComponentPropsWithoutRef<"span">, "className"> & { className?: ClassNameValue };
export function InputGroup({ className, children, ...p }: InputGroupProps) {
  return (
    <span
      data-slot="control"
      className={cn(
        "relative isolate block w-full",
        // Input styles
        "[&_input]:has-[[data-slot=icon]:first-child]:pl-10 [&_input]:has-[[data-slot=icon]:last-child]:pr-10 sm:[&_input]:has-[[data-slot=icon]:first-child]:pl-8 sm:[&_input]:has-[[data-slot=icon]:last-child]:pr-8",
        // Icon styles
        "[&>[data-slot=icon]]:pointer-events-none [&>[data-slot=icon]]:absolute [&>[data-slot=icon]]:top-3 [&>[data-slot=icon]]:z-10 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:top-2.5 sm:[&>[data-slot=icon]]:size-4",
        // Icon positioning
        "[&>[data-slot=icon]:first-child]:left-3 sm:[&>[data-slot=icon]:first-child]:left-2.5 [&>[data-slot=icon]:last-child]:right-3 sm:[&>[data-slot=icon]:last-child]:right-2.5",
        // Icon colors
        "[&>[data-slot=icon]]:text-zinc-500 dark:[&>[data-slot=icon]]:text-zinc-400",
        className
      )}
      {...p}
    >
      {children}
    </span>
  );
}

const dateTypes = ["date", "datetime-local", "month", "time", "week"] as const;

type DateType = (typeof dateTypes)[number];
type AllowedTypes = "email" | "number" | "password" | "search" | "tel" | "text" | "url" | DateType;

type InputProps = { className?: string; type?: AllowedTypes } & Omit<h.InputProps, "className">;
type InputRef = React.ForwardedRef<HTMLInputElement>;

export const Input = forwardRef(({ className, ...props }: InputProps, ref: InputRef) => {
  return (
    <h.Input
      data-slot="control"
      ref={ref}
      {...props}
      className={cn([
        // Date classes
        props.type &&
          (dateTypes as unknown as string[]).includes(props.type) && [
            "[&::-webkit-datetime-edit-fields-wrapper]:p-0",
            "[&::-webkit-date-and-time-value]:min-h-[1.5em]",
            "[&::-webkit-datetime-edit]:inline-flex",
            "[&::-webkit-datetime-edit]:p-0",
            "[&::-webkit-datetime-edit-year-field]:p-0",
            "[&::-webkit-datetime-edit-month-field]:p-0",
            "[&::-webkit-datetime-edit-day-field]:p-0",
            "[&::-webkit-datetime-edit-hour-field]:p-0",
            "[&::-webkit-datetime-edit-minute-field]:p-0",
            "[&::-webkit-datetime-edit-second-field]:p-0",
            "[&::-webkit-datetime-edit-millisecond-field]:p-0",
            "[&::-webkit-datetime-edit-meridiem-field]:p-0",
          ],
        // Basic layout
        "relative block w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
        // Typography
        "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white",
        // Border
        "border border-zinc-950/10 hover:border-zinc-950/20 dark:border-white/10 dark:hover:border-white/20",
        // Background color
        "bg-transparent dark:bg-white/5",
        // Focus styles
        "outline-none sm:focus:outline sm:focus:outline-blue-500 outline-2 -outline-offset-1",
        // shadows
        "shadow dark:shadow-none",
        // Invalid state
        "state-invalid:shadow-red-500/10 state-invalid:border-red-500 state-invalid:hover:border-red-500",
        "dark:state-invalid:border-red-500 dark:state-invalid:hover:border-red-500",
        // Disabled state
        "state-disabled:shadow-none state-disabled:opacity-50 state-disabled:bg-zinc-950/5 state-disabled:border-zinc-950/20",
        "dark:hover:state-disabled:border-white/15 dark:state-disabled:border-white/15 dark:state-disabled:bg-white/[2.5%]",
        // System icons
        "dark:[color-scheme:dark]",
        className,
      ])}
    />
  );
});
