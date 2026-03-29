import type { TerminalIO } from "./types";
import type { WindowManager } from "./window-manager";
import { createShellEngine } from "./shell-engine";

export function attachShell(term: TerminalIO, wm: WindowManager) {
  const engine = createShellEngine(wm);
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

  return {
    dispose() {
      onDataDisposable.dispose();
    },
  };
}
