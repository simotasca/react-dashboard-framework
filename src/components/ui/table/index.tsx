import { Button } from "@/components/ui/elements/buttons/Button";
import { Text } from "@/components/ui/elements/Text";
import { type usePagination } from "@/hooks/table/usePagination";
import { type useSorting } from "@/hooks/table/useSorting";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { useMemo } from "react";
import { type ClassNameValue } from "tailwind-merge";
import styles from "./table.module.css";

type ContainerProps = React.ComponentPropsWithRef<"div">;
export function Container({ className, ...p }: ContainerProps) {
  return <div {...p} className={[styles.container, className].join(" ")} />;
}

type TableProps = React.ComponentPropsWithRef<"table">;
export function Table({ className, ...p }: TableProps) {
  return <table {...p} className={[styles.table, className].join(" ")} />;
}

type TRowProps = React.ComponentPropsWithRef<"tr">;
export function Row({ className, ...p }: TRowProps) {
  return <tr {...p} className={[styles.row, className].join(" ")} />;
}

type CellProps = React.ComponentPropsWithRef<"td">;
export function Cell({ className, ...p }: CellProps) {
  return <td {...p} className={[styles.cell, className].join(" ")} />;
}

type TSectionProps = React.ComponentPropsWithoutRef<"thead" | "tfoot">;
export function Head({ className, ...p }: TSectionProps) {
  return <thead {...p} className={[styles.head, className].join(" ")} />;
}
export function Body(p: TSectionProps) {
  return <tbody {...p} />;
}
export function Foot({ className, ...p }: TSectionProps) {
  return <tfoot {...p} className={[styles.foot, className].join(" ")} />;
}

type HeaderProps = Omit<React.HTMLElProps<HTMLTableCellElement>, "className"> & React.PWC<{ hidden?: boolean; className?: ClassNameValue }>;
export function Header({ className, children, ...p }: HeaderProps) {
  return (
    <th {...p} className={cn(styles.header, className)}>
      {children}
    </th>
  );
}

type Key = string | number | symbol;
type SortHeaderProps<T extends Key> = HeaderProps & ReturnType<typeof useSorting<T>> & { prop: T };
export function SortHeader<T extends Key>({ prop, sort, getSort, sorting, getSorted, className, children, ...p }: SortHeaderProps<T>) {
  const sortOrder = getSort(prop) || "null";
  return (
    <Header
      {...p}
      role="button"
      className={cn(
        // p.hidden && "hidden",
        "after:text-xs after:ml-1",
        sortOrder != "null" && "bg-slate-200 dark:bg-slate-800",
        sortOrder === "asc" && "after:content-['^']",
        sortOrder === "desc" && "after:content-['v']",
        className
      )}
      onClick={() => sort(prop)}
    >
      {children}
    </Header>
  );
}

export function Pagination(p: Omit<ReturnType<typeof usePagination>, "limit" | "offset" | "setPage"> & { className?: string }) {
  return (
    <div className={cn(styles.pagination, p.className)}>
      <Button color="light" disabled={p.page <= 1} onClick={p.prevPage}>
        <ArrowLeftIcon />
      </Button>
      <Text className={["mx-2", p.totPages < 2 && "text-zinc-400 dark:text-zinc-400"]}>
        Page {p.page} / {p.totPages}
      </Text>
      <Button color="light" disabled={p.page >= p.totPages} onClick={p.nextPage}>
        <ArrowRightIcon />
      </Button>
    </div>
  );
}

export function useColumns(storageId: string, columns: string[]) {
  const [visible, setVisible] = useLocalStorage("use-colummns-visible-" + storageId, columns);
  const hidden = useMemo(() => columns.filter((col) => !visible.includes(col)), [columns, visible]);
  const hide = (col: string) => setVisible((cols) => cols.filter((c) => c != col));
  const show = (col: string) => setVisible((cols) => (cols.includes(col) ? cols : [...cols, col]));
  const isVisible = (col: string) => visible.includes(col);
  const toggle = (col: string) => (isVisible(col) ? hide(col) : show(col));
  return { columns, visible, hidden, toggle, hide, show, isVisible };
}
export function Columns(p: ReturnType<typeof useColumns>) {
  return (
    <>
      {p.columns.map((c) => (
        <col className={cn(!p.isVisible(c) && "collapse")} />
      ))}
    </>
  );
}

// const mobileStyles = {
//   cell: [
//     "table-sm:block table-sm:text-right table-lg:before:hidden before:[content:attr(data-label)] before:float-left before:text-xs/5 before:uppercase before:font-medium before:pr-4",
//     "table-sm:bg-zinc-100 table-sm:dark:bg-zinc-850 table-sm:border-x table-sm:first-of-type:border-t",
//   ],
//   row: "table-sm:block table-sm:mb-2.5",
//   head: "table-sm:[clip:rect(0_0_0_0)] table-sm:size-px table-sm:-m-px table-sm:overflow-hidden table-sm:p-0 table-sm:absolute",
// };
