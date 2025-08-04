import { useCallback, useState } from "react";

export type SortDirection = "asc" | "desc" | "null";

export type Sortings<T extends string | number | symbol> = { [K in T]?: SortDirection };
export type Sorter<T> = (col: T, dir?: SortDirection) => void;
export type GetSort<T> = (col: T) => SortDirection;

export function useSorting<T extends string | number | symbol>(props?: { allowMultiple?: boolean }) {
  const allowMultiple = !!props?.allowMultiple;
  const [sorting, setSorting] = useState<Sortings<T>>({});

  /** Sorts a column by rotating the sorting direction (if not specified) */
  const sort: Sorter<T> = (col: T, dir?: SortDirection) => {
    let update = { ...sorting };

    if (!allowMultiple) update = {};

    if (dir == "null") delete update[col];
    else if (dir) update[col] = dir;
    else if (!sorting[col]) update[col] = "asc";
    else if (sorting[col] === "asc") update[col] = "desc";
    else if (sorting[col] === "desc") delete update[col];

    setSorting(update);
  };

  /** get the SortingDirection of a column */
  const getSort: GetSort<T> = (col: T) => {
    return sorting[col] || "null";
  };

  /** returns the sorted column (if allowMultiple=true it still returns one column) */
  const getSorted = useCallback((): { key: T; direction: Exclude<SortDirection, "null"> } | null => {
    const key = Object.keys(sorting)[0] as T;
    let direction = sorting[key];
    if (!key || !direction || direction == "null") return null;
    return { key, direction };
  }, [sorting]);

  return { sorting, sort, getSort, getSorted };
}
