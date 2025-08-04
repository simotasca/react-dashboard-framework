import { useState } from "react";

/** the page index is 1 based */
export function usePagination(totalItems: number, pageSize: number = 10) {
  const [page, setPage] = useState(1);
  const limit = pageSize;
  const offset = (page - 1) * pageSize;
  const totPages = Math.ceil(totalItems / pageSize);
  const nextPage = () => setPage(page < totPages ? page + 1 : totPages);
  const prevPage = () => setPage(page > 1 ? page - 1 : 1);
  return { page, limit, offset, setPage, totPages, nextPage, prevPage };
}
