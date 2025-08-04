import * as h from "@headlessui/react";
import React from "react";
import { styles as textStyles } from "../elements/Text";
import { cn } from "@/lib/utils";

export * from "./Field";
export * from "./inputs/Input";
export * from "./inputs/Select";

export function Label(p: React.PWC) {
  return (
    <h.Label data-slot="label" className="font-medium text-sm flex-shrink-0">
      {p.children}
    </h.Label>
  );
}

export function Description(p: React.PWC) {
  return (
    <h.Description data-slot="description" className={cn(textStyles.sizes.sm, textStyles.colors.light)}>
      {p.children}
    </h.Description>
  );
}
