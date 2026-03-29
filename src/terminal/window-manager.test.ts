import { describe, test, expect } from "vitest";
import { createWindowManager } from "./window-manager";
import { createShellEngine } from "./shell-engine";
import type { WindowEvent } from "./window-manager";

const VALID_IDS = new Set(["photo", "projects"]);

describe("createWindowManager", () => {
  test("open returns 'opened' for a valid, closed window", () => {
    const wm = createWindowManager(VALID_IDS);
    expect(wm.open("photo")).toBe("opened");
    expect(wm.isOpen("photo")).toBe(true);
  });

  test("open returns 'focused' for an already-open window", () => {
    const wm = createWindowManager(VALID_IDS);
    wm.open("photo");
    expect(wm.open("photo")).toBe("focused");
  });

  test("open returns 'unknown' for an unregistered window id", () => {
    const wm = createWindowManager(VALID_IDS);
    expect(wm.open("nonexistent")).toBe("unknown");
  });

  test("close returns true and marks window closed", () => {
    const wm = createWindowManager(VALID_IDS);
    wm.open("photo");
    expect(wm.close("photo")).toBe(true);
    expect(wm.isOpen("photo")).toBe(false);
  });

  test("close returns false for a window that is not open", () => {
    const wm = createWindowManager(VALID_IDS);
    expect(wm.close("photo")).toBe(false);
  });

  test("subscribe receives opened, focused, and closed events", () => {
    const wm = createWindowManager(VALID_IDS);
    const events: WindowEvent[] = [];
    wm.subscribe((e) => events.push(e));

    wm.open("photo");
    wm.open("photo");
    wm.close("photo");

    expect(events).toEqual([
      { type: "opened", windowId: "photo" },
      { type: "focused", windowId: "photo" },
      { type: "closed", windowId: "photo" },
    ]);
  });

  test("unsubscribe stops events", () => {
    const wm = createWindowManager(VALID_IDS);
    const events: WindowEvent[] = [];
    const unsub = wm.subscribe((e) => events.push(e));

    wm.open("photo");
    unsub();
    wm.close("photo");

    expect(events).toEqual([{ type: "opened", windowId: "photo" }]);
  });

  test("no events emitted for no-op close", () => {
    const wm = createWindowManager(VALID_IDS);
    const events: WindowEvent[] = [];
    wm.subscribe((e) => events.push(e));

    wm.close("photo");

    expect(events).toEqual([]);
  });

  test("no events emitted for unknown window open", () => {
    const wm = createWindowManager(VALID_IDS);
    const events: WindowEvent[] = [];
    wm.subscribe((e) => events.push(e));

    wm.open("nonexistent");

    expect(events).toEqual([]);
  });
});

describe("shell + window manager integration", () => {
  test("open command emits opened event", () => {
    const wm = createWindowManager(VALID_IDS);
    const events: WindowEvent[] = [];
    wm.subscribe((e) => events.push(e));
    const shell = createShellEngine(wm);
    const result = shell.execute("open photo.jpg");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("Opening photo"),
    });
    expect(events).toEqual([{ type: "opened", windowId: "photo" }]);
    expect(wm.isOpen("photo")).toBe(true);
  });

  test("opening an already-open window emits focused event", () => {
    const wm = createWindowManager(VALID_IDS);
    const shell = createShellEngine(wm);
    shell.execute("open photo.jpg");
    const events: WindowEvent[] = [];
    wm.subscribe((e) => events.push(e));
    const result = shell.execute("open photo.jpg");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("Focusing photo"),
    });
    expect(events).toEqual([{ type: "focused", windowId: "photo" }]);
  });

  test("close command emits closed event", () => {
    const wm = createWindowManager(VALID_IDS);
    const shell = createShellEngine(wm);
    shell.execute("open photo.jpg");
    const events: WindowEvent[] = [];
    wm.subscribe((e) => events.push(e));
    const result = shell.execute("close photo.jpg");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("Closing photo"),
    });
    expect(events).toEqual([{ type: "closed", windowId: "photo" }]);
    expect(wm.isOpen("photo")).toBe(false);
  });

  test("close a window that is not open returns error", () => {
    const wm = createWindowManager(VALID_IDS);
    const shell = createShellEngine(wm);
    const result = shell.execute("close photo.jpg");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("No window is open"),
    });
  });

  test("close with no arguments returns missing operand", () => {
    const shell = createShellEngine(createWindowManager(VALID_IDS));
    const result = shell.execute("close");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("missing operand"),
    });
  });

  test("after closing, open re-opens the window", () => {
    const wm = createWindowManager(VALID_IDS);
    const shell = createShellEngine(wm);
    shell.execute("open photo.jpg");
    shell.execute("close photo.jpg");
    const events: WindowEvent[] = [];
    wm.subscribe((e) => events.push(e));
    const result = shell.execute("open photo.jpg");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("Opening photo"),
    });
    expect(events).toEqual([{ type: "opened", windowId: "photo" }]);
  });

  test("external close via manager lets shell re-open", () => {
    const wm = createWindowManager(VALID_IDS);
    const shell = createShellEngine(wm);
    shell.execute("open photo.jpg");
    wm.close("photo"); // simulates X button
    const events: WindowEvent[] = [];
    wm.subscribe((e) => events.push(e));
    const result = shell.execute("open photo.jpg");
    expect(result).toEqual({
      type: "output",
      text: expect.stringContaining("Opening photo"),
    });
    expect(events).toEqual([{ type: "opened", windowId: "photo" }]);
  });
});
