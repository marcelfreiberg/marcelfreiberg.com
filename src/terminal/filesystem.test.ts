import { describe, test, expect } from "vitest";
import { resolvePath, listDir } from "./filesystem";
import { createShellEngine } from "./shell-engine";
import type { FileSystem } from "./types";

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
    const shell = createShellEngine();
    const result = shell.execute("cd about.txt");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("Not a directory"),
    });
  });

  test("cd .. from root stays at ~", () => {
    const shell = createShellEngine();
    shell.execute("cd ..");
    expect(shell.state.cwd).toBe("~");
    shell.execute("cd ../../..");
    expect(shell.state.cwd).toBe("~");
  });

  test("cat a directory returns Is a directory", () => {
    const shell = createShellEngine();
    const result = shell.execute("cat projects");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("Is a directory"),
    });
  });

  test("cat a binary file returns fake binary dump", () => {
    const shell = createShellEngine();
    const result = shell.execute("cat photo.jpg");
    expect(result.type).toBe("output");
    if (result.type === "output") {
      expect(result.text).toContain("JFIF");
    }
  });

  test("cat non-existent file returns error", () => {
    const shell = createShellEngine();
    const result = shell.execute("cat nope.txt");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("No such file or directory"),
    });
  });

  test("cat with no arguments returns missing operand", () => {
    const shell = createShellEngine();
    const result = shell.execute("cat");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("missing operand"),
    });
  });

  test("rm built-in file is denied", () => {
    const shell = createShellEngine();
    const result = shell.execute("rm about.txt");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("hands off"),
    });
    // File should still exist
    const cat = shell.execute("cat about.txt");
    expect(cat.type).toBe("output");
    if (cat.type === "output") {
      expect(cat.text).not.toContain("No such file");
    }
  });

  test("rm -rf ~ is denied", () => {
    const shell = createShellEngine();
    const result = shell.execute("rm -rf ~");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("not going anywhere"),
    });
  });

  test("rm -rf / is denied", () => {
    const shell = createShellEngine();
    const result = shell.execute("rm -rf /");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("not going anywhere"),
    });
  });

  test("rm directory without -r returns error", () => {
    const shell = createShellEngine();
    shell.execute("mkdir testdir");
    const result = shell.execute("rm testdir");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("Is a directory"),
    });
  });

  test("rm -f non-existent file is silent", () => {
    const shell = createShellEngine();
    const result = shell.execute("rm -f nope.txt");
    expect(result).toEqual({ type: "output", text: "" });
  });

  test("rm -r directory removes children too", () => {
    const shell = createShellEngine();
    shell.execute("mkdir mydir");
    shell.execute("cd mydir");
    shell.execute("touch file1.txt");
    shell.execute("touch file2.txt");
    shell.execute("cd ~");
    const result = shell.execute("rm -r mydir");
    expect(result).toEqual({ type: "output", text: "" });
    // Directory and children should be gone
    const ls = shell.execute("ls mydir");
    expect(ls).toEqual({
      type: "output",
      text: expect.stringContaining("No such file or directory"),
    });
  });

  test("rm with no arguments returns missing operand", () => {
    const shell = createShellEngine();
    const result = shell.execute("rm");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("missing operand"),
    });
  });

  test("touch with slashes returns error", () => {
    const shell = createShellEngine();
    const result = shell.execute("touch path/to/file.txt");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("No such file or directory"),
    });
  });

  test("touch existing file is a no-op", () => {
    const shell = createShellEngine();
    shell.execute("touch myfile.txt");
    const result = shell.execute("touch myfile.txt");
    expect(result).toEqual({ type: "output", text: "" });
  });

  test("touch with no arguments returns missing operand", () => {
    const shell = createShellEngine();
    const result = shell.execute("touch");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("missing operand"),
    });
  });

  test("mkdir existing name returns File exists error", () => {
    const shell = createShellEngine();
    shell.execute("mkdir testdir");
    const result = shell.execute("mkdir testdir");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("File exists"),
    });
  });

  test("mkdir with slashes returns error", () => {
    const shell = createShellEngine();
    const result = shell.execute("mkdir path/to/dir");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("No such file or directory"),
    });
  });

  test("mkdir with no arguments returns missing operand", () => {
    const shell = createShellEngine();
    const result = shell.execute("mkdir");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("missing operand"),
    });
  });

  test("ls non-existent path returns error", () => {
    const shell = createShellEngine();
    const result = shell.execute("ls nope");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("No such file or directory"),
    });
  });

  test("ls on a single file shows just the file", () => {
    const shell = createShellEngine();
    const result = shell.execute("ls about.txt");
    expect(result.type).toBe("output");
    if (result.type === "output") {
      expect(result.text).toContain("about.txt");
    }
  });

  test("ls -al on a single file shows permissions and size", () => {
    const shell = createShellEngine();
    const result = shell.execute("ls -al about.txt");
    expect(result.type).toBe("output");
    if (result.type === "output") {
      expect(result.text).toContain("-rw-r--r--");
      expect(result.text).toContain("about.txt");
    }
  });
});
