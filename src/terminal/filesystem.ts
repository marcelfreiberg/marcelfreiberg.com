import type { FileSystem, FsEntry } from "./types";

function today(): string {
  const d = new Date();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = months[d.getMonth()];
  const day = String(d.getDate()).padStart(2, " ");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${month} ${day} ${hours}:${minutes}`;
}

export function createFileSystem(): FileSystem {
  return {
    "~/about.txt": {
      kind: "file",
      content: [
        "",
        "  \x1b[1;38;2;201;185;154mMarcel Freiberg\x1b[0m",
        "  \x1b[38;2;229;229;229mML & Computer Vision Engineer\x1b[0m",
        "",
        "  \x1b[38;2;115;115;115mBuilding intelligent systems that see and understand.\x1b[0m",
        "  \x1b[38;2;115;115;115mTraining models & solving problems.\x1b[0m",
        "",
      ].join("\r\n"),
      permissions: "-rw-r--r--",
      size: "142",
      builtIn: true,
    },
    "~/skills.txt": {
      kind: "file",
      content: [
        "",
        "  \x1b[1;38;2;201;185;154mSkills\x1b[0m",
        "",
        "  \x1b[38;2;229;229;229m•\x1b[0m Deep Learning",
        "  \x1b[38;2;229;229;229m•\x1b[0m Computer Vision",
        "  \x1b[38;2;229;229;229m•\x1b[0m Neural Networks",
        "  \x1b[38;2;229;229;229m•\x1b[0m MLOps",
        "",
      ].join("\r\n"),
      permissions: "-rw-r--r--",
      size: "96",
      builtIn: true,
    },
    "~/contact.txt": {
      kind: "file",
      content: [
        "",
        "  \x1b[1;38;2;201;185;154mContact\x1b[0m",
        "",
        "  \x1b[38;2;229;229;229mGitHub\x1b[0m     \x1b[38;2;115;115;115mgithub.com/marcelfreiberg\x1b[0m",
        "  \x1b[38;2;229;229;229mLinkedIn\x1b[0m   \x1b[38;2;115;115;115mlinkedin.com/in/marcelfreiberg\x1b[0m",
        "  \x1b[38;2;229;229;229mEmail\x1b[0m      \x1b[38;2;115;115;115mhello@marcelfreiberg.com\x1b[0m",
        "",
      ].join("\r\n"),
      permissions: "-rw-r--r--",
      size: "87",
      builtIn: true,
    },
    "~/photo.jpg": {
      kind: "file",
      content: "",
      binary: true,
      windowId: "photo",
      permissions: "-rw-r--r--",
      size: "2.1M",
      builtIn: true,
    },
    "~/projects": {
      kind: "dir",
      permissions: "drwxr-xr-x",
      builtIn: true,
    },
    "~/projects/readme.txt": {
      kind: "file",
      content: [
        "",
        "  \x1b[38;2;115;115;115mComing soon...\x1b[0m",
        "",
      ].join("\r\n"),
      permissions: "-rw-r--r--",
      size: "24",
      builtIn: true,
    },
  };
}

export function resolvePath(cwd: string, input: string): string {
  // Handle ~ as root/home
  let path = input.replace(/^~/, "~");
  if (path === "/" || path === "") path = "~";

  // Absolute path
  if (path.startsWith("~")) {
    // already absolute
  } else {
    // Relative path
    path = cwd === "~" ? `~/${path}` : `${cwd}/${path}`;
  }

  // Normalize . and ..
  const parts = path.split("/");
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      if (resolved.length > 1) resolved.pop();
      // If at ~, stay at ~
    } else {
      resolved.push(part);
    }
  }

  // Remove trailing slash
  let result = resolved.join("/");
  if (result === "") result = "~";
  return result;
}

export function listDir(fs: FileSystem, dirPath: string): string[] {
  const prefix = dirPath === "~" ? "~/" : `${dirPath}/`;
  const entries: string[] = [];

  for (const key of Object.keys(fs)) {
    if (!key.startsWith(prefix)) continue;
    const rest = key.slice(prefix.length);
    // Only direct children (no deeper nesting)
    if (rest.includes("/")) continue;
    entries.push(rest);
  }

  return entries.sort();
}

export function formatLs(
  fs: FileSystem,
  dirPath: string,
  entries: string[],
  long: boolean
): string {
  const date = today();
  const lines: string[] = [""];

  if (long) {
    lines.push(`total ${entries.length}`);
  }

  for (const name of entries) {
    const fullPath = dirPath === "~" ? `~/${name}` : `${dirPath}/${name}`;
    const entry = fs[fullPath];
    if (!entry) continue;

    if (long) {
      const perm = entry.permissions;
      const size =
        entry.kind === "file" ? entry.size.padStart(6) : "  4096";
      const coloredName = colorEntry(name, entry);
      lines.push(
        `  ${perm}  marcel  marcel  ${size}  ${date}  ${coloredName}`
      );
    } else {
      lines.push(`  ${colorEntry(name, entry)}`);
    }
  }

  lines.push("");
  return lines.join("\r\n");
}

function colorEntry(name: string, entry: FsEntry): string {
  if (entry.kind === "dir") {
    return `\x1b[1;38;2;100;149;237m${name}/\x1b[0m`;
  }
  if (entry.kind === "file" && entry.binary) {
    return `\x1b[38;2;201;185;154m${name}\x1b[0m`;
  }
  return `\x1b[38;2;229;229;229m${name}\x1b[0m`;
}

export function fakeBinaryDump(): string {
  const chunks = [
    "\x1b[38;2;80;80;80m",
    "ELF\x00\x02\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
    "\x7fJFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdb",
    "\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t",
    "\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d",
    "\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' \",#\x1c\x1c(7),01444",
    "\x1f\'9=82<.342\xff\xc0\x00\x11\x08\x02\x00\x02\x00\x03",
    "\x1b[0m",
  ];
  return chunks.join("");
}
