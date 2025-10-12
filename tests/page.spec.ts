/// <reference types="vitest" />
// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CotomyUrl } from "../src/page";

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
