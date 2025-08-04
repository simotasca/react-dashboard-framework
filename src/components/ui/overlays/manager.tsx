import { Compact } from "@/components/ui/display/Compact";
import { Button } from "@/components/ui/elements/buttons/Button";
import { Children, cloneElement, isValidElement, useState } from "react";

type DialogProps = React.PWC<{ title?: string; open?: boolean; _onClose?: () => void }>;

export const Dialog: React.FC<DialogProps> = (p) => {
  if (!p.open) return null; // Do not render if not open
  return (
    <div className="fixed z-50 top-10 left-1/2 -translate-x-1/2 max-w-xs">
      <button onClick={p._onClose}>close</button>
      {p.children}
    </div>
  );
};

export function DialogManager(p: React.PWC) {
  const [openDialogIndex, setOpenDialogIndex] = useState<number | null>(null);

  const openDialog = (index: number) => {
    setOpenDialogIndex(index);
  };

  const closeDialog = () => {
    setOpenDialogIndex(null);
  };

  const dialogsWithProps = Children.map(p.children, (child, index) => {
    if (isValidElement<DialogProps>(child) && child.type === Dialog) {
      return cloneElement(child, {
        open: openDialogIndex === index,
        _onClose: closeDialog,
      });
    }
    return child;
  });

  const buttons = Children.map(dialogsWithProps as React.ReactElement<Partial<DialogProps>>[], (child, index) => (
    <>
      <Button
        key={index}
        color={child.props.open ? "indigo" : "zinc"}
        className="pointer-events-auto"
        onClick={() => (child.props.open ? closeDialog() : openDialog(index))}
      >
        Dialog {index + 1}
        {child.props.title && <>: "{child.props.title}"</>}
      </Button>
    </>
  ));

  return (
    <>
      {dialogsWithProps}

      <div className="fixed inset-0 pointer-events-none flex flex-col">
        <div className="mt-auto mb-0 p-2">
          <Compact>{buttons}</Compact>
        </div>
      </div>
    </>
  );
}
