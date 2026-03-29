import type { Terminal } from "ghostty-web";

export type WindowCommand = {
  type: "open-window";
  windowId: string;
};

type CommandResult =
  | { type: "output"; text: string }
  | { type: "clear" }
  | WindowCommand;

type CommandHandler = (args: string[]) => CommandResult;

const MOTD = [
  "\x1b[1;38;2;201;185;154m Marcel Freiberg \x1b[0m",
  " \x1b[38;2;115;115;115mML & Computer Vision Engineer\x1b[0m",
  "",
  " \x1b[38;2;115;115;115mType \x1b[38;2;201;185;154mhelp\x1b[38;2;115;115;115m for available commands.\x1b[0m",
  "",
].join("\r\n");

const commands: Record<string, CommandHandler> = {
  help: () => ({
    type: "output",
    text: [
      "",
      "  \x1b[1;38;2;201;185;154mAvailable commands:\x1b[0m",
      "",
      "  \x1b[38;2;229;229;229mwhoami\x1b[0m     \x1b[38;2;115;115;115m— About me\x1b[0m",
      "  \x1b[38;2;229;229;229mskills\x1b[0m     \x1b[38;2;115;115;115m— What I work with\x1b[0m",
      "  \x1b[38;2;229;229;229mcontact\x1b[0m    \x1b[38;2;115;115;115m— How to reach me\x1b[0m",
      "  \x1b[38;2;229;229;229mphoto\x1b[0m      \x1b[38;2;115;115;115m— See what I look like\x1b[0m",
      "  \x1b[38;2;229;229;229mprojects\x1b[0m   \x1b[38;2;115;115;115m— Things I've built\x1b[0m",
      "  \x1b[38;2;229;229;229mclear\x1b[0m      \x1b[38;2;115;115;115m— Clear the terminal\x1b[0m",
      "",
    ].join("\r\n"),
  }),

  whoami: () => ({
    type: "output",
    text: [
      "",
      "  \x1b[1;38;2;201;185;154mMarcel Freiberg\x1b[0m",
      "  \x1b[38;2;229;229;229mML & Computer Vision Engineer\x1b[0m",
      "",
      "  \x1b[38;2;115;115;115mBuilding intelligent systems that see and understand.\x1b[0m",
      "  \x1b[38;2;115;115;115mTraining models & solving problems.\x1b[0m",
      "",
    ].join("\r\n"),
  }),

  skills: () => ({
    type: "output",
    text: [
      "",
      "  \x1b[1;38;2;201;185;154mSkills\x1b[0m",
      "",
      "  \x1b[38;2;229;229;229m•\x1b[0m Deep Learning",
      "  \x1b[38;2;229;229;229m•\x1b[0m Computer Vision",
      "  \x1b[38;2;229;229;229m•\x1b[0m Neural Networks",
      "  \x1b[38;2;229;229;229m•\x1b[0m MLOps",
      "",
    ].join("\r\n"),
  }),

  contact: () => ({
    type: "output",
    text: [
      "",
      "  \x1b[1;38;2;201;185;154mContact\x1b[0m",
      "",
      "  \x1b[38;2;229;229;229mGitHub\x1b[0m     \x1b[38;2;115;115;115mgithub.com/marcelfreiberg\x1b[0m",
      "  \x1b[38;2;229;229;229mLinkedIn\x1b[0m   \x1b[38;2;115;115;115mlinkedin.com/in/marcelfreiberg\x1b[0m",
      "  \x1b[38;2;229;229;229mEmail\x1b[0m      \x1b[38;2;115;115;115mhello@marcelfreiberg.com\x1b[0m",
      "",
    ].join("\r\n"),
  }),

  photo: () => ({
    type: "open-window",
    windowId: "photo",
  }),

  projects: () => ({
    type: "open-window",
    windowId: "projects",
  }),

  clear: () => ({
    type: "clear",
  }),
};

const PROMPT = "\x1b[38;2;115;115;115m$\x1b[0m ";

export function attachShell(
  term: Terminal,
  onWindowCommand: (cmd: WindowCommand) => void
) {
  let inputBuffer = "";

  term.write(MOTD);
  term.write(PROMPT);

  const onDataDisposable = term.onData((data: string) => {
    if (data === "\r") {
      term.write("\r\n");
      const trimmed = inputBuffer.trim();
      if (trimmed) {
        const [cmd, ...args] = trimmed.split(/\s+/);
        const handler = commands[cmd];
        if (handler) {
          const result = handler(args);
          switch (result.type) {
            case "output":
              term.write(result.text);
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
        } else {
          term.write(
            `\x1b[38;2;115;115;115mcommand not found: ${cmd}\x1b[0m\r\n`
          );
        }
      }
      inputBuffer = "";
      term.write(PROMPT);
    } else if (data === "\x7f") {
      if (inputBuffer.length > 0) {
        inputBuffer = inputBuffer.slice(0, -1);
        term.write("\b \b");
      }
    } else if (data === "\x03") {
      // Ctrl+C
      inputBuffer = "";
      term.write("^C\r\n");
      term.write(PROMPT);
    } else if (data >= " ") {
      inputBuffer += data;
      term.write(data);
    }
  });

  return () => {
    onDataDisposable.dispose();
  };
}
