import { describe, test, expect } from "vitest";
import { resolvePath, listDir } from "./filesystem";
import { createShellEngine } from "./shell-engine";
import { createWindowManager } from "./window-manager";
import type { FileSystem } from "./types";

const VALID_WINDOW_IDS = new Set(["photo", "projects"]);
function shell() {
  return createShellEngine(createWindowManager(VALID_WINDOW_IDS));
}

describe("resolvePath", () => {
  test("empty string, / and ~ all resolve to home", () => {
    expect(resolvePath("~", "")).toBe("~");
    expect(resolvePath("~", "/")).toBe("~");
    expect(resolvePath("~", "~")).toBe("~");
  });

  test(".. past root stays at ~", () => {
    expect(resolvePath("~", "..")).toBe("~");
    expect(resolvePath("~", "../..")).toBe("~");
    expect(resolvePath("~/projects", "../../..")).toBe("~");
  });

  test("resolves mixed . and .. segments", () => {
    expect(resolvePath("~", "./projects/../about.txt")).toBe("~/about.txt");
    expect(resolvePath("~/projects", ".")).toBe("~/projects");
    expect(resolvePath("~/projects", "./readme.txt")).toBe("~/projects/readme.txt");
    expect(resolvePath("~/projects", "../about.txt")).toBe("~/about.txt");
  });

  test("relative paths from nested cwd", () => {
    expect(resolvePath("~/projects", "readme.txt")).toBe("~/projects/readme.txt");
    expect(resolvePath("~/projects", "sub/file")).toBe("~/projects/sub/file");
  });

  test("trailing slashes are stripped", () => {
    expect(resolvePath("~", "projects/")).toBe("~/projects");
    expect(resolvePath("~", "~/projects/")).toBe("~/projects");
  });

  test("double slashes are normalized", () => {
    expect(resolvePath("~", "projects//readme.txt")).toBe("~/projects/readme.txt");
  });
});

describe("listDir", () => {
  test("empty directory returns empty array", () => {
    const fs: FileSystem = {
      "~/empty": { kind: "dir", permissions: "drwxr-xr-x", builtIn: false },
    };
    expect(listDir(fs, "~/empty")).toEqual([]);
  });

  test("only lists direct children, not grandchildren", () => {
    const fs: FileSystem = {
      "~/a": { kind: "dir", permissions: "drwxr-xr-x", builtIn: false },
      "~/a/b": { kind: "dir", permissions: "drwxr-xr-x", builtIn: false },
      "~/a/b/c.txt": { kind: "file", content: "", permissions: "-rw-r--r--", size: "0", builtIn: false },
      "~/a/file.txt": { kind: "file", content: "", permissions: "-rw-r--r--", size: "0", builtIn: false },
    };
    expect(listDir(fs, "~/a")).toEqual(["b", "file.txt"]);
  });

  test("non-existent directory returns empty array", () => {
    const fs: FileSystem = {};
    expect(listDir(fs, "~/nope")).toEqual([]);
  });
});

describe("shell commands - edge cases", () => {
  test("cd into a file returns Not a directory", () => {
    const s = shell();
    const result = s.execute("cd about.txt");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("Not a directory"),
    });
  });

  test("cd .. from root stays at ~", () => {
    const s = shell();
    s.execute("cd ..");
    expect(s.state.cwd).toBe("~");
    s.execute("cd ../../..");
    expect(s.state.cwd).toBe("~");
  });

  test("cat a directory returns Is a directory", () => {
    const s = shell();
    const result = s.execute("cat projects");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("Is a directory"),
    });
  });

  test("cat a binary file returns fake binary dump", () => {
    const s = shell();
    const result = s.execute("cat photo.jpg");
    expect(result.type).toBe("output");
    if (result.type === "output") {
      expect(result.text).toContain("JFIF");
    }
  });

  test("cat non-existent file returns error", () => {
    const s = shell();
    const result = s.execute("cat nope.txt");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("No such file or directory"),
    });
  });

  test("cat with no arguments returns missing operand", () => {
    const s = shell();
    const result = s.execute("cat");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("missing operand"),
    });
  });

  test("rm built-in file is denied", () => {
    const s = shell();
    const result = s.execute("rm about.txt");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("hands off"),
    });
    const cat = s.execute("cat about.txt");
    expect(cat.type).toBe("output");
    if (cat.type === "output") {
      expect(cat.text).not.toContain("No such file");
    }
  });

  test("rm -rf ~ is denied", () => {
    const s = shell();
    const result = s.execute("rm -rf ~");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("not going anywhere"),
    });
  });

  test("rm -rf / is denied", () => {
    const s = shell();
    const result = s.execute("rm -rf /");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("not going anywhere"),
    });
  });

  test("rm directory without -r returns error", () => {
    const s = shell();
    s.execute("mkdir testdir");
    const result = s.execute("rm testdir");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("Is a directory"),
    });
  });

  test("rm -f non-existent file is silent", () => {
    const s = shell();
    const result = s.execute("rm -f nope.txt");
    expect(result).toEqual({ type: "output", text: "" });
  });

  test("rm -r directory removes children too", () => {
    const s = shell();
    s.execute("mkdir mydir");
    s.execute("cd mydir");
    s.execute("touch file1.txt");
    s.execute("touch file2.txt");
    s.execute("cd ~");
    const result = s.execute("rm -r mydir");
    expect(result).toEqual({ type: "output", text: "" });
    const ls = s.execute("ls mydir");
    expect(ls).toEqual({
      type: "output",
      text: expect.stringContaining("No such file or directory"),
    });
  });

  test("rm with no arguments returns missing operand", () => {
    const s = shell();
    const result = s.execute("rm");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("missing operand"),
    });
  });

  test("touch with slashes returns error", () => {
    const s = shell();
    const result = s.execute("touch path/to/file.txt");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("No such file or directory"),
    });
  });

  test("touch existing file is a no-op", () => {
    const s = shell();
    s.execute("touch myfile.txt");
    const result = s.execute("touch myfile.txt");
    expect(result).toEqual({ type: "output", text: "" });
  });

  test("touch with no arguments returns missing operand", () => {
    const s = shell();
    const result = s.execute("touch");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("missing operand"),
    });
  });

  test("mkdir existing name returns File exists error", () => {
    const s = shell();
    s.execute("mkdir testdir");
    const result = s.execute("mkdir testdir");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("File exists"),
    });
  });

  test("mkdir with slashes returns error", () => {
    const s = shell();
    const result = s.execute("mkdir path/to/dir");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("No such file or directory"),
    });
  });

  test("mkdir with no arguments returns missing operand", () => {
    const s = shell();
    const result = s.execute("mkdir");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("missing operand"),
    });
  });

  test("ls non-existent path returns error", () => {
    const s = shell();
    const result = s.execute("ls nope");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("No such file or directory"),
    });
  });

  test("ls on a single file shows just the file", () => {
    const s = shell();
    const result = s.execute("ls about.txt");
    expect(result.type).toBe("output");
    if (result.type === "output") {
      expect(result.text).toContain("about.txt");
    }
  });

  test("ls -al on a single file shows permissions and size", () => {
    const s = shell();
    const result = s.execute("ls -al about.txt");
    expect(result.type).toBe("output");
    if (result.type === "output") {
      expect(result.text).toContain("-rw-r--r--");
      expect(result.text).toContain("about.txt");
    }
  });
});
