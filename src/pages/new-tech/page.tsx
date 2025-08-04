import { Dialog, DialogManager } from "@/components/ui/overlays/manager";
import { Notification } from "@/components/ui/overlays/notification";
import { useDeepObject } from "@/hooks/useObject";
import { useEffect } from "react";

export function NewTechPage() {
  const obj = useDeepObject({
    demo: {
      nested: {
        props: "simo",
        altra: "tasc",
        deep: { inside: { the: { object: "string" } } },
      },
    },
  });

  useEffect(() => {
    console.log("DEEP SETTING", obj.value);
    obj.deepSet("demo.nested.deep.inside.the", { object: "diverso" });
    obj.merge({ demo: { nested: { props: "macheooo" } } });
  }, []);

  useEffect(() => console.log(obj.value), [obj.value]);

  return (
    <>
      <DialogManager>
        <Dialog>
          <div className="w-96">
            <Notification title="CIAOO!" delete={() => {}} />
          </div>
        </Dialog>
        <Dialog title="companies">DIALOG 2</Dialog>
        <Dialog title="documents">DIALOG 3</Dialog>
        <Dialog>DIALOG 4</Dialog>
      </DialogManager>
      <pre>{JSON.stringify(obj.value, null, 2)}</pre>
    </>
  );
}
