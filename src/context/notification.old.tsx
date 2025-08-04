import { useArray } from "@/hooks/useArray";
import { createContext, useContext, useEffect } from "react";

export type Notification = { 
  message: string;
  createdAt: number;
};

export type NotificationContext = {
  queue: Notification[];
  setQueue: React.StateSetter<Notification[]>;
  notify(message: string): void;
  delete(createdAt: number): void;
  clear(): void;
};

type NotificationContextOptions = {
  lifetime?: number;
  cleanupInterval?: number;
};
export function initNotificationContext(
  options?: NotificationContextOptions
): NotificationContext {
  const [queue, setQueue, append] = useArray<Notification>();
  const deleteFn = (createdAt: number) =>
    setQueue((prev) => prev.filter((p) => p.createdAt != createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setQueue((queue) =>
        queue.filter((e) => e.createdAt + (options?.lifetime || 6000) > now)
      );
    }, options?.cleanupInterval || 500);
    return () => clearInterval(interval);
  }, [setQueue]);

  return {
    queue,
    setQueue,
    notify: (message) => append({ message, createdAt: Date.now() }),
    delete: deleteFn,
    clear: () => setQueue([]),
  };
}

const notificationContext = createContext<NotificationContext | null>(null);

export function useNotification() {
  const ctx = useContext(notificationContext);
  if (ctx === null) {
    throw new Error(
      "cannot use hook useNotification outside a NotificationProvider"
    );
  }
  return ctx;
}

export function NotificationProvider(
  p: React.PWC<{ value: NotificationContext }>
) {
  return (
    <notificationContext.Provider value={p.value}>
      {p.children}
    </notificationContext.Provider>
  );
}
