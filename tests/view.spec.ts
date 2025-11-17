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

        const styled = new CotomyElement({ html: `<div class="styled"></div>`, css: `[scope] .styled { color: red; }` });
        const scope = styled.scopeId;
        const styleElement = document.head.querySelector(`#css-${scope}`) as HTMLStyleElement | null;
        expect(styleElement).not.toBeNull();
        expect(styleElement?.textContent).toContain(`[${scope}] .styled { color: red; }`);
    });

    it("exposes scope data and scoped selector", () => {
        const element = new CotomyElement(document.createElement("div"));
        const scope = element.scopeId;
        expect(scope).toMatch(/__cotomy_scope__/);
        expect(element.scopedSelector).toBe(`[${scope}]`);
        expect(element.element.hasAttribute(scope)).toBe(true);
    });

    it("supports static element lookup helpers", () => {
        document.body.innerHTML = `<div id="root"><span class="item">a</span><span class="item">b</span></div>`;

        expect(CotomyElement.contains(".item")).toBe(true);
        expect(CotomyElement.containsById("root")).toBe(true);

        const first = CotomyElement.first(".item");
        expect(first?.text).toBe("a");

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
        element.remove();
        expect(document.body.contains(element.element)).toBe(false);
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

    it("manages event handlers via on/off/trigger", () => {
        const handler = vi.fn();
        CotomyWindow.instance.on("custom:event", handler);
        CotomyWindow.instance.trigger("custom:event");
        expect(handler).toHaveBeenCalledTimes(1);

        CotomyWindow.instance.off("custom:event", handler);
        CotomyWindow.instance.trigger("custom:event");
        expect(handler).toHaveBeenCalledTimes(1);
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
