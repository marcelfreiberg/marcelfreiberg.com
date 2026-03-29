export type WindowCommand = {
  type: "open-window";
  windowId: string;
};

export type CommandResult =
  | { type: "output"; text: string }
  | { type: "clear" }
  | WindowCommand;

export type FileEntry = {
  kind: "file";
  content: string;
  binary?: boolean;
  windowId?: string;
  permissions: string;
  size: string;
  builtIn: boolean;
};

export type DirEntry = {
  kind: "dir";
  permissions: string;
  builtIn: boolean;
};

export type FsEntry = FileEntry | DirEntry;

export type FileSystem = Record<string, FsEntry>;

/** Minimal terminal surface — what the shell needs from a terminal emulator. */
export interface TerminalIO {
  write(data: string): void;
  onData(cb: (data: string) => void): { dispose(): void };
}
