import * as h from "@headlessui/react";
import { twJoin } from "tailwind-merge";

export function Field(p: React.PWC) {
  return (
    <h.Field
      className={twJoin(
        "grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 items-end",
        // Label layout
        "[&>[data-slot=label]]:order-1 [&>[data-slot=label]]:col-span-2 [&>[data-slot=label]:has(+[data-slot=description])]:col-span-1",
        // Control layout
        "[&>[data-slot=control]]:col-span-2 [&>[data-slot=control]]:order-3",
        // Short description layout
        "[&>[data-slot=label]+[data-slot=description]]:col-span-1 [&>[data-slot=label]+[data-slot=description]]:order-2 [&>[data-slot=label]+[data-slot=description]]:justify-self-end [&>[data-slot=label]+[data-slot=description]]:text-right",
        // Long description layout
        "[&>[data-slot=description]]:col-span-2 [&>[data-slot=description]]:order-4 [&>[data-slot=control]+[data-slot=description]]:mt-1",
        // Error colors
        "[&>[data-slot=description]:has(~[data-slot=control])]:has-[[data-invalid]]:text-red-600",
        "dark:[&>[data-slot=description]:has(~[data-slot=control])]:has-[[data-invalid]]:text-red-400",
      )}
    >
      {p.children}
    </h.Field>
  );
}

export function SwitchField(p: React.PWC) {
  return (
    <h.Field
      className={twJoin(
        "grid grid-cols-[1fr_auto] items-center gap-x-8",
        // Control layout
        '[&>[data-slot=control]]:col-start-2',
        // Label layout
        '[&>[data-slot=label]]:col-start-1 [&>[data-slot=label]]:row-start-1',
        // Description layout
        '[&>[data-slot=description]]:col-start-1 [&>[data-slot=description]]:row-start-2',
        // Error colors
        "[&>[data-slot=description]]:has-[[data-invalid]]:text-red-600",
        "dark:[&>[data-slot=description]]:has-[[data-invalid]]:text-red-400",
      )}
    >
      {p.children}
    </h.Field>
  );
}

type GoodOleFieldProps = React.PWC<{ label?: string; description?: string; error?: string; }>;
export function GoodOleField(p: GoodOleFieldProps) {
  const hasError = !!p.error;
  const showDescription = hasError || !!p.description;
  return (
    <h.Field>
      <div className="flex gap-x-4 pl-0.5 items-end mb-1">
        {p.label && (
          <h.Label className="font-medium text-sm flex-shrink-0">
            {p.label}
          </h.Label>
        )}
        {showDescription && (
          <h.Description
            className={twJoin(
              "ml-auto text-xs/tight text-right pb-px",
              hasError
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-600 dark:text-zinc-400"
            )}
          >
            {hasError ? p.error! : p.description!}
          </h.Description>
        )}
      </div>
      {p.children}
    </h.Field>
  );
}
