import { flip, offset } from "@floating-ui/dom";
import { autoUpdate, useFloating, type UseFloatingOptions } from "@floating-ui/react-dom";
import { forwardRef } from "react";
import { ClassNameValue } from "tailwind-merge";
import styles from "./tooltip.module.css";

type TooltippedProps = React.PWC<{
  placement?: UseFloatingOptions["placement"];
  middleware?: UseFloatingOptions["middleware"];
  tooltip: React.ReactNode;
}>;

export function useBaseTooltip(placement: UseFloatingOptions["placement"] = "top") {
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: placement,
    middleware: [offset(6), flip()],
  });
  const floatingStyle: React.CSSProperties = { position: "absolute", zIndex: 50 };
  const floatingProps = { ref: refs.setFloating, style: { ...floatingStyle, ...floatingStyles } };
  const refProps = { ref: refs.setReference, style: { position: "relative" as const } };
  return [refProps, floatingProps];
}

export function Floating(p: TooltippedProps) {
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: p.placement,
    middleware: p.middleware,
  });

  return (
    <span className={styles.container} ref={refs.setReference}>
      <span>{p.children}</span>
      <div className={styles.floating} ref={refs.setFloating} style={floatingStyles}>
        {p.tooltip}
      </div>
    </span>
  );
}

export function Tooltipped({ children, tooltip, className, ...p }: TooltippedProps & { className?: string }) {
  return (
    <Floating {...p} tooltip={<Tooltip className={className}>{tooltip}</Tooltip>}>
      {children}
    </Floating>
  );
}

export const Tooltip = forwardRef<HTMLSpanElement, React.ComponentProps<"span">>(({ className, ...p }, ref) => {
  return (
    <span ref={ref} className={styles.tooltip + " " + className} {...p}>
      {p.children}
    </span>
  );
});
