import { HBox } from "@/components/ui/display/flex";
import { Badge, BadgeButton } from "@/components/ui/elements/Badge";
import { Text } from "@/components/ui/elements/Text";
import { Title } from "@/components/ui/elements/titles";
import { Input, InputGroup } from "@/components/ui/form";
import * as t from "@/components/ui/table";
import { usePagination } from "@/hooks/table/usePagination";
import { useSorting } from "@/hooks/table/useSorting";
import { useObjectState } from "@/hooks/useObject";
import { Data } from "@/pages/table/table-data";
import { type TableData, useTableData } from "@/pages/table/useTableData";
import { CheckCircleIcon, MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 25;

export function TablePage() {
  const [tableData, setTableData] = useState<TableData>({ tot: 0, items: [] });

  const sort = useSorting<keyof Data>();
  const filters = useObjectState<{ search?: string }>({});
  const pag = usePagination(tableData.tot, ITEMS_PER_PAGE);

  useTableData({ setTableData, sort, pag, filter: filters.value.search });

  const cols = t.useColumns("demo-page", ["age", "email", "address"]);

  return (
    <>
      <div className="max-h-full overflow-auto overflow-x-hidden">
        <div className="max-w-5xl">
        
          <Title className="mb-4">Form example</Title>
          
          <HBox className="mt-4 mb-2 items-end">
            <t.Pagination {...pag} />
            <InputGroup className="flex-1 max-w-80">
              <MagnifyingGlassIcon />
              <Input
                value={filters.get("search") || ""}
                onChange={(e) => filters.set("search", e.target.value)}
                placeholder="search here . . ."
              />
            </InputGroup>
            <HBox className="gap-x-2 items-end ml-auto mr-0">
              <Text size="sm" light>
                cols:
              </Text>
              {cols.columns.map((c) => (
                <BadgeButton key={c} color={(cols.isVisible(c) || undefined) && "indigo"} onClick={() => cols.toggle(c)}>
                  {c}
                </BadgeButton>
              ))}
            </HBox>
          </HBox>

          <t.Table>
            <t.Head>
              <t.Row>
                <t.Header className="sticky top-0 left-0 border-r">#</t.Header>
                <t.SortHeader {...sort} prop="name">Name</t.SortHeader>
                {cols.isVisible("age") && <t.SortHeader {...sort} prop="age">Age</t.SortHeader>}
                {cols.isVisible("email") && <t.SortHeader {...sort} prop="email">Email</t.SortHeader>}
                {cols.isVisible("address") && <t.SortHeader {...sort} prop="address">Address</t.SortHeader>}
                <t.Header className="sticky right-0 border-l">Actions</t.Header>
              </t.Row>
            </t.Head>

            <t.Body>
              {tableData.items.map((row, idx) => (
                <t.Row key={row.id}>
                  <t.Cell className="sticky z-10 left-0 border-r table-lg:w-0">{ITEMS_PER_PAGE * (pag.page - 1) + idx + 1}</t.Cell>
                  <t.Cell data-label="name">{row.name}</t.Cell>
                  {cols.isVisible("age") && <t.Cell data-label="age">{row.age}</t.Cell>}
                  {cols.isVisible("email") && <t.Cell data-label="email">{row.email}</t.Cell>}
                  {cols.isVisible("address") && <t.Cell data-label="address" className="whitespace-normal">{row.address}</t.Cell>}
                  <t.Cell data-label="actions" className="sticky z-10 right-0 border-l table-lg:w-0">
                    <HBox className="flex-nowrap gap-2 table-sm:justify-end">
                      <Badge color="green">
                        ok <CheckCircleIcon className="size-4" />
                      </Badge>
                      <BadgeButton color="red">
                        delete <TrashIcon className="size-4" />
                      </BadgeButton>
                    </HBox>
                  </t.Cell>
                </t.Row>
              ))}
            </t.Body>

            <t.Foot>
              <t.Row>
                <t.Cell colSpan={3 + cols.visible.length-1}></t.Cell>
                <t.Cell className="text-right sticky right-0">
                  <Text light>
                    total items: <b className="text-white font-black">{tableData.tot}</b>
                  </Text>
                </t.Cell>
              </t.Row>
            </t.Foot>
          </t.Table>

          <HBox className="mt-2">
            <t.Pagination {...pag} />
          </HBox>

          <p className="py-20">fine della pagina</p>
        </div>
      </div>
    </>
  );
}

type DragRef = React.RefObject<HTMLElement>;
type UsePointerScrollOptions = {
  onDragStart?(elem: HTMLElement, target: HTMLElement): void;
  onDragEnd?(elem: HTMLElement, target: HTMLElement): void;
};

const usePointerScroll = (ref: DragRef, targetRef: DragRef, options?: UsePointerScrollOptions) => {
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    const { current: elem } = ref;
    const { current: target } = targetRef;
    if (!elem || !target) return;

    const dragStart = (ev: PointerEvent) => {
      elem.setPointerCapture(ev.pointerId);
      document.body.style.userSelect = "none";
      options?.onDragStart?.(elem, target);
      setIsDragging(true);
    };
    const dragEnd = (ev: PointerEvent) => {
      elem.releasePointerCapture(ev.pointerId);
      document.body.style.userSelect = "";
      options?.onDragEnd?.(elem, target);
      setIsDragging(false);
    };
    const drag = (ev: PointerEvent) => {
      if (elem.hasPointerCapture(ev.pointerId)) {
        target.scrollLeft -= ev.movementX;
        target.scrollTop -= ev.movementY;
      }
    };

    elem.addEventListener("pointerdown", dragStart);
    elem.addEventListener("pointerup", dragEnd);
    elem.addEventListener("pointermove", drag);

    return () => {
      elem.removeEventListener("pointerdown", dragStart);
      elem.removeEventListener("pointerup", dragEnd);
      elem.removeEventListener("pointermove", drag);
    };
  }, [ref.current, setIsDragging]);

  return isDragging;
};
