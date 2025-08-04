import { type usePagination } from "@/hooks/table/usePagination";
import { type useSorting } from "@/hooks/table/useSorting";
import { usePrevious } from "@/hooks/usePrevious";
import { data, type Data } from "@/pages/table/table-data";
import { useEffect } from "react";

export type TableData = { tot: number; items: Data[] };

export function useTableData({
  sort,
  pag,
  filter,
  setTableData,
}: {
  pag: ReturnType<typeof usePagination>;
  sort: ReturnType<typeof useSorting<keyof Data>>;
  filter?: string;
  setTableData: React.StateSetter<TableData>;
}) {
  const prevSort = usePrevious(JSON.stringify(sort.sorting));
  const prevFilter = usePrevious(filter || "");

  useEffect(() => {
    if ((prevSort != JSON.stringify(sort.sorting) || prevFilter != (filter || "")) && pag.page != 1) return pag.setPage(1);

    let sorted = data;
    const sortedCol = sort.getSorted();
    if (sortedCol !== null) {
      const s = sortedCol.direction === "asc" ? 1 : -1;
      sorted = [...data].sort((a, b) => (a[sortedCol.key] > b[sortedCol.key] ? s : s * -1));
    }

    let filtered = sorted;
    if (filter) filtered = sorted.filter((row) => has(row.address, filter) || has(row.email, filter) || has(row.name, filter));

    const paginated = filtered.slice(pag.offset, pag.offset + pag.limit);

    setTableData({ tot: filtered.length, items: paginated });
  }, [sort.sorting, pag.limit, pag.offset, filter]);
}

function has(str: string, val: string) {
  return str.toLowerCase().includes(val.toLowerCase());
}
