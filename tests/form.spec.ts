/// <reference types="vitest" />
// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    CotomyApi,
    CotomyApiResponse,
    CotomyConflictException,
    CotomyRequestInvalidException
} from "../src/api";
import {
    CotomyApiForm,
    CotomyEntityApiForm,
    CotomyEntityFillApiForm
} from "../src/form";
import { CotomyElement, CotomyWindow } from "../src/view";

(globalThis as any).HTMLElement = (globalThis as any).HTMLElement ?? window.HTMLElement;

class TestApiForm extends CotomyApiForm {
    public constructor() {
        const form = document.createElement("form");
        form.setAttribute("action", "/submit");
        super(form);
    }

    public setClient(client: CotomyApi) {
        this._client = client;
    }

    protected override apiClient(): CotomyApi {
        return this._client ?? super.apiClient();
    }

    private _client: CotomyApi | null = null;
}

class TestEntityForm extends CotomyEntityApiForm {
    public constructor() {
        const form = document.createElement("form");
        form.setAttribute("action", "https://api.example.com/users");
        super(form);
    }

    public exposeSetExternalKey(response: CotomyApiResponse) {
        return this.setExternalKey(response);
    }

    public setKeyAttribute(value: string) {
        this.attribute("data-cotomy-key", value);
    }
}

describe("CotomyApiForm", () => {
    beforeEach(() => {
        (globalThis as any).HTMLElement = (globalThis as any).HTMLElement ?? window.HTMLElement;
        document.body.innerHTML = "";
        CotomyWindow.instance.initialize();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("converts datetime-local inputs to ISO strings in formData", async () => {
        const form = new TestApiForm();
        document.body.appendChild(form.element);

        const input = document.createElement("input");
        input.type = "datetime-local";
        input.name = "scheduledAt";
        input.value = "2024-06-01T12:30";
        form.element.appendChild(input);

        const apiMock = {
            submitAsync: vi.fn().mockResolvedValue(new CotomyApiResponse(new Response(null, { status: 200 })))
        } as unknown as CotomyApi;
        form.setClient(apiMock);

        await form.submitAsync();

        const sentFormData = apiMock.submitAsync.mock.calls[0][0].body as FormData;
        expect(sentFormData.get("scheduledAt")).toMatch(/2024-06-01T12:30(?:[:0]{0,3})?\+\d{2}:\d{2}/);
    });

    it("dispatches failure events when API submission throws", async () => {
        const form = new TestApiForm();
        document.body.appendChild(form.element);

        const response = new CotomyApiResponse(new Response("{}", { status: 400, statusText: "Bad Request" }));
        const apiMock = {
            submitAsync: vi.fn().mockRejectedValue(
                new CotomyRequestInvalidException(400, "bad", response, "{}")
            )
        } as unknown as CotomyApi;
        form.setClient(apiMock);

        const apiFailed = vi.fn();
        const submitFailed = vi.fn();
        form.apiFailed(apiFailed);
        form.submitFailed(submitFailed);

        await expect(form.submitAsync()).rejects.toBeInstanceOf(CotomyRequestInvalidException);
        expect(apiFailed).toHaveBeenCalledTimes(1);
        expect(submitFailed).toHaveBeenCalledTimes(1);
    });
});

describe("CotomyEntityApiForm", () => {
    beforeEach(() => {
        (globalThis as any).HTMLElement = (globalThis as any).HTMLElement ?? window.HTMLElement;
        document.body.innerHTML = "";
        CotomyWindow.instance.initialize();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("infers method as PUT when external key exists", () => {
        const form = new TestEntityForm();
        form.setKeyAttribute("123");

        expect((form as unknown as CotomyElement).attribute("data-cotomy-key")).toBe("123");
        expect((form as unknown as { method(): string }).method()).toBe("put");
    });

    it("extracts external key from Location header when required", async () => {
        const form = new TestEntityForm();
        const response = new CotomyApiResponse(new Response(null, {
            status: 201,
            headers: { Location: "https://api.example.com/users/456" }
        }));

        form.exposeSetExternalKey(response);

        expect((form as unknown as CotomyElement).attribute("data-cotomy-key")).toBe("456");
    });
});

describe("CotomyEntityFillApiForm", () => {
    beforeEach(() => {
        (globalThis as any).HTMLElement = (globalThis as any).HTMLElement ?? window.HTMLElement;
        document.body.innerHTML = "";
        CotomyWindow.instance.initialize();
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("fills form inputs from API response payload", async () => {
        const formElement = document.createElement("form");
        formElement.setAttribute("action", "/users");
        formElement.innerHTML = `
            <input type="text" name="user[name]" />
            <input type="checkbox" name="user[active]" />
        `;
        const form = new CotomyEntityFillApiForm(formElement);
        form.attribute("data-cotomy-key", "123");
        document.body.appendChild(form.element);
        form.initialize();

        const responseBody = { user: { name: "Alice", active: true } };
        const apiResponse = new Response(JSON.stringify(responseBody), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(apiResponse);

        await form.reloadAsync();

        const nameInput = form.find('input[name="user[name]"]')[0];
        const activeInput = form.find('input[name="user[active]"]')[0];
        expect(nameInput.value).toBe("Alice");
        expect(activeInput.attribute("checked")).toBe("");
    });

    it("suppresses API failure by dispatching event and rethrowing when necessary", async () => {
        const formElement = document.createElement("form");
        formElement.setAttribute("action", "/users");
        const form = new CotomyEntityFillApiForm(formElement);
        form.attribute("data-cotomy-key", "123");
        document.body.appendChild(form.element);
        form.initialize();

        const conflictResponse = new Response("{}", { status: 409, statusText: "Conflict" });
        (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(conflictResponse);

        const handler = vi.fn();
        form.apiFailed(handler);

        await expect(form.reloadAsync()).rejects.toBeInstanceOf(CotomyConflictException);
        expect(handler).toHaveBeenCalledTimes(1);
    });
});
