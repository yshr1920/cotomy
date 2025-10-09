/// <reference types="vitest" />
// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    CotomyApi,
    CotomyApiResponse,
    CotomyForbiddenException,
    CotomyInvalidFormDataBodyException,
    CotomyNotFoundException,
    CotomyRequestInvalidException,
    CotomyResponseJsonParseException
} from "../src/api";

describe("CotomyApiResponse", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("parses JSON once and caches the result", async () => {
        const text = vi.fn().mockResolvedValue(JSON.stringify({ value: 1 }));
        const response = new CotomyApiResponse({
            ok: true,
            status: 200,
            statusText: "OK",
            headers: new Headers(),
            text
        } as unknown as Response);

        const first = await response.objectAsync();
        const second = await response.objectAsync();

        expect(first).toEqual({ value: 1 });
        expect(second).toBe(first);
        expect(text).toHaveBeenCalledTimes(1);
    });

    it("throws when JSON parsing fails", async () => {
        const response = new CotomyApiResponse({
            ok: true,
            status: 200,
            statusText: "OK",
            headers: new Headers(),
            text: vi.fn().mockResolvedValue("invalid json")
        } as unknown as Response);

        await expect(response.objectAsync()).rejects.toBeInstanceOf(CotomyResponseJsonParseException);
    });

    it("returns default array when payload is not an array", async () => {
        const response = new CotomyApiResponse({
            ok: true,
            status: 200,
            statusText: "OK",
            headers: new Headers(),
            text: vi.fn().mockResolvedValue(JSON.stringify({ value: 1 }))
        } as unknown as Response);

        const array = await response.arrayAsync([{ fallback: true }]);
        expect(array).toEqual([{ fallback: true }]);
    });
});

describe("CotomyApi", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("composes request with baseUrl and JSON body", async () => {
        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
            new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } })
        );

        const api = new CotomyApi({
            baseUrl: "https://api.example.com",
            headers: { "Content-Type": "application/json" }
        });

        await api.postAsync("/users", { name: "Alice" });

        expect(fetch).toHaveBeenCalledTimes(1);
        const [url, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
        expect(url).toBe("https://api.example.com/users");
        expect(init?.method).toBe("POST");
        expect(init?.headers?.get("Content-Type")).toBe("application/json");
        expect(init?.body).toBe(JSON.stringify({ name: "Alice" }));
    });

    it("converts multipart/form-data bodies to FormData and removes header", async () => {
        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
            new Response("{}", { status: 200 })
        );

        const api = new CotomyApi({
            baseUrl: "https://api.example.com",
            headers: { "Content-Type": "multipart/form-data" }
        });

        await api.postAsync("/upload", { foo: "bar" });

        const [, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
        expect(init?.headers?.get("Content-Type")).toBeNull();
        expect(init?.body).toBeInstanceOf(FormData);
        expect((init?.body as FormData).get("foo")).toBe("bar");
    });

    it("throws when multipart/form-data body is not an object or FormData", async () => {
        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
            new Response("{}", { status: 200 })
        );
        const api = new CotomyApi({
            headers: { "Content-Type": "multipart/form-data" }
        });

        await expect(api.postAsync("/upload", "invalid" as any))
            .rejects.toBeInstanceOf(CotomyInvalidFormDataBodyException);
        expect(fetch).not.toHaveBeenCalled();
    });

    it("creates query strings for GET parameters", async () => {
        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
            new Response("{}", { status: 200 })
        );

        const api = new CotomyApi();
        const params = new FormData();
        params.append("one", "1");
        params.append("two", "2");

        await api.getAsync("/items", params);

        const [url] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
        expect(url).toBe("/items?one=1&two=2");
    });

    it("maps 4xx responses to specific exceptions", async () => {
        const response = new Response(JSON.stringify({ message: "not found" }), {
            status: 404,
            statusText: "Not Found",
            headers: { "Content-Type": "application/json" }
        });
        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(response);

        const api = new CotomyApi();

        await expect(api.getAsync("/missing"))
            .rejects.toBeInstanceOf(CotomyNotFoundException);
    });

    it("maps 403 responses to CotomyForbiddenException", async () => {
        const response = new Response("denied", {
            status: 403,
            statusText: "Forbidden"
        });
        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(response);

        const api = new CotomyApi();

        await expect(api.postAsync("/secure", {}))
            .rejects.toBeInstanceOf(CotomyForbiddenException);
    });

    it("rethrows CotomyApiRequestInvalidException from submitToApiAsync consumers", async () => {
        const response = new Response(JSON.stringify({ error: "invalid" }), {
            status: 422,
            statusText: "Unprocessable Entity",
            headers: { "Content-Type": "application/json" }
        });
        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(response);

        const api = new CotomyApi();

        await expect(api.postAsync("/invalid", { bad: true }))
            .rejects.toBeInstanceOf(CotomyRequestInvalidException);
    });
});
