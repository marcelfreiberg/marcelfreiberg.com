import type { TerminalIO, WindowCommand } from "./types";
import { createShellEngine } from "./shell-engine";

export type { WindowCommand } from "./types";

export function attachShell(
  term: TerminalIO,
  onWindowCommand: (cmd: WindowCommand) => void
) {
  const engine = createShellEngine();
  let inputBuffer = "";

  term.write(engine.motd);
  term.write(engine.prompt());

  const onDataDisposable = term.onData((data: string) => {
    if (data === "\r") {
      term.write("\r\n");
      if (inputBuffer.trim()) {
        const result = engine.execute(inputBuffer);
        switch (result.type) {
          case "output":
            if (result.text) term.write(result.text);
            break;
          case "clear":
            term.write("\x1b[2J\x1b[H");
            break;
          case "open-window":
            term.write(
              `\x1b[38;2;115;115;115mOpening ${result.windowId}...\x1b[0m\r\n`
            );
            onWindowCommand(result);
            break;
        }
      }
      inputBuffer = "";
      term.write(engine.prompt());
    } else if (data === "\x7f") {
      if (inputBuffer.length > 0) {
        inputBuffer = inputBuffer.slice(0, -1);
        term.write("\b \b");
      }
    } else if (data === "\x03") {
      inputBuffer = "";
      term.write("^C\r\n");
      term.write(engine.prompt());
    } else if (data >= " ") {
      inputBuffer += data;
      term.write(data);
    }
  });

  return () => {
    onDataDisposable.dispose();
  };
}
