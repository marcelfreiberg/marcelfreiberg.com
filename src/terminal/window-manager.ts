export type WindowEvent =
  | { type: "opened"; windowId: string }
  | { type: "closed"; windowId: string }
  | { type: "focused"; windowId: string };

export type WindowEventListener = (event: WindowEvent) => void;

export interface WindowManager {
  open(windowId: string): "opened" | "focused" | "unknown";
  close(windowId: string): boolean;
  isOpen(windowId: string): boolean;
  subscribe(listener: WindowEventListener): () => void;
}

export function createWindowManager(
  validIds: ReadonlySet<string>,
): WindowManager {
  const open = new Set<string>();
  const listeners = new Set<WindowEventListener>();

  function emit(event: WindowEvent) {
    for (const listener of listeners) {
      listener(event);
    }
  }

  return {
    open(windowId) {
      if (!validIds.has(windowId)) return "unknown";
      if (open.has(windowId)) {
        emit({ type: "focused", windowId });
        return "focused";
      }
      open.add(windowId);
      emit({ type: "opened", windowId });
      return "opened";
    },

    close(windowId) {
      if (!open.delete(windowId)) return false;
      emit({ type: "closed", windowId });
      return true;
    },

    isOpen(windowId) {
      return open.has(windowId);
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
