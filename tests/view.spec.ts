/// <reference types="vitest" />
// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CotomyElement, CotomyWindow } from "../src/view";

(globalThis as any).HTMLElement = (globalThis as any).HTMLElement ?? window.HTMLElement;

describe("CotomyElement event handling", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        document.head.innerHTML = "";
        try {
            localStorage.clear();
        } catch {
            // ignore environments without localStorage
        }
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("allows once handlers to be registered again after firing", () => {
        const element = new CotomyElement(document.createElement("div"));
        document.body.appendChild(element.element);

        const handler = vi.fn();

        element.once("sample", handler);
        element.trigger("sample");
        element.once("sample", handler);
        element.trigger("sample");

        expect(handler).toHaveBeenCalledTimes(2);
    });

    it("keeps distinct registrations for the same handler when options differ", () => {
        const element = new CotomyElement(document.createElement("div"));
        document.body.appendChild(element.element);

        const handler = vi.fn();
        element.on("click", handler);
        element.on("click", handler, { capture: true });

        element.element.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(handler).toHaveBeenCalledTimes(2);
    });

    it("removes only matching handler when options are provided to off", () => {
        const element = new CotomyElement(document.createElement("div"));
        document.body.appendChild(element.element);

        const handler = vi.fn();
        element.on("click", handler);
        element.on("click", handler, { capture: true });

        element.off("click", handler, { capture: true });
        element.element.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("treats delegated and direct handlers as separate even with the same function", () => {
        const parent = new CotomyElement(document.createElement("div"));
        document.body.appendChild(parent.element);

        const child = document.createElement("button");
        child.classList.add("child");
        parent.element.appendChild(child);

        const handler = vi.fn();
        parent.on("click", handler);
        parent.onSubTree("click", ".child", handler);

        child.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(handler).toHaveBeenCalledTimes(2);
    });

    it("delegates multiple events via onSubTree", () => {
        const parent = new CotomyElement(document.createElement("div"));
        document.body.appendChild(parent.element);

        const child = document.createElement("button");
        child.classList.add("child");
        parent.element.appendChild(child);

        const handler = vi.fn();
        parent.onSubTree(["click", "custom:event"], ".child", handler);

        child.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        child.dispatchEvent(new Event("custom:event", { bubbles: true }));

        expect(handler).toHaveBeenCalledTimes(2);
    });

    it("bubbles triggered events by default", () => {
        const parent = new CotomyElement(document.createElement("div"));
        const child = new CotomyElement(document.createElement("button"));
        parent.element.appendChild(child.element);

        const handler = vi.fn();
        parent.on("custom:event", handler);

        child.trigger("custom:event");

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("allows bubbling behavior to be overridden with a custom Event", () => {
        const parent = new CotomyElement(document.createElement("div"));
        const child = new CotomyElement(document.createElement("button"));
        parent.element.appendChild(child.element);

        const handler = vi.fn();
        parent.on("custom:event", handler);

        child.trigger("custom:event", new Event("custom:event", { bubbles: false }));

        expect(handler).not.toHaveBeenCalled();
    });

    it("allows on/off to register and remove multiple events at once", () => {
        const element = new CotomyElement(document.createElement("div"));
        document.body.appendChild(element.element);

        const handler = vi.fn();
        element.on(["custom:first", "custom:second"], handler);

        element.trigger("custom:first");
        element.trigger("custom:second");

        expect(handler).toHaveBeenCalledTimes(2);

        element.off(["custom:first", "custom:second"], handler);
        element.trigger("custom:first");
        element.trigger("custom:second");

        expect(handler).toHaveBeenCalledTimes(2);
    });

    it("supports once handlers for multiple events", () => {
        const element = new CotomyElement(document.createElement("div"));
        document.body.appendChild(element.element);

        const handler = vi.fn();
        element.once(["custom:first", "custom:second"], handler);

        element.trigger("custom:first");
        element.trigger("custom:first");
        element.trigger("custom:second");
        element.trigger("custom:second");

        expect(handler).toHaveBeenCalledTimes(2);
    });
});

describe("CotomyElement core behaviors", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        document.head.innerHTML = "";
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("encodes HTML entities", () => {
        expect(CotomyElement.encodeHtml("<span>&</span>")).toBe("&lt;span&gt;&amp;&lt;/span&gt;");
    });

    it("constructs from multiple sources and applies scoped css", () => {
        const byString = new CotomyElement("<button>ok</button>");
        expect(byString.tagname).toBe("button");
        expect(byString.text).toBe("ok");

        const byConfig = new CotomyElement({ tagname: "span", text: "hello" });
        expect(byConfig.text).toBe("hello");

        const styled = new CotomyElement({ html: `<div class="styled"></div>`, css: `[root] .styled { color: red; }` });
        const scope = styled.scopeId;
        const styleElement = document.head.querySelector(`#css-${scope}`) as HTMLStyleElement | null;
        expect(styleElement).not.toBeNull();
        expect(styleElement?.textContent).toContain(`[data-cotomy-scopeid="${scope}"] .styled { color: red; }`);
    });

    it("treats [scope] and [root] as equivalent in scoped css", () => {
        const styled = new CotomyElement({ html: `<div class="styled"></div>`, css: `[scope] .styled { color: blue; }` });
        const scope = styled.scopeId;
        const styleElement = document.head.querySelector(`#css-${scope}`) as HTMLStyleElement | null;
        expect(styleElement).not.toBeNull();
        expect(styleElement?.textContent).toContain(`[data-cotomy-scopeid="${scope}"] .styled { color: blue; }`);
    });

    it("auto-prefixes [root] when no scope placeholder is present", () => {
        const styled = new CotomyElement({ html: `<div class="styled"></div>`, css: `.styled { color: green; }` });
        const scope = styled.scopeId;
        const styleElement = document.head.querySelector(`#css-${scope}`) as HTMLStyleElement | null;
        expect(styleElement).not.toBeNull();
        expect(styleElement?.textContent).toContain(`[data-cotomy-scopeid="${scope}"] .styled { color: green; }`);
    });

    it("exposes scope data via attribute", () => {
        const element = new CotomyElement(document.createElement("div"));
        const scope = element.scopeId;
        expect(scope).toMatch(/^c[a-z0-9]+$/);
        expect(element.attribute("data-cotomy-scopeid")).toBe(scope);
    });

    it("exposes instanceId publicly and respects existing attributes", () => {
        const existing = document.createElement("div");
        existing.setAttribute("data-cotomy-instance", "custom-instance");
        const wrappedExisting = new CotomyElement(existing);
        expect(wrappedExisting.instanceId).toBe("custom-instance");
        expect(typeof wrappedExisting.instanceId).toBe("string");

        const generated = new CotomyElement(document.createElement("div"));
        expect(typeof generated.instanceId).toBe("string");
        expect(generated.instanceId.length).toBeGreaterThan(0);
        expect(generated.instanceId).toMatch(/^c[a-z0-9]+$/);
        expect(generated.attribute("data-cotomy-instance")).toBe(generated.instanceId);
    });

    it("detects overlaps between CotomyElements using rect wrappers", () => {
        const mockRect = (element: HTMLElement, rect: { top: number; left: number; width: number; height: number }) => {
            const right = rect.left + rect.width;
            const bottom = rect.top + rect.height;
            vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
                ...rect,
                right,
                bottom,
                x: rect.left,
                y: rect.top,
                toJSON: () => ({})
            } as any);
        };

        const a = new CotomyElement(document.createElement("div"));
        const b = new CotomyElement(document.createElement("div"));
        const c = new CotomyElement(document.createElement("div"));
        document.body.append(a.element, b.element, c.element);

        mockRect(a.element, { top: 0, left: 0, width: 10, height: 10 });
        mockRect(b.element, { top: 5, left: 5, width: 10, height: 10 });
        mockRect(c.element, { top: 20, left: 20, width: 10, height: 10 });

        expect(a.overlaps(b)).toBe(true);
        expect(a.overlaps(c)).toBe(false);
        expect(a.overlaps(a)).toBe(false);

        const overlaps = a.overlapElements.map(e => e.element);
        expect(overlaps).toEqual([b.element]);
    });

    it("returns empty overlaps when detached", () => {
        const mockRect = (element: HTMLElement, rect: { top: number; left: number; width: number; height: number }) => {
            const right = rect.left + rect.width;
            const bottom = rect.top + rect.height;
            vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
                ...rect,
                right,
                bottom,
                x: rect.left,
                y: rect.top,
                toJSON: () => ({})
            } as any);
        };

        const detached = new CotomyElement(document.createElement("div"));
        const attached = new CotomyElement(document.createElement("div"));
        document.body.append(attached.element);

        mockRect(detached.element, { top: 0, left: 0, width: 10, height: 10 });
        mockRect(attached.element, { top: 0, left: 0, width: 10, height: 10 });

        expect(detached.overlapElements).toEqual([]);
        expect(detached.overlaps(attached)).toBe(false);
    });

    it("preserves scope ids when cloning, including descendants", () => {
        const original = new CotomyElement({ html: `<section class="root"><span class="child"></span></section>` });
        const originalChild = original.first(".child");

        // force scope ids to be materialized on both original and child
        const originalScope = original.scopeId;
        const originalChildScope = originalChild?.scopeId;

        const cloned = original.clone();
        const clonedChild = cloned.first(".child");

        expect(cloned.scopeId).toBe(originalScope);
        expect(cloned.attribute("data-cotomy-scopeid")).toBe(originalScope);
        expect(clonedChild?.scopeId).toBe(originalChildScope);
        expect(clonedChild?.attribute("data-cotomy-scopeid")).toBe(originalChildScope);
    });

    it("regenerates instance ids and lifecycle hooks when cloning", () => {
        const original = new CotomyElement({ html: `<section class="root"><span class="child"></span></section>` });
        const originalChild = original.first(".child")!;
        const originalInstanceId = original.attribute("data-cotomy-instance");
        const originalChildInstanceId = originalChild.attribute("data-cotomy-instance");

        const cloned = original.clone();
        const clonedChild = cloned.first(".child")!;

        expect(cloned.attribute("data-cotomy-instance")).toBeDefined();
        expect(cloned.attribute("data-cotomy-instance")).not.toBe(originalInstanceId);
        expect(clonedChild.attribute("data-cotomy-instance")).toBeDefined();
        expect(clonedChild.attribute("data-cotomy-instance")).not.toBe(originalChildInstanceId);

        cloned.trigger("cotomy:transitstart");
        expect(cloned.attribute("data-cotomy-moving")).toBe("");
        cloned.trigger("cotomy:transitend");
        expect(cloned.attribute("data-cotomy-moving")).toBeUndefined();
    });

    it("supports static element lookup helpers", () => {
        document.body.innerHTML = `<div id="root"><span class="item">a</span><span class="item">b</span></div>`;

        expect(CotomyElement.contains(".item")).toBe(true);
        expect(CotomyElement.containsById("root")).toBe(true);

        const first = CotomyElement.first(".item");
        expect(first?.text).toBe("a");

        const last = CotomyElement.last(".item");
        expect(last?.text).toBe("b");

        const items = CotomyElement.find(".item");
        expect(items).toHaveLength(2);

        const byId = CotomyElement.byId("root");
        expect(byId?.tagname).toBe("div");

        const empty = CotomyElement.empty();
        expect(empty.attribute("data-cotomy-empty")).toBe("");
        expect(empty.style("display")).toBe("none");
    });

    it("manages attributes, classes, and styles", () => {
        const element = new CotomyElement(document.createElement("div"));

        element.attribute("data-sample", "123");
        expect(element.attribute("data-sample")).toBe("123");
        element.attribute("data-sample", null);
        expect(element.attribute("data-sample")).toBeUndefined();

        element.addClass("one").addClass("two");
        expect(element.hasClass("one")).toBe(true);
        element.removeClass("one");
        expect(element.hasClass("one")).toBe(false);
        element.toggleClass("two");
        expect(element.hasClass("two")).toBe(false);
        element.toggleClass("two", true);
        expect(element.hasClass("two")).toBe(true);

        element.style("color", "red");
        expect(element.style("color")).toBe("red");
        element.style("color", null);
        expect(element.style("color")).toBe("");
    });

    it("navigates relationships between elements", () => {
        const wrapper = new CotomyElement(document.createElement("div"));
        wrapper.element.innerHTML = `<section id="parent"><div class="child first"></div><div class="child last"></div></section>`;
        document.body.appendChild(wrapper.element);

        const section = CotomyElement.byId("parent")!;
        const children = section.children(".child");
        expect(children).toHaveLength(2);
        expect(section.firstChild(".child")?.element).toBe(children[0].element);
        expect(section.lastChild(".child")?.element).toBe(children[1].element);
        expect(section.first(".child")?.element).toBe(children[0].element);
        expect(section.last(".child")?.element).toBe(children[1].element);
        expect(children[0].parent.element).toBe(section.element);
        expect(children[0].parents[0].element).toBe(section.element);
        expect(children[0].closest("section")?.element).toBe(section.element);
        expect(section.hasChildren(".child")).toBe(true);
    });

    it("navigates siblings on the same level", () => {
        const wrapper = new CotomyElement(document.createElement("div"));
        wrapper.element.innerHTML = `
            <ul id="list">
                <li class="item first"></li>
                <li class="item middle"></li>
                <li class="item special"></li>
                <li class="item last"></li>
            </ul>`;
        document.body.appendChild(wrapper.element);

        const list = CotomyElement.byId("list")!;
        const first = list.firstChild(".item")!;
        const middle = list.children(".item")[1]!;
        const special = list.children(".item")[2]!;
        const last = list.children(".item")[3]!;

        // previousSibling / nextSibling basic navigation
        expect(middle.previousSibling(".item")?.element).toBe(first.element);
        expect(middle.nextSibling(".item")?.element).toBe(special.element);

        // edges
        expect(first.previousSibling(".item")).toBeUndefined();
        expect(last.nextSibling(".item")).toBeUndefined();

        // selector filtering: only matching siblings are returned
        expect(special.previousSibling(".special")).toBeUndefined();

        // siblings collection excludes self and matches selector
        const sibs = middle.siblings(".item");
        expect(sibs.map(e => e.element)).toEqual([first.element, special.element, last.element]);

        const specialSibs = special.siblings(".special");
        expect(specialSibs).toHaveLength(0);

        // typed constructor support
        class MyElement extends CotomyElement {}
        const typedPrev = special.previousSibling(".item", MyElement);
        expect(typedPrev).toBeInstanceOf(MyElement);

        const typedSibs = middle.siblings(".item", MyElement);
        expect(typedSibs.every(e => e instanceof MyElement)).toBe(true);
    });

    it("matches selector with match() wrapper", () => {
        const wrapper = new CotomyElement(document.createElement("div"));
        wrapper.element.innerHTML = `
            <section id="sec" class="box">
                <div class="item a"></div>
                <div class="item b"></div>
            </section>`;
        document.body.appendChild(wrapper.element);

        const sec = CotomyElement.byId("sec")!;
        expect(sec.match("section.box")).toBe(true);
        expect(sec.match("section#sec")).toBe(true);
        expect(sec.match("main")).toBe(false);

        const a = sec.firstChild(".item")!;
        expect(a.match(".item.a")).toBe(true);
        expect(a.match(".item.b")).toBe(false);
        expect(a.match("*")).toBe(true);
    });

    it("handles id, selector matching, and layout flags", () => {
        const container = new CotomyElement(document.createElement("main"));
        const child = new CotomyElement(document.createElement("div"));
        child.addClass("selected");
        child.listenLayoutEvents();
        container.append(child);
        container.generateId("test-");
        document.body.appendChild(container.element);

        expect(container.id).toMatch(/^test-/);
        expect(child.is("main>.selected")).toBe(true);
        expect(child.attribute(CotomyElement.LISTEN_LAYOUT_EVENTS_ATTRIBUTE)).toBe("");
    });

    it("tracks values, readonly state, and enabled flag", () => {
        const input = new CotomyElement(document.createElement("input"));
        input.value = "abc";
        expect(input.value).toBe("abc");
        input.readonly = true;
        expect(input.readonly).toBe(true);
        input.readonly = false;
        expect(input.readonly).toBe(false);

        const div = new CotomyElement(document.createElement("div"));
        div.value = "fallback";
        expect(div.attribute("data-cotomy-value")).toBe("fallback");
        expect(div.value).toBe("fallback");
        div.readonly = true;
        expect(div.hasAttribute("readonly")).toBe(true);
        div.readonly = false;
        expect(div.hasAttribute("readonly")).toBe(false);

        const button = new CotomyElement(document.createElement("button"));
        expect(button.enabled).toBe(true);
        button.enabled = false;
        expect(button.enabled).toBe(false);
        button.enabled = true;
        expect(button.enabled).toBe(true);
    });

    it("updates textual content and supports clear/remove operations", () => {
        const element = new CotomyElement(document.createElement("div"));
        element.text = "hi";
        expect(element.text).toBe("hi");
        element.html = "<span>inside</span>";
        expect(element.html).toBe("<span>inside</span>");

        element.clear();
        expect(element.text).toBe("");
        expect(element.element.childElementCount).toBe(0);

        document.body.appendChild(element.element);
        const removalResult = element.remove();
        expect(document.body.contains(element.element)).toBe(false);
        expect(removalResult).toBeUndefined();
    });

    it("accepts HTML inputs in append/prepend and appendAll", () => {
        const container = new CotomyElement("<div></div>");
        const middle = new CotomyElement(`<div class="middle"></div>`);

        container.append("<div class=\"tail\"></div>");
        container.prepend("<div class=\"head\"></div>");
        container.appendAll([
            "<div class=\"first\"></div>",
            middle,
            { html: `<div class="last"></div>`, css: `[scope] .last { color: blue; }` }
        ]);

        expect(container.element.firstElementChild?.className).toBe("head");
        expect(container.element.lastElementChild?.className).toBe("last");
        expect(container.firstChild(".middle")!.element).toBe(middle.element);

        const last = container.firstChild(".last")!;
        expect(document.getElementById(`css-${last.scopeId}`)).not.toBeNull();
    });

    it("accepts HTML inputs in insertBefore/insertAfter", () => {
        const container = new CotomyElement(`<div><span id="anchor"></span></div>`);
        document.body.appendChild(container.element);

        const anchor = container.firstChild("#anchor")!;
        anchor.insertAfter({ html: `<div class="styled"></div>`, css: `[scope] .styled { color: red; }` });
        anchor.insertBefore("<div class=\"before\"></div>");

        const inserted = container.firstChild(".styled")!;
        expect(anchor.element.nextElementSibling).toBe(inserted.element);
        expect(inserted.element.previousElementSibling?.id).toBe("anchor");

        const before = container.firstChild(".before")!;
        expect(before.element.nextElementSibling?.id).toBe("anchor");

        const styleElement = document.getElementById(`css-${inserted.scopeId}`) as HTMLStyleElement | null;
        expect(styleElement).not.toBeNull();
        expect(styleElement?.textContent).toContain(`[data-cotomy-scopeid="${inserted.scopeId}"] .styled { color: red; }`);
    });

    it("clones the underlying DOM and supports typed clones", () => {
        class CustomElement extends CotomyElement {}

        const original = new CotomyElement(`<section class="wrapper"><p class="text">hello</p></section>`);
        original.attribute("data-source", "root");

        const typedClone = original.clone(CustomElement);
        expect(typedClone).toBeInstanceOf(CustomElement);
        expect(typedClone.element).not.toBe(original.element);
        expect(typedClone.html).toBe(original.html);
        expect(typedClone.attribute("data-source")).toBe("root");

        const defaultClone = original.clone();
        expect(defaultClone).toBeInstanceOf(CotomyElement);
        original.firstChild(".text")!.text = "mutated";
        expect(defaultClone.firstChild(".text")!.text).toBe("hello");
    });

    it("strips moving flags when cloning", () => {
        const original = new CotomyElement(`<div data-cotomy-moving=""><span class="child" data-cotomy-moving=""></span></div>`);
        const cloned = original.clone();

        expect(cloned.attribute("data-cotomy-moving")).toBeUndefined();
        expect(cloned.first(".child")?.attribute("data-cotomy-moving")).toBeUndefined();
    });

    it("keeps event handlers isolated by instance even when sharing scope", () => {
        const original = new CotomyElement(`<div></div>`);
        const clone = original.clone();
        document.body.append(original.element, clone.element);

        const handler = vi.fn();
        original.on("click", handler);

        // off() on a different instance (but same scope) should not remove the original handler
        clone.off("click", handler);

        clone.element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(handler).toHaveBeenCalledTimes(0);

        original.element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("rehydrates scoped css when a clone shares scope after the original was removed", async () => {
        CotomyWindow.instance.initialize();

        const original = new CotomyElement({ html: `<div class="styled"></div>`, css: `[scope] .styled { color: red; }` });
        const scope = original.scopeId;
        const clone = original.clone();

        document.body.append(original.element);
        expect(document.getElementById(`css-${scope}`)).not.toBeNull();

        original.remove();
        await new Promise(resolve => setTimeout(resolve, 0)); // wait for MutationObserver to dispatch "removed"
        expect(document.getElementById(`css-${scope}`)).toBeNull();

        const wrapper = new CotomyElement(document.createElement("div"));
        wrapper.append(clone);
        document.body.appendChild(wrapper.element);

        const styleElement = document.getElementById(`css-${scope}`) as HTMLStyleElement | null;
        expect(styleElement).not.toBeNull();
        expect(styleElement?.textContent).toContain(`[data-cotomy-scopeid="${scope}"] .styled { color: red; }`);
    });

    it("throws when cloning an invalidated element", () => {
        const invalidated = new CotomyElement(`<div data-cotomy-invalidated></div>`);
        expect(() => invalidated.clone()).toThrow("Cannot clone an invalidated CotomyElement.");
    });

    it("compares document order with comesBefore/comesAfter", () => {
        const container = new CotomyElement(document.createElement("div"));
        container.element.innerHTML = `
            <section id="parent">
                <div class="first"></div>
                <div class="second"></div>
            </section>`;
        document.body.appendChild(container.element);

        const parent = CotomyElement.byId("parent")!;
        const first = parent.firstChild(".first")!;
        const second = parent.firstChild(".second")!;

        expect(first.comesBefore(second)).toBe(true);
        expect(second.comesAfter(first)).toBe(true);

        expect(parent.comesBefore(first)).toBe(true); // parent is before its child in document order
        expect(first.comesAfter(parent)).toBe(true);

        expect(first.comesBefore(first)).toBe(false);
        expect(first.comesAfter(first)).toBe(false);

        const detached = new CotomyElement(document.createElement("div"));
        expect(first.comesBefore(detached)).toBe(false);
        expect(first.comesAfter(detached)).toBe(false);
    });
});

describe("Scrolling helpers", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        document.head.innerHTML = "";
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("scrollIn scrolls the nearest scrollable container by default (smooth)", () => {
        const container = document.createElement("div");
        container.style.overflowY = "auto";
        const target = document.createElement("div");
        container.appendChild(target);
        document.body.appendChild(container);

        Object.defineProperty(container, "clientHeight", { configurable: true, value: 200 });
        Object.defineProperty(container, "scrollHeight", { configurable: true, value: 1000 });
        Object.defineProperty(container, "clientWidth", { configurable: true, value: 300 });
        Object.defineProperty(container, "scrollWidth", { configurable: true, value: 300 });
        container.scrollTop = 0;
        container.scrollLeft = 0;

        const scrollSpy = vi.fn();
        (container as any).scrollTo = scrollSpy;

        container.getBoundingClientRect = () =>
            ({
                top: 100,
                bottom: 300,
                left: 0,
                right: 300,
                width: 300,
                height: 200,
                x: 0,
                y: 100,
                toJSON: () => ({})
            } as DOMRect);
        target.getBoundingClientRect = () =>
            ({
                top: 280,
                bottom: 330,
                left: 0,
                right: 100,
                width: 100,
                height: 50,
                x: 0,
                y: 280,
                toJSON: () => ({})
            } as DOMRect);

        const wrapped = new CotomyElement(target);
        expect(wrapped.scrollIn()).toBe(wrapped);

        expect(scrollSpy).toHaveBeenCalledTimes(1);
        expect(scrollSpy).toHaveBeenCalledWith({ top: 30, left: 0, behavior: "smooth" });
    });

    it("scrollIn scrolls window when there is no scrollable ancestor", () => {
        const originalInnerHeight = window.innerHeight;
        const originalScrollY = window.scrollY;
        const originalScrollX = window.scrollX;

        Object.defineProperty(window, "innerHeight", { configurable: true, value: 600 });
        Object.defineProperty(window, "innerWidth", { configurable: true, value: 800 });
        Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
        Object.defineProperty(window, "scrollX", { configurable: true, value: 0 });

        const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

        const el = document.createElement("div");
        document.body.appendChild(el);
        el.getBoundingClientRect = () =>
            ({
                top: 1200,
                bottom: 1300,
                left: 0,
                right: 100,
                width: 100,
                height: 100,
                x: 0,
                y: 1200,
                toJSON: () => ({})
            } as DOMRect);

        new CotomyElement(el).scrollIn();

        expect(scrollSpy).toHaveBeenCalledTimes(1);
        expect(scrollSpy).toHaveBeenCalledWith({ top: 700, left: 0, behavior: "smooth" });

        Object.defineProperty(window, "innerHeight", { configurable: true, value: originalInnerHeight });
        Object.defineProperty(window, "scrollY", { configurable: true, value: originalScrollY });
        Object.defineProperty(window, "scrollX", { configurable: true, value: originalScrollX });
    });

    it("CotomyWindow.scrollTo accepts selector and allows disabling smooth", () => {
        const originalScrollY = window.scrollY;
        const originalScrollX = window.scrollX;

        Object.defineProperty(window, "innerHeight", { configurable: true, value: 600 });
        Object.defineProperty(window, "innerWidth", { configurable: true, value: 800 });
        Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
        Object.defineProperty(window, "scrollX", { configurable: true, value: 0 });

        const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);

        const el = document.createElement("div");
        el.id = "target";
        document.body.appendChild(el);
        el.getBoundingClientRect = () =>
            ({
                top: 1200,
                bottom: 1300,
                left: 0,
                right: 100,
                width: 100,
                height: 100,
                x: 0,
                y: 1200,
                toJSON: () => ({})
            } as DOMRect);

        CotomyWindow.instance.scrollTo("#target", { behavior: "auto", onlyIfNeeded: false });

        expect(scrollSpy).toHaveBeenCalledTimes(1);
        expect(scrollSpy).toHaveBeenCalledWith({ top: 700, left: 0, behavior: "auto" });

        Object.defineProperty(window, "scrollY", { configurable: true, value: originalScrollY });
        Object.defineProperty(window, "scrollX", { configurable: true, value: originalScrollX });
    });

    it("CotomyElement.scrollTo searches descendants when target is a selector", () => {
        const container = document.createElement("div");
        const target = document.createElement("div");
        target.id = "nested";
        container.appendChild(target);
        document.body.appendChild(container);

        const scrollInSpy = vi.spyOn(CotomyElement.prototype, "scrollIn").mockImplementation(function () {
            return this;
        });

        const wrappedContainer = new CotomyElement(container);
        wrappedContainer.scrollTo("#nested", { onlyIfNeeded: false });

        expect(scrollInSpy).toHaveBeenCalledTimes(1);
        expect(scrollInSpy.mock.instances[0].element).toBe(target);
    });
});

describe("CotomyElement move lifecycle", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        document.head.innerHTML = "";
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("dispatches transit events during append operations", () => {
        const container = new CotomyElement(document.createElement("div"));
        const moving = new CotomyElement(document.createElement("span"));
        document.body.append(container.element, moving.element);

        const moveStart = vi.fn();
        const moveEnd = vi.fn();
        moving.on("cotomy:transitstart", moveStart);
        moving.on("cotomy:transitend", moveEnd);

        container.append(moving);

        expect(moveStart).toHaveBeenCalledTimes(1);
        expect(moveEnd).toHaveBeenCalledTimes(1);
        expect(moveStart.mock.invocationCallOrder[0]).toBeLessThan(moveEnd.mock.invocationCallOrder[0]);
    });

    it("fires transitend even if the DOM operation throws", () => {
        const container = new CotomyElement(document.createElement("div"));
        const moving = new CotomyElement(document.createElement("span"));
        const moveStart = vi.fn();
        const moveEnd = vi.fn();
        moving.on("cotomy:transitstart", moveStart);
        moving.on("cotomy:transitend", moveEnd);

        const appendSpy = vi.spyOn(container.element, "append").mockImplementation(() => {
            throw new Error("append failed");
        });

        expect(() => container.append(moving)).toThrow("append failed");
        expect(moveStart).toHaveBeenCalledTimes(1);
        expect(moveEnd).toHaveBeenCalledTimes(1);

        appendSpy.mockRestore();
    });

    it("suppresses removed events while moving but still fires after detaching", async () => {
        CotomyWindow.instance.initialize();
        document.body.innerHTML = "";

        const source = new CotomyElement(document.createElement("div"));
        const destination = new CotomyElement(document.createElement("div"));
        document.body.append(source.element, destination.element);

        const moving = new CotomyElement(document.createElement("span"));
        source.append(moving);

        const removedHandler = vi.fn();
        moving.removed(removedHandler);

        destination.append(moving);
        await Promise.resolve();
        expect(removedHandler).not.toHaveBeenCalled();

        moving.remove();
        await Promise.resolve();
        expect(removedHandler).toHaveBeenCalledTimes(1);
    });
});

describe("CotomyWindow behaviors", () => {
    const instance = CotomyWindow.instance as unknown as {
        _eventHandlers: { [event: string]: Array<(e: Event) => void> };
        _reloading: boolean;
    };

    beforeAll(() => {
        CotomyWindow.instance.initialize();
    });

    beforeEach(() => {
        Object.entries(instance._eventHandlers).forEach(([event, handlers]) => {
            handlers.forEach(handler => window.removeEventListener(event, handler));
        });
        instance._eventHandlers = {};
        instance._reloading = false;
        (globalThis as any).HTMLElement = (globalThis as any).HTMLElement ?? window.HTMLElement;
        document.body.innerHTML = "";
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("confirms initialization state", () => {
        expect(CotomyWindow.instance.initialized).toBe(true);
        expect(CotomyWindow.instance.body.element).toBe(document.body);
    });

    it("appends elements to body", () => {
        const element = new CotomyElement(document.createElement("div"));
        CotomyWindow.instance.append(element);
        expect(document.body.lastElementChild).toBe(element.element);
    });

    it("appends HTML inputs to body", () => {
        CotomyWindow.instance.append("<div id=\"from-window\"></div>");
        expect(document.body.querySelector("#from-window")).not.toBeNull();
    });

    it("manages event handlers via on/off/trigger", () => {
        const handler = vi.fn();
        CotomyWindow.instance.on("custom:event", handler);
        CotomyWindow.instance.trigger("custom:event");
        expect(handler).toHaveBeenCalledTimes(1);

        CotomyWindow.instance.off("custom:event", handler);
        CotomyWindow.instance.trigger("custom:event");
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("allows multiple window events to be registered at once", () => {
        const handler = vi.fn();
        CotomyWindow.instance.on(["custom:first", "custom:second"], handler);

        window.dispatchEvent(new Event("custom:first"));
        window.dispatchEvent(new Event("custom:second"));

        expect(handler).toHaveBeenCalledTimes(2);

        CotomyWindow.instance.off(["custom:first", "custom:second"], handler);
        window.dispatchEvent(new Event("custom:first"));

        expect(handler).toHaveBeenCalledTimes(2);
    });

    it("dispatches window events with bubbling enabled by default", () => {
        const handler = vi.fn((e: Event) => {
            expect(e.bubbles).toBe(true);
        });
        CotomyWindow.instance.on("custom:event", handler);
        CotomyWindow.instance.trigger("custom:event");
        expect(handler).toHaveBeenCalledTimes(1);
        CotomyWindow.instance.off("custom:event", handler);
    });

    it("accepts custom Event instances to control bubbling", () => {
        const handler = vi.fn((e: Event) => {
            expect(e.bubbles).toBe(false);
        });
        CotomyWindow.instance.on("custom:event", handler);
        CotomyWindow.instance.trigger("custom:event", new Event("custom:event", { bubbles: false }));
        expect(handler).toHaveBeenCalledTimes(1);
        CotomyWindow.instance.off("custom:event", handler);
    });

    it("wires load and ready helpers", () => {
        const loadHandler = vi.fn();
        const readyHandler = vi.fn();

        CotomyWindow.instance.load(loadHandler);
        CotomyWindow.instance.ready(readyHandler);

        window.dispatchEvent(new Event("load"));
        window.dispatchEvent(new Event("cotomy:ready"));

        expect(loadHandler).toHaveBeenCalledTimes(1);
        expect(readyHandler).toHaveBeenCalledTimes(1);
    });

    it("exposes resize, scroll, changeLayout overloads", () => {
        const resizeHandler = vi.fn();
        const scrollHandler = vi.fn();

        CotomyWindow.instance.resize(resizeHandler);
        CotomyWindow.instance.scroll(scrollHandler);

        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("scroll"));

        expect(resizeHandler).toHaveBeenCalledTimes(1);
        expect(scrollHandler).toHaveBeenCalledTimes(1);

        const resizeTrigger = vi.fn();
        CotomyWindow.instance.on("resize", resizeTrigger);
        CotomyWindow.instance.resize();
        expect(resizeTrigger).toHaveBeenCalledTimes(1);

        const changeLayoutHandler = vi.fn();
        CotomyWindow.instance.changeLayout(changeLayoutHandler);
        window.dispatchEvent(new Event("cotomy:changelayout"));
        expect(changeLayoutHandler).toHaveBeenCalledTimes(1);
    });

    it("handles pageshow events", () => {
        const handler = vi.fn();
        CotomyWindow.instance.pageshow(handler);
        window.dispatchEvent(new Event("pageshow"));
        expect(handler).toHaveBeenCalledTimes(1);
    });

    it("returns itself for chainable window helpers", () => {
        const handler = vi.fn();
        const element = new CotomyElement(document.createElement("div"));

        expect(CotomyWindow.instance.initialize()).toBe(CotomyWindow.instance);
        expect(CotomyWindow.instance.append(element)).toBe(CotomyWindow.instance);
        expect(CotomyWindow.instance.on("chain:event", handler)).toBe(CotomyWindow.instance);
        expect(CotomyWindow.instance.trigger("chain:event")).toBe(CotomyWindow.instance);
        expect(CotomyWindow.instance.off("chain:event", handler)).toBe(CotomyWindow.instance);
        expect(CotomyWindow.instance.load(handler)).toBe(CotomyWindow.instance);
        expect(CotomyWindow.instance.ready(handler)).toBe(CotomyWindow.instance);
        expect(CotomyWindow.instance.resize()).toBe(CotomyWindow.instance);
        expect(CotomyWindow.instance.scroll()).toBe(CotomyWindow.instance);
        expect(CotomyWindow.instance.changeLayout()).toBe(CotomyWindow.instance);
        expect(CotomyWindow.instance.pageshow()).toBe(CotomyWindow.instance);
    });

    it("moves focus to the next focusable element", () => {
        const first = document.createElement("input");
        const second = document.createElement("button");
        document.body.append(first, second);

        Object.defineProperties(first, {
            offsetWidth: { configurable: true, value: 10 },
            offsetHeight: { configurable: true, value: 10 },
            offsetParent: { configurable: true, value: document.body }
        });
        Object.defineProperties(second, {
            offsetWidth: { configurable: true, value: 10 },
            offsetHeight: { configurable: true, value: 10 },
            offsetParent: { configurable: true, value: document.body }
        });
        first.getBoundingClientRect = () => ({ top: 0, left: 0, bottom: 10, right: 10, width: 10, height: 10, x: 0, y: 0, toJSON: () => ({}) });
        second.getBoundingClientRect = () => ({ top: 0, left: 0, bottom: 10, right: 10, width: 10, height: 10, x: 0, y: 0, toJSON: () => ({}) });

        const focusSpy = vi.spyOn(second, "focus");

        const firstWrapper = new CotomyElement(first);
        CotomyWindow.instance.moveNext(firstWrapper);

        expect(focusSpy).toHaveBeenCalled();
    });

    it("reports geometry values from the window and document", () => {
        const originalInnerWidth = window.innerWidth;
        const originalInnerHeight = window.innerHeight;
        const originalScrollY = window.scrollY;
        const originalScrollX = window.scrollX;
        const originalScrollWidth = Object.getOwnPropertyDescriptor(document.documentElement, "scrollWidth");
        const originalScrollHeight = Object.getOwnPropertyDescriptor(document.documentElement, "scrollHeight");

        Object.defineProperty(window, "innerWidth", { configurable: true, value: 1200 });
        Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
        Object.defineProperty(window, "scrollY", { configurable: true, value: 150 });
        Object.defineProperty(window, "scrollX", { configurable: true, value: 75 });
        Object.defineProperty(document.documentElement, "scrollWidth", { configurable: true, value: 3200 });
        Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 2400 });

        expect(CotomyWindow.instance.width).toBe(1200);
        expect(CotomyWindow.instance.height).toBe(800);
        expect(CotomyWindow.instance.scrollTop).toBe(150);
        expect(CotomyWindow.instance.scrollLeft).toBe(75);
        expect(CotomyWindow.instance.documentWidth).toBe(3200);
        expect(CotomyWindow.instance.documentHeight).toBe(2400);

        Object.defineProperty(window, "innerWidth", { configurable: true, value: originalInnerWidth });
        Object.defineProperty(window, "innerHeight", { configurable: true, value: originalInnerHeight });
        Object.defineProperty(window, "scrollY", { configurable: true, value: originalScrollY });
        Object.defineProperty(window, "scrollX", { configurable: true, value: originalScrollX });
        if (originalScrollWidth) {
            Object.defineProperty(document.documentElement, "scrollWidth", originalScrollWidth);
        }
        if (originalScrollHeight) {
            Object.defineProperty(document.documentElement, "scrollHeight", originalScrollHeight);
        }
    });

    it("sets reloading flag when reload is invoked", () => {
        const originalLocation = window.location;
        const reloadSpy = vi.fn();
        vi.stubGlobal("location", {
            origin: originalLocation.origin,
            pathname: originalLocation.pathname,
            search: originalLocation.search,
            href: originalLocation.href,
            reload: reloadSpy,
            assign: vi.fn(),
            replace: vi.fn()
        } as unknown as Location);
        expect(CotomyWindow.instance.reloading).toBe(false);
        CotomyWindow.instance.reload();
        expect(CotomyWindow.instance.reloading).toBe(true);
        expect(reloadSpy).toHaveBeenCalledTimes(1);
        vi.stubGlobal("location", originalLocation);
    });
});
