/// <reference types="vitest" />
// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CotomyBracketBindNameGenerator, CotomyDotBindNameGenerator, CotomyViewRenderer } from "../src/api";
import { CotomyPageController, CotomyUrl } from "../src/page";
import { CotomyWindow } from "../src/view";

describe("CotomyUrl", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("uses the current browser location by default", () => {
        const url = new CotomyUrl();
        expect(url.url).toBe(`${window.location.pathname}${window.location.search}`);
        expect(url.path).toBe(window.location.pathname);
    });

    it("parses provided url into components", () => {
        const url = new CotomyUrl("/orders/123/items?sort=asc&filter=active");

        expect(url.url).toBe("/orders/123/items?sort=asc&filter=active");
        expect(url.path).toBe("/orders/123/items");
        expect(url.segments).toEqual(["orders", "123", "items"]);
        expect(url.query).toBe("sort=asc&filter=active");
        expect(url.parameters).toEqual({ sort: "asc", filter: "active" });
    });

    it("redirect updates window location href", () => {
        const originalLocation = window.location;
        let assignedHref = "";
        const fakeLocation = {
            origin: "https://example.test",
            pathname: "/original",
            search: "",
            get href() {
                return assignedHref;
            },
            set href(value: string) {
                assignedHref = value;
            },
            reload: vi.fn(),
            assign: vi.fn(),
            replace: vi.fn()
        } as unknown as Location;

        vi.stubGlobal("location", fakeLocation);

        const url = new CotomyUrl("/next?y=2");
        url.redirect();

        expect(assignedHref).toBe("/next?y=2");
    });

    it("replace calls window.location.replace with correct url", () => {
        const originalLocation = window.location;
        const mockReplace = vi.fn();
        const fakeLocation = {
            origin: "https://example.test",
            pathname: "/original",
            search: "",
            replace: mockReplace,
        } as unknown as Location;

        vi.stubGlobal("location", fakeLocation);

        const url = new CotomyUrl("/replaced?x=1");
        url.replace();

        expect(mockReplace).toHaveBeenCalledWith("/replaced?x=1");

        vi.stubGlobal("location", originalLocation);
    });

    it("replaceState calls window.history.replaceState with correct params", () => {
        const mockReplaceState = vi.fn();
        const originalHistory = window.history;
        vi.stubGlobal("history", { ...originalHistory, replaceState: mockReplaceState });

        const url = new CotomyUrl("/state?z=9");
        url.replaceState({ id: 123 }, "TestTitle");

        expect(mockReplaceState).toHaveBeenCalledWith({ id: 123 }, "TestTitle", "/state?z=9");

        vi.stubGlobal("history", originalHistory);
    });
});

describe("CotomyPageController default bind name generator", () => {
    afterEach(() => {
        CotomyViewRenderer.resetDefaultBindNameGenerator();
    });

    it("updates CotomyViewRenderer default through protected property", () => {
        class TestPageController extends CotomyPageController {
            public setDefaultGenerator(generator: CotomyDotBindNameGenerator | CotomyBracketBindNameGenerator) {
                this.defaultBindNameGenerator = generator;
            }

            public getDefaultGenerator() {
                return this.defaultBindNameGenerator;
            }
        }

        const controller = new TestPageController();
        const dot = new CotomyDotBindNameGenerator();
        controller.setDefaultGenerator(dot);

        expect(controller.getDefaultGenerator()).toBe(dot);
        expect(CotomyViewRenderer.defaultBindNameGenerator).toBe(dot);
    });
});

describe("CotomyPageController initializeAsync pageshow restore", () => {
    class TestPageController extends CotomyPageController {
        public restored = false;

        public async callInitializeAsync() {
            return this.initializeAsync();
        }

        protected override async restoreAsync(): Promise<void> {
            this.restored = true;
        }
    }

    let capturedHandler: ((e: PageTransitionEvent) => void | Promise<void>) | null = null;

    beforeEach(() => {
        capturedHandler = null;
        CotomyWindow.instance.initialize();
        vi.spyOn(CotomyWindow.instance, "pageshow").mockImplementation(function (handler?: any) {
            if (typeof handler === "function") capturedHandler = handler;
            return CotomyWindow.instance;
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("calls restoreAsync when event.persisted is true", async () => {
        const controller = new TestPageController();
        await controller.callInitializeAsync();

        const event = new PageTransitionEvent("pageshow", { persisted: true });
        await capturedHandler!(event);

        expect(controller.restored).toBe(true);
    });

    it("calls restoreAsync when navigation type is back_forward", async () => {
        const controller = new TestPageController();
        await controller.callInitializeAsync();

        vi.spyOn(performance, "getEntriesByType").mockReturnValue([
            { type: "back_forward" } as unknown as PerformanceEntry,
        ]);

        const event = new PageTransitionEvent("pageshow", { persisted: false });
        await capturedHandler!(event);

        expect(controller.restored).toBe(true);
    });

    it("does not call restoreAsync when persisted is false and navigation type is navigate", async () => {
        const controller = new TestPageController();
        await controller.callInitializeAsync();

        vi.spyOn(performance, "getEntriesByType").mockReturnValue([
            { type: "navigate" } as unknown as PerformanceEntry,
        ]);

        const event = new PageTransitionEvent("pageshow", { persisted: false });
        await capturedHandler!(event);

        expect(controller.restored).toBe(false);
    });

    it("does not call restoreAsync when persisted is false and navigation entries are empty", async () => {
        const controller = new TestPageController();
        await controller.callInitializeAsync();

        vi.spyOn(performance, "getEntriesByType").mockReturnValue([]);

        const event = new PageTransitionEvent("pageshow", { persisted: false });
        await capturedHandler!(event);

        expect(controller.restored).toBe(false);
    });
});
