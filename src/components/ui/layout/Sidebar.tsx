import { TouchTarget } from "@/components/ui/elements/TouchTarget";
import { type ClassNameProps, cn } from "@/lib/utils";
import { ChevronDownIcon, MapIcon } from "@heroicons/react/20/solid";
import { LayoutGroup, motion } from "framer-motion";
import React, { TransitionEventHandler, useEffect, useId, useRef } from "react";

export function SidebarLayout(p: React.PWC<{ sidebar: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-[auto_1fr] w-screen h-svh">
      {p.sidebar}
      <div className="h-full w-full relative overflow-auto">{p.children}</div>
    </div>
  );
}

export function Sidebar({ children }: React.PWC) {
  let id = useId();
  return (
    <LayoutGroup id={id}>
      <div className="h-full w-sidebar-closed">
        <HoverOpen
          onClosed={(el) => el.querySelectorAll<HTMLElement>("[data-open]").forEach((child) => delete child.dataset.open)}
          className="
            absolute left-0 top-0 h-full z-50 overflow-hidden
            w-sidebar-closed data-[hover]:w-sidebar-open [&:not([data-hover]):has([data-open])]:delay-200 transition-[width] duration-200
            bg-zinc-920 border-r border-zinc-700"
        >
          <div className="h-full flex flex-col">{children}</div>
        </HoverOpen>
      </div>
    </LayoutGroup>
  );
}

export function SidebarHead({ className, ...p }: React.ComponentPropsWithoutRef<"div">) {
  return <div {...p} className={cn("flex-shrink-0 py-5 bg-zinc-910 border-b border-zinc-800", className)} />;
}

export function SidebarBody({ className, ...p }: React.ComponentPropsWithoutRef<"div">) {
  return <div {...p} className={cn("flex-1 h-full overflow-y-scroll overflow-x-hidden", className)} />;
}

export function SidebarFoot({ className, ...p }: React.ComponentPropsWithoutRef<"div">) {
  return <div {...p} className={cn("flex-shrink-0 py-4 bg-zinc-910 border-t border-zinc-800", className)} />;
}

export function SidebarHeading({ className, ...props }: React.ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      {...props}
      className={cn(
        className,
        "sticky top-0 pt-5 pb-1 bg-zinc-920 block z-10",
        "uppercase w-sidebar-open px-4 text-[0.7rem]/none font-medium text-zinc-500 dark:text-zinc-400",
        "transition-[opacity,transform] opacity-0 [[data-hover]_&]:opacity-100"
      )}
    />
  );
}

export function SidebarIcon({ ...p }: React.ComponentProps<"img">) {
  return <img data-slot="icon" {...p} />
}

export function SidebarLabel({ className, ...p }: React.ComponentProps<"span">) {
  return <span className={cn("text-sm/6 truncate pr-4 text-zinc-100", className)} {...p} />;
}

export function SidebarSpacer() {
  return <div aria-hidden="true" className="mt-8" />;
}

export function SidebarDropdown({
  children,
  className,
  title,
  onClick,
  ...p
}: React.ComponentProps<typeof SidebarLink> & { title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <SidebarLink
        className={["py-2", className]}
        onClick={(e) => {
          const { current } = ref;
          if (!current) return;
          if ("open" in ref.current!.dataset) delete ref.current!.dataset.open;
          else {
            ref.current!.dataset.open = "true";
            ref.current!.dispatchEvent(new Event("open", { bubbles: true }));
          }
          onClick?.(e);
        }}
        {...p}
      >
        <MapIcon />
        <SidebarLabel>{title}</SidebarLabel>
        <ChevronDownIcon className="origin-center [:has(+[data-open])>*>&]:-rotate-180 [:has(+[data-open])>*>&]:translate-y-px ml-auto !w-5 !h-auto !px-0 mr-3" />
      </SidebarLink>
      <div
        ref={ref}
        className={cn([
          "w-sidebar-open",
          "grid duration-200 [transition-property:grid-template-rows]",
          "grid-rows-[0fr]",
          "[[data-open][data-hover]_&[data-open]]:grid-rows-[1fr]",
        ])}
      >
        <div className="overflow-hidden min-h-0">
          <div className="pt-1 pb-4 pr-4 pl-7 text-sm/6">{children}</div>
        </div>
      </div>
    </>
  );
}

export function SidebarLink({ className, isActive, children, ...p }: React.ComponentProps<typeof SidebarButton> & { isActive?: boolean }) {
  return (
    <SidebarButton
      {...p}
      className={cn(
        "relative py-2",
        "[&_[data-slot=icon]]:transition-colors [&_[data-slot=icon]]:duration-200",
        isActive ? "[&_[data-slot=icon]]:text-white" : "[&_[data-slot=icon]]:text-zinc-400",
        className
      )}
    >
      {isActive && <motion.span layoutId="current-indicator" className="absolute left-0 top-0 z-20 h-full border-l-4 border-l-indigo-500" />}
      {children}
    </SidebarButton>
  );
}

export function SidebarButton({
  className,
  children,
  ...p
}: React.PWC<ClassNameProps<React.ComponentProps<"button"> & { active?: boolean }>>) {
  return (
    <button {...p} className={cn("block hover:bg-white/10 focus:outline-none focus-visible:outline-indigo-300/40", className)}>
      <TouchTarget>
        <SidebarItem>{children}</SidebarItem>
      </TouchTarget>
    </button>
  );
}

export function SidebarItem({ className, children, ...p }: ClassNameProps<React.ComponentProps<"span">>) {
  return (
    <span
      {...p}
      className={cn(
        "flex items-center gap-1 w-sidebar-open [&_[data-slot=icon]]:px-[1.1rem] [&_[data-slot=icon]]:w-sidebar-closed [&_[data-slot=icon]]:flex-shrink-0",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SidebarDropout() {
  /** TODO: */
}


type HoverOpenProps = React.ComponentProps<"div"> & {
  onOpenStart?(elem: HTMLDivElement): void;
  onOpened?(elem: HTMLDivElement): void;
  onCloseStart?(elem: HTMLDivElement): void;
  onClosed?(elem: HTMLDivElement): void;
};

function HoverOpen({ onOpenStart, onOpened, onCloseStart, onClosed, ...p }: HoverOpenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseEnter = () => {
    delete ref.current!.dataset.closing;
    ref.current!.dataset.hover = "true";
    ref.current!.dataset.opening = "true";
    onOpenStart?.(ref.current!);
  };
  const onMouseLeave = () => {
    delete ref.current!.dataset.opening;
    delete ref.current!.dataset.hover;
    ref.current!.dataset.closing = "true";
    onCloseStart?.(ref.current!);
  };
  const onTransitionEnd: TransitionEventHandler = (e) => {
    delete ref.current!.dataset.opening;
    delete ref.current!.dataset.closing;
    if (e.propertyName === "width") {
      if ("hover" in ref.current!.dataset) {
        ref.current!.dataset.open = "true";
        onOpened?.(ref.current!);
      } else {
        delete ref.current!.dataset.open;
        onClosed?.(ref.current!);
      }
    }
  };

  /** TODO: QUESTO NON DOVREBBE ESSERE QUI SE SI VOLESSE FARE UN COMPONENTE RIUTILIZZABILE */
  useEffect(() => {
    const { current } = ref;
    if (!current) return;
    const handler = (e) => {
      if (e.target === current) return;
      current.querySelectorAll<HTMLElement>("[data-open]").forEach((child) => {
        if (child != e.target) delete child.dataset.open;
      });
    };
    current.addEventListener("open", handler);
    return () => current.removeEventListener("open", handler);
  });
  return <div {...p} ref={ref} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onTransitionEnd={onTransitionEnd} />;
}