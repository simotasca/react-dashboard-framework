import React, { useCallback, useMemo } from "react";
import { useEffect } from "react";
import { useArray } from "@quarto-raggio/react-hooks";
import { createContext } from "@quarto-raggio/create-react-context";

export type Notification<T = any> = {
  id: string;
  createdAt: number;
  Component: React.ElementType<T>;
  props: T;
};

export type NotifyContext = {
  customNotify<T>(element: React.ElementType<T>, props: (p: { createdAt: number; remove(): void }) => T): void;
  remove(id: string): void;
  clear(): void;
};

export type NotificationsQueueContext = {
  queue: Notification[];
  setQueue: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export type NotificationContext = NotificationsQueueContext & NotifyContext;

type NotificationContextOptions = { lifetime?: number; cleanupInterval?: number };
export function initNotificationContext(options?: NotificationContextOptions): NotificationContext {
  const [queue, setQueue, append] = useArray<Notification>();
  const remove = useCallback((id: string) => setQueue((prev) => prev.filter((p) => p.id != id)), [setQueue]);
  const clear = useCallback(() => setQueue([]), [setQueue]);

  const customNotify: NotifyContext["customNotify"] = useCallback((children, props) => {
    const id = crypto.randomUUID();
    const createdAt = Date.now();
    // se il valore di props cambia credo sia un problema...
    append({ id, createdAt, Component: children, props: props({ createdAt, remove: () => remove(id) }) });
  }, [append, remove]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setQueue((queue) => queue.filter((e) => e.createdAt + (options?.lifetime || 6000) > now));
    }, options?.cleanupInterval || 500);
    return () => clearInterval(interval);
  }, [setQueue, options]);

  return { queue, setQueue, customNotify, clear, remove };
}

const [, useNotificationsQueue, NotificationsQueueProvider] = createContext<NotificationsQueueContext>({
  errorMsg: "invalid useNotificationsQueue usage outside NotificationProvider",
});
const [, useNotify, NotifyProvider] = createContext<NotifyContext>({
  errorMsg: "invalid useNotify usage outside NotificationProvider",
});

export { useNotificationsQueue, useNotify };

/**
 * ### SUGGESTED USAGE: 
 * creare un hook custom che espone una funzione per l'invio di notifiche con un componente predefinito
 * ```
 * function useCustomNotify() {
 *   const { customNotify, clear, delete } = useNotify();
 *   const notify = (title: string, description: string) => {
 *     customNotify(YourCustomComponent, (p) => ({ title, description, type }))
 *   };
 *   const enotify = (title: string, description: string) => {
 *     customNotify(YourCustomErrorComponent, (p) => ({ title, description, type }))
 *   };
 *   return { clear, delete, notify, enotify };
 * }
 * ``` 
 */
export function NotificationProvider(p: React.PropsWithChildren<{ value: NotificationContext }>) {
  const { queue, setQueue, remove, clear, customNotify } = p.value;
  const notify = useMemo(() => ({ remove, clear, customNotify }), [remove, clear, customNotify]);
  return (
    <NotificationsQueueProvider value={{ queue, setQueue }}>
      <NotifyProvider value={notify}>
        {p.children}
      </NotifyProvider>
    </NotificationsQueueProvider>
  );
}

