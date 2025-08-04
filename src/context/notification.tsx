import { Notification, type NotificationType } from "@/components/ui/overlays/notification";
import { useNotify } from "@quarto-raggio/react-notification-context";

export function useNotification() {
  const { customNotify, clear, remove } = useNotify();
  const notify = (type: NotificationType, title: string, description?: string) => {
    customNotify(Notification, (p) => ({ type, title, description, remove: p.remove }))
  };
  return { clear, remove, notify, customNotify };
}