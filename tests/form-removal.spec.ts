/// <reference types="vitest" />
// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { CotomyForm } from "../src/form";
import { CotomyPageController } from "../src/page";
import { CotomyElement, CotomyWindow } from "../src/view";

class TestForm extends CotomyForm {
    public constructor(id: string) {
        super({ tagname: "form" });
        this.attribute("id", id);
    }

    public async submitAsync(): Promise<void> {}
}

class TestPageController extends CotomyPageController {
    public register(form: TestForm) { return this.setForm(form); }
    public lookup(id: string) { return this.getForm(id); }
}

const flushRemoval = async () => { await new Promise(resolve => setTimeout(resolve, 0)); };

describe("registered form removal", () => {
    beforeEach(async () => {
        document.body.innerHTML = "";
        CotomyWindow.instance.initialize();
        await flushRemoval();
    });

    it("unregisters a directly removed form using its original ID", async () => {
        const page = new TestPageController();
        const form = page.register(new TestForm("direct"));
        CotomyWindow.instance.append(form);
        form.remove();
        await flushRemoval();
        expect(page.lookup("direct")).toBeUndefined();
    });

    it("unregisters descendants and notifies each element exactly once", async () => {
        const page = new TestPageController();
        const parent = new CotomyElement({ tagname: "div" });
        const middle = new CotomyElement({ tagname: "section" });
        const first = page.register(new TestForm("first"));
        const second = page.register(new TestForm("second"));
        middle.append(first).append(second);
        parent.append(middle);
        const handlers = [parent, middle, first, second].map(element => {
            const handler = vi.fn();
            element.removed(handler);
            return handler;
        });
        CotomyWindow.instance.append(parent);
        parent.remove();
        await flushRemoval();
        expect(page.lookup("first")).toBeUndefined();
        expect(page.lookup("second")).toBeUndefined();
        handlers.forEach(handler => expect(handler).toHaveBeenCalledTimes(1));
    });

    it("handles removal through a plain DOM ancestor", async () => {
        const page = new TestPageController();
        const parent = document.createElement("div");
        const form = page.register(new TestForm("plain"));
        parent.append(form.element);
        document.body.append(parent);
        parent.remove();
        await flushRemoval();
        expect(page.lookup("plain")).toBeUndefined();
    });

    it("deduplicates a child removed and then reinserted into its removed parent", async () => {
        const parent = new CotomyElement({ tagname: "div" });
        const form = new TestForm("duplicate");
        parent.append(form);
        CotomyWindow.instance.append(parent);
        const handler = vi.fn();
        form.removed(handler);
        form.element.remove();
        parent.element.append(form.element);
        parent.remove();
        await flushRemoval();
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("preserves forms when their ancestor is reattached", async () => {
        const page = new TestPageController();
        const parent = new CotomyElement({ tagname: "div" });
        const form = page.register(new TestForm("reattached"));
        parent.append(form);
        CotomyWindow.instance.append(parent);
        const handler = vi.fn();
        form.removed(handler);
        parent.remove();
        CotomyWindow.instance.append(parent);
        await flushRemoval();
        expect(handler).not.toHaveBeenCalled();
        expect(page.lookup("reattached")).toBe(form);
    });

    it("preserves moving descendants when their ancestor is removed", async () => {
        const parent = new CotomyElement({ tagname: "div" });
        const form = new TestForm("moving");
        parent.append(form);
        CotomyWindow.instance.append(parent);
        form.trigger("cotomy:transitstart");
        const handler = vi.fn();
        form.removed(handler);
        parent.remove();
        await flushRemoval();
        expect(handler).not.toHaveBeenCalled();
    });

    it("does not unregister a replacement form with the same ID", async () => {
        const page = new TestPageController();
        const oldForm = page.register(new TestForm("shared"));
        CotomyWindow.instance.append(oldForm);
        oldForm.remove();
        const replacement = page.register(new TestForm("shared"));
        CotomyWindow.instance.append(replacement);
        await flushRemoval();
        expect(page.lookup("shared")).toBe(replacement);
    });
});
