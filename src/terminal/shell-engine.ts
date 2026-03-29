import type { FileSystem, CommandResult } from "./types";
import {
  createFileSystem,
  resolvePath,
  listDir,
  formatLs,
  fakeBinaryDump,
} from "./filesystem";

export interface ShellState {
  readonly cwd: string;
  readonly fs: FileSystem;
}

export interface ShellEngine {
  execute(input: string): CommandResult;
  readonly state: ShellState;
  readonly motd: string;
  prompt(): string;
}

const MOTD = [
  "\x1b[1;38;2;201;185;154m Marcel Freiberg \x1b[0m",
  " \x1b[38;2;115;115;115mML & Computer Vision Engineer\x1b[0m",
  "",
  " \x1b[38;2;115;115;115mType \x1b[38;2;201;185;154mhelp\x1b[38;2;115;115;115m for available commands.\x1b[0m",
  "",
].join("\r\n");

const PROMPT_PREFIX = "\x1b[38;2;201;185;154mmarcel\x1b[38;2;115;115;115m:";
const PROMPT_SUFFIX = "\x1b[38;2;115;115;115m$ \x1b[0m";

const playfulDenials: Record<string, string> = {
  sudo: "nice try, but this is my computer",
  chown: "you can look, but you can't own",
  chmod: "permissions are fine the way they are, thanks",
  chgrp: "there's only one group here, and you're not in it",
  su: "there's only one user here, and it's me",
  apt: "this machine runs on vibes, not packages",
  "apt-get": "this machine runs on vibes, not packages",
  brew: "no beverages allowed in the terminal",
  pip: "we don't pip here",
  npm: "node_modules? in this economy?",
  yarn: "no yarn. only threads of thought",
  vi: "let's not go there",
  vim: "let's not go there",
  nano: "there are no editors here, only truth",
  emacs: "we don't have that kind of time",
  exit: "you can check out any time you like, but you can never leave",
  shutdown: "you wouldn't shut down someone's portfolio, would you?",
  reboot: "have you tried refreshing the page?",
  kill: "nothing to kill, everything is already dead inside",
  dd: "absolutely not",
  wget: "the internet is already here",
  curl: "try clicking a link like a normal person",
  ssh: "you're already inside",
  ping: "pong",
  top: "i'm always on top",
  htop: "i'm always on top",
  man: "no manual needed, just type help",
  grep: "you can look with your eyes",
  find: "everything you need is right here in ~",
};

const helpText = [
  "",
  "  \x1b[1;38;2;201;185;154mAvailable commands:\x1b[0m",
  "",
  "  \x1b[38;2;229;229;229mls\x1b[0m         \x1b[38;2;115;115;115m— List directory contents\x1b[0m",
  "  \x1b[38;2;229;229;229mls -al\x1b[0m     \x1b[38;2;115;115;115m— Detailed list view\x1b[0m",
  "  \x1b[38;2;229;229;229mcat\x1b[0m        \x1b[38;2;115;115;115m— Print file contents\x1b[0m",
  "  \x1b[38;2;229;229;229mopen\x1b[0m       \x1b[38;2;115;115;115m— Open a file\x1b[0m",
  "  \x1b[38;2;229;229;229mcd\x1b[0m         \x1b[38;2;115;115;115m— Change directory\x1b[0m",
  "  \x1b[38;2;229;229;229mpwd\x1b[0m        \x1b[38;2;115;115;115m— Print working directory\x1b[0m",
  "  \x1b[38;2;229;229;229mwhoami\x1b[0m     \x1b[38;2;115;115;115m— Who are you logged in as?\x1b[0m",
  "  \x1b[38;2;229;229;229mtouch\x1b[0m      \x1b[38;2;115;115;115m— Create a file\x1b[0m",
  "  \x1b[38;2;229;229;229mmkdir\x1b[0m      \x1b[38;2;115;115;115m— Create a directory\x1b[0m",
  "  \x1b[38;2;229;229;229mrm\x1b[0m         \x1b[38;2;115;115;115m— Remove a file\x1b[0m",
  "  \x1b[38;2;229;229;229mclear\x1b[0m      \x1b[38;2;115;115;115m— Clear the terminal\x1b[0m",
  "  \x1b[38;2;229;229;229mhelp\x1b[0m       \x1b[38;2;115;115;115m— Show this help\x1b[0m",
  "",
].join("\r\n");

export function createShellEngine(initialFs?: FileSystem): ShellEngine {
  const fs = initialFs ?? createFileSystem();
  let cwd = "~";

  return {
    get state() {
      return { cwd, fs };
    },
    get motd() {
      return MOTD;
    },
    prompt() {
      return `${PROMPT_PREFIX}${cwd}${PROMPT_SUFFIX}`;
    },
    execute(input: string): CommandResult {
      const trimmed = input.trim();
      if (!trimmed) {
        return { type: "output", text: "" };
      }
      const [cmd, ...args] = trimmed.split(/\s+/);
      return executeCommand(fs, cmd, args);
    },
  };

  function executeCommand(
    fs: FileSystem,
    cmd: string,
    args: string[]
  ): CommandResult {
    if (cmd in playfulDenials) {
      return {
        type: "output",
        text: `\x1b[38;2;201;185;154m${playfulDenials[cmd]}\x1b[0m\r\n`,
      };
    }

    switch (cmd) {
      case "ls":
        return handleLs(fs, cwd, args);
      case "cat":
        return handleCat(fs, cwd, args);
      case "open":
        return handleOpen(fs, cwd, args);
      case "cd":
        return handleCd(fs, args);
      case "pwd":
        return { type: "output", text: `${cwd}\r\n` };
      case "whoami":
        return { type: "output", text: "marcel\r\n" };
      case "touch":
        return handleTouch(fs, cwd, args);
      case "mkdir":
        return handleMkdir(fs, cwd, args);
      case "rm":
        return handleRm(fs, cwd, args);
      case "clear":
        return { type: "clear" };
      case "help":
        return { type: "output", text: helpText };
      case "echo":
        return { type: "output", text: `${args.join(" ")}\r\n` };
      default:
        return {
          type: "output",
          text: `\x1b[38;2;115;115;115mcommand not found: ${cmd}\x1b[0m\r\n`,
        };
    }
  }

  function handleLs(
    fs: FileSystem,
    cwd: string,
    args: string[]
  ): CommandResult {
    const long = args.includes("-al") || args.includes("-la") || args.includes("-l");
    const pathArgs = args.filter((a) => !a.startsWith("-"));
    const targetPath = pathArgs.length > 0 ? resolvePath(cwd, pathArgs[0]) : cwd;

    if (targetPath !== "~") {
      const entry = fs[targetPath];
      if (!entry) {
        return {
          type: "output",
          text: `ls: cannot access '${pathArgs[0] || targetPath}': No such file or directory\r\n`,
        };
      }
      if (entry.kind === "file") {
        if (long) {
          const date = new Date();
          const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          const m = months[date.getMonth()];
          const d = String(date.getDate()).padStart(2, " ");
          const h = String(date.getHours()).padStart(2, "0");
          const min = String(date.getMinutes()).padStart(2, "0");
          const dateStr = `${m} ${d} ${h}:${min}`;
          return {
            type: "output",
            text: `\r\n  ${entry.permissions}  marcel  marcel  ${entry.size.padStart(6)}  ${dateStr}  \x1b[38;2;229;229;229m${pathArgs[0]}\x1b[0m\r\n\r\n`,
          };
        }
        return {
          type: "output",
          text: `  \x1b[38;2;229;229;229m${pathArgs[0]}\x1b[0m\r\n`,
        };
      }
    }

    const entries = listDir(fs, targetPath);
    if (entries.length === 0) {
      return { type: "output", text: "" };
    }
    return {
      type: "output",
      text: formatLs(fs, targetPath, entries, long),
    };
  }

  function handleCat(
    fs: FileSystem,
    cwd: string,
    args: string[]
  ): CommandResult {
    if (args.length === 0) {
      return { type: "output", text: "cat: missing operand\r\n" };
    }
    const path = resolvePath(cwd, args[0]);
    const entry = fs[path];
    if (!entry) {
      return {
        type: "output",
        text: `cat: ${args[0]}: No such file or directory\r\n`,
      };
    }
    if (entry.kind === "dir") {
      return {
        type: "output",
        text: `cat: ${args[0]}: Is a directory\r\n`,
      };
    }
    if (entry.binary) {
      return {
        type: "output",
        text: `${fakeBinaryDump()}\r\n`,
      };
    }
    return { type: "output", text: entry.content };
  }

  function handleOpen(
    fs: FileSystem,
    cwd: string,
    args: string[]
  ): CommandResult {
    if (args.length === 0) {
      return { type: "output", text: "open: missing operand\r\n" };
    }
    const path = resolvePath(cwd, args[0]);
    const entry = fs[path];
    if (!entry) {
      return {
        type: "output",
        text: `open: ${args[0]}: No such file or directory\r\n`,
      };
    }
    if (entry.kind === "file" && entry.windowId) {
      return { type: "open-window", windowId: entry.windowId };
    }
    return {
      type: "output",
      text: `open: ${args[0]}: No application available to open this file\r\n`,
    };
  }

  function handleCd(
    fs: FileSystem,
    args: string[]
  ): CommandResult {
    if (args.length === 0 || args[0] === "~" || args[0] === "/") {
      cwd = "~";
      return { type: "output", text: "" };
    }
    const target = resolvePath(cwd, args[0]);
    if (target === "~") {
      cwd = "~";
      return { type: "output", text: "" };
    }
    const entry = fs[target];
    if (!entry) {
      return {
        type: "output",
        text: `cd: ${args[0]}: No such file or directory\r\n`,
      };
    }
    if (entry.kind !== "dir") {
      return {
        type: "output",
        text: `cd: ${args[0]}: Not a directory\r\n`,
      };
    }
    cwd = target;
    return { type: "output", text: "" };
  }

  function handleTouch(
    fs: FileSystem,
    cwd: string,
    args: string[]
  ): CommandResult {
    if (args.length === 0) {
      return { type: "output", text: "touch: missing operand\r\n" };
    }
    const name = args[0];
    if (name.includes("/")) {
      return {
        type: "output",
        text: `touch: cannot touch '${name}': No such file or directory\r\n`,
      };
    }
    const path = resolvePath(cwd, name);
    if (fs[path]) {
      return { type: "output", text: "" };
    }
    fs[path] = {
      kind: "file",
      content: "",
      permissions: "-rw-r--r--",
      size: "0",
      builtIn: false,
    };
    return { type: "output", text: "" };
  }

  function handleMkdir(
    fs: FileSystem,
    cwd: string,
    args: string[]
  ): CommandResult {
    if (args.length === 0) {
      return { type: "output", text: "mkdir: missing operand\r\n" };
    }
    const name = args[0];
    if (name.includes("/")) {
      return {
        type: "output",
        text: `mkdir: cannot create directory '${name}': No such file or directory\r\n`,
      };
    }
    const path = resolvePath(cwd, name);
    if (fs[path]) {
      return {
        type: "output",
        text: `mkdir: cannot create directory '${name}': File exists\r\n`,
      };
    }
    fs[path] = {
      kind: "dir",
      permissions: "drwxr-xr-x",
      builtIn: false,
    };
    return { type: "output", text: "" };
  }

  function handleRm(
    fs: FileSystem,
    cwd: string,
    args: string[]
  ): CommandResult {
    if (args.length === 0) {
      return { type: "output", text: "rm: missing operand\r\n" };
    }

    const flags = args.filter((a) => a.startsWith("-"));
    const targets = args.filter((a) => !a.startsWith("-"));
    const recursive = flags.some((f) => f.includes("r"));
    const force = flags.some((f) => f.includes("f"));

    if (
      recursive &&
      targets.some((t) => t === "/" || t === "~" || t === "*")
    ) {
      return {
        type: "output",
        text: `\x1b[38;2;201;185;154mnice try. i'm not going anywhere.\x1b[0m\r\n`,
      };
    }

    if (targets.length === 0) {
      return { type: "output", text: "rm: missing operand\r\n" };
    }

    const name = targets[0];
    const path = resolvePath(cwd, name);
    const entry = fs[path];

    if (!entry) {
      if (force) return { type: "output", text: "" };
      return {
        type: "output",
        text: `rm: cannot remove '${name}': No such file or directory\r\n`,
      };
    }

    if (entry.builtIn) {
      return {
        type: "output",
        text: `\x1b[38;2;201;185;154mthat's mine, hands off.\x1b[0m\r\n`,
      };
    }

    if (entry.kind === "dir" && !recursive) {
      return {
        type: "output",
        text: `rm: cannot remove '${name}': Is a directory\r\n`,
      };
    }

    if (entry.kind === "dir") {
      const prefix = `${path}/`;
      for (const key of Object.keys(fs)) {
        if (key.startsWith(prefix)) delete fs[key];
      }
    }
    delete fs[path];
    return { type: "output", text: "" };
  }
}
