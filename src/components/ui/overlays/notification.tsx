import { Button } from "@/components/ui/elements/buttons/Button";
import { Text } from "@/components/ui/elements/Text";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { NotificationProvider, initNotificationContext } from "@quarto-raggio/react-notification-context";
import { twJoin } from "tailwind-merge";

// TODO: animation in/out/group
// TODO: estrarre un componente UI

export type NotificationType = "error" | "warning" | "info" | "success";
type NotificationProps = { remove(): void; title: string; description?: string; type?: NotificationType };

export function Notification(p: NotificationProps) {
  return (
    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
      <div
        className={twJoin([
          "w-full",
          "shadow-lg dark:shadow-none ring-1",
          "rounded-lg bg-white ring-black/5",
          "dark:bg-zinc-900 dark:ring-white/10 forced-colors:outline",
        ])}
      >
        <div className="p-4">
          <div className="flex items-start">
            {p.type && p.type != "info" && (
              <div className="flex-shrink-0">
                {p.type === "error" && <XCircleIcon className="size-6 text-red-400" />}
                {p.type === "success" && <CheckCircleIcon className="size-6 text-green-400" />}
                {p.type === "warning" && <ExclamationTriangleIcon className="mt-0.5 size-6 text-amber-400" />}
              </div>
            )}
            <div className="ml-3 w-0 flex-1">
              <Text className="font-medium leading-normal sm:leading-normal">{p.title}</Text>
              {p.description && (
                <Text size="sm" light className="mt-1">
                  {p.description}
                </Text>
              )}
              {/* 
                <div className="mt-3 flex space-x-3">
                  <Button type="button" color="indigo">Undo</Button>
                  <Button type="button" outline>Dismiss</Button>
                </div>
              */}
            </div>
            <div className="ml-4 flex-shrink-0">
              <Button onClick={p.remove} plain className="-m-2">
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationPanel(p: React.PWC) {
  const ctx = initNotificationContext();
  return (
    <NotificationProvider value={ctx}>
      {p.children}
      <div aria-live="assertive" className="pointer-events-none fixed inset-0 px-4 py-6 sm:px-6 z-50">
        <div className="flex flex-col-reverse justify-end gap-4 h-[calc(80vh-theme(spacing.12))] overflow-x-hidden overflow-y-auto p-0.5">
          {ctx.queue.map((n) => (
            <div key={n.id} className="pointer-events-auto max-w-sm w-full ml-auto">
              <n.Component {...n.props} />
            </div>
          ))}
        </div>
      </div>
    </NotificationProvider>
  );
}
