import cuid from "cuid";
import { CotomyDebugFeature, CotomyDebugSettings } from "./debug";



//#region イベントハンドラ管理要

interface IEventTarget {
    get scopeId(): string;
    element: HTMLElement;
}

type EventHandler = (e: Event) => void | Promise<void>;
class HandlerEntry {
    public constructor(public readonly handle: EventHandler, public readonly wrapper?: EventHandler, public readonly options?: AddEventListenerOptions) {
    }

    public get current(): EventHandler {
        return this.wrapper ?? this.handle;
    }

    /**
     * Comparison mode
     * “strict”: Exact match (matches including wrapper)
     * “remove”: For deletion (ignores wrapper = treats as wildcard)
     */
    public equals(entry: HandlerEntry, mode?: "strict" | "remove"): boolean;
    public equals(handle: EventHandler, options?: AddEventListenerOptions, wrapper?: EventHandler, mode?: "strict" | "remove"): boolean;
    public equals(entryOrHandle: HandlerEntry | EventHandler, optionsOrMode?: AddEventListenerOptions | "strict" | "remove", wrapper?: EventHandler, mode?: "strict" | "remove"): boolean {
        let targetHandle: EventHandler;
        let targetWrapper: EventHandler | undefined;
        let targetOptions: AddEventListenerOptions | undefined;
        let compareMode: "strict" | "remove" = "strict";

        if (entryOrHandle instanceof HandlerEntry) {
            targetHandle = entryOrHandle.handle;
            targetWrapper = entryOrHandle.wrapper;
            targetOptions = entryOrHandle.options;
            compareMode = (optionsOrMode as "strict" | "remove") ?? "strict";

        } else {
            targetHandle = entryOrHandle;

            if (typeof optionsOrMode === "string") {
                compareMode = optionsOrMode;
                targetWrapper = wrapper;
                targetOptions = undefined;
            } else {
                targetOptions = optionsOrMode;
                targetWrapper = wrapper;
                compareMode = mode ?? "strict";
            }
        }

        if (this.handle !== targetHandle) {
            return false;
        }

        if (compareMode === "strict" && this.wrapper !== targetWrapper) {
            return false;
        }

        return HandlerEntry.optionsEquals(this.options, targetOptions);
    }

    public static optionsEquals(left?: AddEventListenerOptions, right?: AddEventListenerOptions): boolean {
        const getBoolean = (options: AddEventListenerOptions | undefined, key: "capture" | "once" | "passive"): boolean =>
            options?.[key] ?? false;
        const getSignal = (options: AddEventListenerOptions | undefined): AbortSignal | undefined =>
            options?.signal;

        const leftSignal = getSignal(left);
        const rightSignal = getSignal(right);
        // 厳格一致: === のみ
        const signalsEqual = leftSignal === rightSignal;

        return getBoolean(left, "capture") === getBoolean(right, "capture")
            && getBoolean(left, "once") === getBoolean(right, "once")
            && getBoolean(left, "passive") === getBoolean(right, "passive")
            && signalsEqual;
    }
}

class HandlerRegistory {
    private _registory: Map<string, HandlerEntry[]> = new Map();

    public constructor(private readonly target: IEventTarget) {
    }

    private ensure(event: string): HandlerEntry[] {
        return this._registory.get(event) ?? this._registory.set(event, []).get(event)!;
    }

    private find(event: string, entry: HandlerEntry): HandlerEntry | undefined {
        return this._registory.get(event)?.find(e => e.equals(entry)) ?? undefined;
    }

    public add(event: string, entry: HandlerEntry): void {
        if (entry.options?.once) {
            this.remove(event, entry);
        }
        if (!this.find(event, entry)) {
            this.ensure(event).push(entry);
            this.target.element.addEventListener(event, entry.current, entry.options);
        }
    }

    public remove(event: string, entry?: HandlerEntry): void {
        if (!entry) {
            const list = this._registory.get(event);
            if (!list) return;
            list.forEach(e => this.target.element.removeEventListener(event, e.current, e.options?.capture ?? false));
            this._registory.delete(event);
            return;
        }
        const list = this._registory.get(event);
        if (list) {
            const remaining: HandlerEntry[] = [];
            for (const e of list) {
                if (e.equals(entry, "remove")) {
                    this.target.element.removeEventListener(event, e.current, e.options?.capture ?? false);
                } else {
                    remaining.push(e);
                }
            }
            if (remaining.length === 0) {
                this._registory.delete(event);
            } else {
                this._registory.set(event, remaining);
            }
        }
    }

    public get empty(): boolean {
        return this._registory.size === 0;
    }
}

class EventRegistry {
    private static _instance: EventRegistry;
    private _registry: Map<string, HandlerRegistory> = new Map();

    public static get instance(): EventRegistry {
        return this._instance ?? (this._instance = new EventRegistry());
    }

    private map(target: IEventTarget): HandlerRegistory {
        const scopeId = target.scopeId;
        let registry = this._registry.get(scopeId);
        if (!registry) {
            registry = new HandlerRegistory(target);
            this._registry.set(scopeId, registry);
        }
        return registry;
    }

    public on(event: string, target: IEventTarget, entry: HandlerEntry): void {
        const registry = this.map(target);
        registry.add(event, entry);
    }

    public off(event: string, target: IEventTarget, entry?: HandlerEntry): void {
        const registry = this._registry.get(target.scopeId);
        if (!registry) return;
        if (entry) {
            registry.remove(event, entry);
        } else {
            registry.remove(event);
        }
        if (registry.empty) {
            this._registry.delete(target.scopeId);
        }
    }

    public clear(target: IEventTarget): void {
        this._registry.delete(target.scopeId);
    }
}

//#endregion




export class CotomyElement implements IEventTarget {

    //#region Factory and Finder

    public static encodeHtml(text: string): string {
        const div = document.createElement("div");
        div.textContent = text ?? "";
        return div.innerHTML;
    }

    private static createHTMLElement(html: string): HTMLElement {
        const wrapperMap: Record<string, { prefix: string, suffix: string }> = {
            "tr": { prefix: "<table><tbody>", suffix: "</tbody></table>" },
            "td": { prefix: "<table><tbody><tr>", suffix: "</tr></tbody></table>" },
            "th": { prefix: "<table><tbody><tr>", suffix: "</tr></tbody></table>" },
            "thead": { prefix: "<table>", suffix: "</table>" },
            "tbody": { prefix: "<table>", suffix: "</table>" },
            "tfoot": { prefix: "<table>", suffix: "</table>" },
            "caption": { prefix: "<table>", suffix: "</table>" },
            "colgroup": { prefix: "<table>", suffix: "</table>" },
            "col": { prefix: "<table><colgroup>", suffix: "</colgroup></table>" },
            "option": { prefix: "<select>", suffix: "</select>" },
            "optgroup": { prefix: "<select>", suffix: "</select>" },
            "legend": { prefix: "<fieldset>", suffix: "</fieldset>" },
            "li": { prefix: "<ul>", suffix: "</ul>" }
        };

        const match = html.match(/<\s*([a-z0-9]+)/i);
        if (!match) {
            throw new Error(`Invalid HTML: cannot extract tag from "${html}"`);
        }
        const tag = match[1].toLowerCase();

        const wrap = wrapperMap[tag];
        const wrappedHtml = wrap ? `${wrap.prefix}${html}${wrap.suffix}` : html;

        const parser = new DOMParser();
        const doc = parser.parseFromString(wrappedHtml, "text/html");
        const errors = doc.querySelector("parsererror");
        if (errors) {
            throw new Error(`HTML parsing failed for tag <${tag}>: "${html}"`);
        }
        if (doc.body.children.length !== 1) {
            throw new Error(`CotomyElement requires a single root element, but got ${doc.body.children.length}.`);
        }

        const element = doc.body.querySelector(tag);
        if (!element) {
            throw new Error(`Parsed but <${tag}> element not found: "${html}"`);
        }

        return element as HTMLElement;
    }

    public static first<T extends CotomyElement = CotomyElement>(selector: string, type?: new (el: HTMLElement) => T): T | undefined {
        const element = document.querySelector(selector);
        if (!element) return undefined;
        const ctor = (type ?? CotomyElement) as new (el: HTMLElement) => T;
        return new ctor(<HTMLElement>element);
    }

    public static find<T extends CotomyElement = CotomyElement>(selector: string, type?: new (el: HTMLElement) => T): T[] {
        const elements = document.querySelectorAll(selector);
        const ctor = (type ?? CotomyElement) as new (el: HTMLElement) => T;
        return Array.from(elements).map(e => new ctor(<HTMLElement>e));
    }

    public static contains(selector: string): boolean {
        return document.querySelector(selector) !== null;
    }

    public static byId<T extends CotomyElement = CotomyElement>(id: string, type?: new (el: HTMLElement) => T): T | undefined {
        return this.first<T>(`#${id}`, type);
    }

    public static containsById(id: string): boolean {
        return document.getElementById(id) !== null;
    }

    public static empty<T extends CotomyElement = CotomyElement>(type?: new (el: HTMLElement) => T): T {
        const ctor = (type ?? CotomyElement) as new (el: HTMLElement) => T;
        return new ctor(document.createElement("div")).attribute("data-cotomy-empty", "").style("display", "none");
    }

    //#endregion



    private _element: HTMLElement;
    private _parentElement: CotomyElement | null = null;

    public constructor(element: HTMLElement | { html: string, css?: string } | { tagname: string, text?: string, css?: string } | string) {
        if (element instanceof HTMLElement) {
            this._element = element;
        } else if (typeof element === "string") {
            this._element = CotomyElement.createHTMLElement(element);
        } else {
            this._element = CotomyElement.createHTMLElement("html" in element ? element.html : `<${element.tagname}></${element.tagname}>`);
            if ("tagname" in element && element.text) {
                this._element.textContent = element.text;
            }
            if (element.css) {
                this.useScopedCss(element.css);
            }
            if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.Html)) {
                if ("html" in element) {
                    console.debug(`CotomyElement {html: "${element.html}" } is created`);
                }
                if ("tagname" in element) {
                    console.debug(`CotomyElement {tagname: "${element.tagname}", text: "${element.text ?? ""}"} is created`);
                }
                if (element.css) {
                    console.debug(`CotomyElement {css: "${element.css}" } is applied`);
                }
            }
        }
        this.removed(() => {
            this._element = CotomyElement.createHTMLElement(/* html */ `<div data-cotomy-invalidated style="display: none;"></div>`);
            EventRegistry.instance.clear(this);
        });
    }



    //#region tag identifier

    private _scopeId: string | null = null;

    public get scopeId(): string {
        if (!this._scopeId) {
            this._scopeId = `__cotomy_scope__${cuid()}`;
            this.attribute(this._scopeId, "");
        }
        return this._scopeId;
    }

    public get scopedSelector(): string {
        return `[${this.scopeId}]`;
    }

    //#endregion



    //#region Scoped CSS

    public get stylable(): boolean {
        return !["script", "style", "link", "meta"].includes(this.tagname);
    }

    private get scopedCssElementId(): string {
        return `css-${this.scopeId}`;
    }

    private useScopedCss(css: string): this {
        if (css && this.stylable) {
            const cssid = this.scopedCssElementId;
            CotomyElement.find(`#${cssid}`).forEach(e => e.remove());
            const element = document.createElement("style");
            const writeCss = css.replace(/\[scope\]/g, `[${this.scopeId}]`);
            const node = document.createTextNode(writeCss);
            element.appendChild(node);
            element.id = cssid;
            const head = CotomyElement.first("head")
                    || new CotomyElement({ html: /* html */ `<head></head>` }).prependTo(new CotomyElement(document.documentElement));
            head.append(new CotomyElement(element));

            this.removed(() => {
                CotomyElement.find(`#${cssid}`).forEach(e => e.remove());
            });
        }
        return this;
    }

    //#endregion



    //#region Layout Event Listener

    public static readonly LISTEN_LAYOUT_EVENTS_ATTRIBUTE: string = "data-cotomy-layout";

    public listenLayoutEvents(): this {
        this.attribute(CotomyElement.LISTEN_LAYOUT_EVENTS_ATTRIBUTE, "");
        return this;
    }

    //#endregion



    //#region Elementの基本情報

    public get id(): string | null | undefined {
        return this.attribute("id");
    }

    public generateId(prefix: string = "__cotomy_elem__"): this {
        if (!this.id) {
            this.attribute("id", `${prefix}${cuid()}`);
        }
        return this;
    }

    public get element(): HTMLElement {
        return this._element;
    }

    public get tagname(): string {
        return this.element.tagName.toLowerCase();
    }

    /// <summary>
    /// 指定したセレクタにマッチする要素が存在するかどうかを判定
    /// ・標準の判定だと親要素を辿って判定しないため、セレクタを精査して親要素から判定する
    /// </summary>
    public is(selector: string): boolean {
        const selectors = selector.split(/\s+(?![^\[]*\])|(?<=\>)\s+/);
        let element: HTMLElement | null = this.element;

        for (let i = selectors.length - 1; i >= 0; i--) {
            let subSelector = selectors[i].trim();
            let directChild = false;

            if (subSelector.startsWith(">")) {
                directChild = true;
                subSelector = subSelector.slice(1).trim();
            }

            if (!element || !element.matches(subSelector)) {
                return false;
            }

            if (directChild) {
                element = element.parentElement;
            } else {
                if (i > 0) {
                    while (element && !element.matches(selectors[i - 1].trim())) {
                        element = element.parentElement;
                    }
                }
            }
        }

        return true;
    }

    public match(selector: string): boolean {
        try {
            return this.element.matches(selector);
        } catch {
            return false;
        }
    }

    public get empty(): boolean {
        const nonEmptyTags = new Set([
            "input", "select", "textarea", "img", "video", "audio", "br", "hr",
            "iframe", "embed", "canvas", "object", "svg", "source", "track", "col",
            "link", "meta", "base"
        ]);

        return nonEmptyTags.has(this.tagname)
                || this._element.hasAttribute("data-cotomy-empty")
                || this._element.innerHTML.trim() === "";
    }

    //#endregion



    //#region Elementの状態及び値

    public get attached(): boolean {
        return document.contains(this.element);
    }

    public get readonly(): boolean {
        if ("readOnly" in this.element) {
            return <boolean>this.element.readOnly;
        } else {
            return this.element.hasAttribute("readonly");
        }
    }

    public set readonly(readonly: boolean) {
        if ("readOnly" in this.element) {
            this.element.readOnly = readonly;
        } else {
            if (readonly) {
                this.attribute("readonly", "readonly");
            } else {
                this.attribute("readonly", null);
            }
        }
    }

    public get value(): string {
        if ("value" in this.element) {
            return <string>this.element.value;
        } else {
            // "value" プロパティが存在しない場合、空文字列を返す
            return this.attribute("data-cotomy-value") ?? "";
        }
    }

    public set value(val: string) {
        if ("value" in this.element) {
            this.element.value = val;
        } else {
            this.attribute("data-cotomy-value", val);
        }
    }

    public get text(): string {
        return this.element.textContent ?? "";
    }

    public set text(text: string) {
        this.element.textContent = text ?? "";
    }

    public get html(): string {
        return this.element.innerHTML;
    }

    public set html(html: string) {
        this.element.innerHTML = html;
    }

    //#endregion



    //#region Elementの操作

    public setFocus() {
        this.element.focus();
    }

    public get visible(): boolean {
        if (!this.attached) {
            return false;
        }

        if (!this.element.offsetParent && !document.contains(this.element)) {
            return false;
        }

        const rect = this.element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            const style = this.getComputedStyle();
            return style.display !== "none" && style.visibility !== "hidden" && style.visibility !== "collapse";
        }

        return false;
    }

    public get enabled(): boolean {
        return !(this.element.hasAttribute("disabled") && this.element.getAttribute("disabled") !== null);
    }

    public set enabled(value: boolean) {
        if (value) {
            this.element.removeAttribute("disabled");
        } else {
            this.element.setAttribute("disabled", "disabled");
        }
    }

    private get invalidated(): boolean {
        return this.element.hasAttribute("data-cotomy-invalidated");
    }

    public remove() {
        if (!this.invalidated) {
            this._element.remove();
        }
    }

    public clear(): this {
        this.find("*").forEach(e => e.remove());
        this.text = "";
        return this;
    }

    //#endregion



    //#region Elementのサイズ及び位置

    public get width(): number {
        return this.element.offsetWidth;
    }

    public set width(width: number) {
        let w = width.toString() + "px";
        this.style("width", w);
    }

    public get height(): number {
        return this.element.offsetHeight;
    }

    public set height(height: number) {
        let h = height.toString() + "px";
        this.style("height", h);
    }

    public get innerWidth(): number {
        return this.element.clientWidth;
    }

    public get innerHeight(): number {
        return this.element.clientHeight;
    }

    public get outerWidth(): number {
        const style = this.getComputedStyle();
        const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        return this.element.offsetWidth + margin;
    }

    public get outerHeight(): number {
        const style = this.getComputedStyle();
        const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        return this.element.offsetHeight + margin;
    }

    public get scrollHeight(): number {
        return this.element.scrollHeight;
    }

    public get scrollWidth(): number {
        return this.element.scrollWidth;
    }

    public get scrollTop(): number {
        return this.element.scrollTop;
    }
    public get position(): { top: number; left: number } {
        const rect = this.element.getBoundingClientRect();
        return { top: rect.top, left: rect.left };
    }

    public get absolutePosition(): { top: number; left: number } {
        const rect = this.element.getBoundingClientRect();
        return { top: rect.top + window.scrollY, left: rect.left + window.scrollX };
    }

    public get screenPosition(): { top: number; left: number } {
        const rect = this.element.getBoundingClientRect();
        return { top: rect.top, left: rect.left };
    }

    public get rect(): { top: number; left: number; width: number; height: number } {
        const rect = this.element.getBoundingClientRect();
        return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
    }

    public get innerRect(): { top: number; left: number; width: number; height: number } {
        const rect = this.element.getBoundingClientRect();
        const style = this.getComputedStyle();
        const padding = {
            top: parseFloat(style.paddingTop),
            right: parseFloat(style.paddingRight),
            bottom: parseFloat(style.paddingBottom),
            left: parseFloat(style.paddingLeft)
        };
        return {
            top: rect.top + padding.top,
            left: rect.left + padding.left,
            width: rect.width - padding.left - padding.right,
            height: rect.height - padding.top - padding.bottom
        };
    }

    public get outerRect(): { top: number; left: number; width: number; height: number } {
        const rect = this.element.getBoundingClientRect();
        const style = this.getComputedStyle();
        const margin = {
            top: parseFloat(style.marginTop),
            right: parseFloat(style.marginRight),
            bottom: parseFloat(style.marginBottom),
            left: parseFloat(style.marginLeft)
        };
        return {
            top: rect.top - margin.top,
            left: rect.left - margin.left,
            width: rect.width + margin.left + margin.right,
            height: rect.height + margin.top + margin.bottom
        };
    }


    public get padding(): { top: number; right: number; bottom: number; left: number } {
        const style = this.getComputedStyle();
        return {
            top: parseFloat(style.paddingTop),
            right: parseFloat(style.paddingRight),
            bottom: parseFloat(style.paddingBottom),
            left: parseFloat(style.paddingLeft)
        };
    }

    public get margin(): { top: number; right: number; bottom: number; left: number } {
        const style = this.getComputedStyle();
        return {
            top: parseFloat(style.marginTop),
            right: parseFloat(style.marginRight),
            bottom: parseFloat(style.marginBottom),
            left: parseFloat(style.marginLeft)
        };
    }

    public get inViewport(): boolean {
        const rect = this.element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    public get isAboveViewport(): boolean {
        return this.element.getBoundingClientRect().bottom < 0;
    }

    public get isBelowViewport(): boolean {
        return this.element.getBoundingClientRect().top > window.innerHeight;
    }

    public get isLeftViewport(): boolean {
        return this.element.getBoundingClientRect().right < 0;
    }

    public get isRightViewport(): boolean {
        return this.element.getBoundingClientRect().left > window.innerWidth;
    }

    //#endregion



    //#region Elementの属性

    public hasAttribute(name: string): boolean {
        return this.element.hasAttribute(name);
    }

    public attribute(name: string): string | null | undefined;
    public attribute(name: string, value: string | number | undefined): this;
    public attribute(name: string, value: null): this;
    public attribute(name: string, value?: string | number | undefined | null): string | null | undefined | this {
        if (arguments.length === 1) {
            // getter
            return this.element.hasAttribute(name) ? this.element.getAttribute(name) : undefined;
        } else if (value === null) {
            // remove
            this.element.removeAttribute(name);
            return this;
        } else {
            // setter
            this.element.setAttribute(name, value?.toString() ?? "");
            return this;
        }
    }

    public hasClass(name: string): boolean {
        return this.element.classList.contains(name);
    }

    public addClass(name: string): this {
        this.element.classList.add(name);
        return this;
    }

    public removeClass(name: string): this {
        this.element.classList.remove(name);
        return this;
    }

    public toggleClass(name: string, force?: boolean): this {
        this.element.classList.toggle(name, force);
        return this;
    }

    public style(name: string): string;
    public style(name: string, value: string): this;
    public style(name: string, value: null): this;
    public style(name: string, value: undefined): this;
    public style(name: string, value?: string | null): string | this {
        if (arguments.length === 1) {
            // getter
            return this.element.style.getPropertyValue(name);
        } else if (value == null) {
            // remove
            this.element.style.removeProperty(name);
            return this;
        } else {
            // setter
            this.element.style.setProperty(name, value);
            return this;
        }
    }

    protected getComputedStyle(): CSSStyleDeclaration {
        return window.getComputedStyle(this.element);
    }

    public computedStyle(name: string): string {
        return window.getComputedStyle(this.element).getPropertyValue(name);
    }

    //#endregion



    //#region Elementの親子関係

    public get parent(): CotomyElement {
        if (this._parentElement == null && this.element.parentElement !== null) {
            this._parentElement = new CotomyElement(this.element.parentElement);
        }
        return this._parentElement ?? CotomyElement.empty();
    }

    public get parents(): CotomyElement[] {
        let parents = [];
        let currentElement = this.element.parentElement;
        while (currentElement !== null) {
            parents.push(new CotomyElement(currentElement));
            currentElement = currentElement.parentElement;
        }
        return parents;
    }

    public hasChildren(selector: string = "*"): boolean {
        return this.element.querySelector(selector) !== null;
    }
    public children<T extends CotomyElement = CotomyElement>(selector: string = "*", type?: new (el: HTMLElement) => T): T[] {
        const children = Array.from(this.element.querySelectorAll(selector));
        const directChildren = children.filter(child => child.parentElement === this.element);
        const ctor = (type ?? CotomyElement) as new (el: HTMLElement) => T;
        return directChildren.filter((e): e is HTMLElement => e instanceof HTMLElement).map(e => new ctor(e));
    }

    public firstChild<T extends CotomyElement = CotomyElement>(selector: string = "*", type?: new (el: HTMLElement) => T): T | undefined {
        const elements = this.children<T>(selector, type);
        return elements.shift() ?? undefined;
    }

    public lastChild<T extends CotomyElement = CotomyElement>(selector: string = "*", type?: new (el: HTMLElement) => T): T | undefined {
        const elements = this.children<T>(selector, type);
        return elements.pop() ?? undefined;
    }

    public closest<T extends CotomyElement = CotomyElement>(selector: string, type?: new (el: HTMLElement) => T): T | undefined {
        const closestElement = this.element.closest(selector);
        if (closestElement !== null && closestElement instanceof HTMLElement) {
            const ctor = (type ?? CotomyElement) as new (el: HTMLElement) => T;
            return new ctor(closestElement);
        } else {
            return undefined;
        }
    }

    public previousSibling<T extends CotomyElement = CotomyElement>(selector: string = "*", type?: new (el: HTMLElement) => T): T | undefined {
        const element = this.element.previousElementSibling;
        if (element !== null && element instanceof HTMLElement) {
            const ctor = (type ?? CotomyElement) as new (el: HTMLElement) => T;
            const ce = new ctor(element);
            return ce.match(selector) ? ce : ce.previousSibling<T>(selector, type);
        } else {
            return undefined;
        }
    }

    public nextSibling<T extends CotomyElement = CotomyElement>(selector: string = "*", type?: new (el: HTMLElement) => T): T | undefined {
        const element = this.element.nextElementSibling;
        if (element !== null && element instanceof HTMLElement) {
            const ctor = (type ?? CotomyElement) as new (el: HTMLElement) => T;
            const ce = new ctor(element);
            return ce.match(selector) ? ce : ce.nextSibling<T>(selector, type);
        } else {
            return undefined;
        }
    }

    public siblings<T extends CotomyElement = CotomyElement>(selector: string = "*", type?: new (el: HTMLElement) => T): T[] {
        const parent = this.element.parentElement;
        if (!parent) return [];
        const ctor = (type ?? CotomyElement) as new (el: HTMLElement) => T;
        return Array.from(parent.children).filter((e): e is HTMLElement => e instanceof HTMLElement
                && e !== this.element).map(e => new ctor(e)).filter(e => e.match(selector));
    }



    //#endregion



    //#region 内包するElement

    public find<T extends CotomyElement = CotomyElement>(selector: string, type?: new (el: HTMLElement) => T): T[] {
        const elements = Array.from(this.element.querySelectorAll(selector)) as HTMLElement[];
        return <T[]>elements.map(e => new (type ?? CotomyElement)(e));
    }

    public first<T extends CotomyElement = CotomyElement>(selector: string = "*", type?: new (el: HTMLElement) => T): T | undefined {
        const elements = this.find(selector, type);
        return <T>elements.shift() ?? undefined;
    }

    public contains(selector: string): boolean {
        return this.find(selector).length > 0;
    }

    public prepend(prepend: CotomyElement): this {
        this._element.prepend(prepend.element);
        return this;
    }

    public append(target: CotomyElement): this {
        this.element.append(target.element);
        return this;
    }

    public appendAll(targets: CotomyElement[]): this {
        targets.forEach(e => this.append(e));
        return this;
    }

    public insertBefore(append: CotomyElement): this {
        this.element.before(append.element);
        return this;
    }

    public insertAfter(append: CotomyElement): this {
        this.element.after(append.element);
        return this;
    }

    public appendTo(target: CotomyElement): this {
        target.element.append(this.element);
        return this;
    }

    public prependTo(target: CotomyElement): this {
        target.element.prepend(this.element);
        return this;
    }

    //#endregion




    //#region Event

    public trigger(event: string): this;
    public trigger(event: string, e: Event): this;
    public trigger(event: string, e?: Event): this {
        this.element.dispatchEvent(e ?? new Event(event));
        return this;
    }

    public on(event: string, handle: (e: Event) => void | Promise<void>): this;
    public on(event: string, handle: (e: Event) => void | Promise<void>, options: AddEventListenerOptions): this;
    public on(event: string, handle: (e: Event) => void | Promise<void>, options?: AddEventListenerOptions): this {
        const entry = new HandlerEntry(handle, undefined, options);
        EventRegistry.instance.on(event, this, entry);
        return this;
    }

    public onChild(event: string, selector: string, handle: (e: Event) => void | Promise<void>): this;
    public onChild(event: string, selector: string, handle: (e: Event) => void | Promise<void>, options: AddEventListenerOptions): this;
    public onChild(event: string, selector: string, handle: (e: Event) => void | Promise<void>, options?: AddEventListenerOptions): this {
        const delegate: EventHandler = (e: Event) => {
            const target = e.target as HTMLElement | null;
            if (target && target.closest(selector)) {
                return handle(e);
            }
        };
        const entry = new HandlerEntry(handle, delegate, options);
        EventRegistry.instance.on(event, this, entry);
        return this;
    }

    public once(event: string, handle: (e: Event) => void | Promise<void>): this;
    public once(event: string, handle: (e: Event) => void | Promise<void>, options: AddEventListenerOptions): this;
    public once(event: string, handle: (e: Event) => void | Promise<void>, options?: AddEventListenerOptions): this {
        const mergedOptions: AddEventListenerOptions = { ...(options ?? {}), once: true };
        const entry = new HandlerEntry(handle, undefined, mergedOptions);
        this.off(event, handle, mergedOptions);
        EventRegistry.instance.on(event, this, entry);
        return this;
    }

    public off(event: string): this;
    public off(event: string, handle: (e: Event) => void | Promise<void>): this;
    public off(event: string, handle: (e: Event) => void | Promise<void>, options: AddEventListenerOptions): this;
    public off(event: string, handle?: (e: Event) => void | Promise<void>, options?: AddEventListenerOptions): this {
        if (handle) {
            const entry = new HandlerEntry(handle, undefined, options);
            EventRegistry.instance.off(event, this, entry);
        } else {
            EventRegistry.instance.off(event, this);
        }
        return this;
    }

    //#region Mouse Events

    public click(): this;
    public click(handle: (e: MouseEvent) => void | Promise<void>): this;
    public click(handle?: (e: MouseEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("click", async e => await handle(e as MouseEvent));
        } else {
            this.trigger("click");
        }
        return this;
    }

    public dblclick(): this;
    public dblclick(handle: (e: MouseEvent) => void | Promise<void>): this;
    public dblclick(handle?: (e: MouseEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("dblclick", async e => await handle(e as MouseEvent));
        } else {
            this.trigger("dblclick");
        }
        return this;
    }

    public mouseover(): this;
    public mouseover(handle: (e: MouseEvent) => void | Promise<void>): this;
    public mouseover(handle?: (e: MouseEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("mouseover", async e => await handle(e as MouseEvent));
        } else {
            this.trigger("mouseover");
        }
        return this;
    }

    public mouseout(): this;
    public mouseout(handle: (e: MouseEvent) => void | Promise<void>): this;
    public mouseout(handle?: (e: MouseEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("mouseout", async e => await handle(e as MouseEvent));
        } else {
            this.trigger("mouseout");
        }
        return this;
    }

    public mousedown(): this;
    public mousedown(handle: (e: MouseEvent) => void | Promise<void>): this;
    public mousedown(handle?: (e: MouseEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("mousedown", async e => await handle(e as MouseEvent));
        } else {
            this.trigger("mousedown");
        }
        return this;
    }

    public mouseup(): this;
    public mouseup(handle: (e: MouseEvent) => void | Promise<void>): this;
    public mouseup(handle?: (e: MouseEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("mouseup", async e => await handle(e as MouseEvent));
        } else {
            this.trigger("mouseup");
        }
        return this;
    }

    public mousemove(): this;
    public mousemove(handle: (e: MouseEvent) => void | Promise<void>): this;
    public mousemove(handle?: (e: MouseEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("mousemove", async e => await handle(e as MouseEvent));
        } else {
            this.trigger("mousemove");
        }
        return this;
    }

    public mouseenter(): this;
    public mouseenter(handle: (e: MouseEvent) => void | Promise<void>): this;
    public mouseenter(handle?: (e: MouseEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("mouseenter", async e => await handle(e as MouseEvent));
        } else {
            this.trigger("mouseenter");
        }
        return this;
    }

    public mouseleave(): this;
    public mouseleave(handle: (e: MouseEvent) => void | Promise<void>): this;
    public mouseleave(handle?: (e: MouseEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("mouseleave", async e => await handle(e as MouseEvent));
        } else {
            this.trigger("mouseleave");
        }
        return this;
    }

    public dragstart(): this;
    public dragstart(handle: (e: DragEvent) => void | Promise<void>): this;
    public dragstart(handle?: (e: DragEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("dragstart", async e => await handle(e as DragEvent));
        } else {
            this.trigger("dragstart");
        }
        return this;
    }

    public dragend(): this;
    public dragend(handle: (e: DragEvent) => void | Promise<void>): this;
    public dragend(handle?: (e: DragEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("dragend", async e => await handle(e as DragEvent));
        } else {
            this.trigger("dragend");
        }
        return this;
    }

    public dragover(): this;
    public dragover(handle: (e: DragEvent) => void | Promise<void>): this;
    public dragover(handle?: (e: DragEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("dragover", async e => await handle(e as DragEvent));
        } else {
            this.trigger("dragover");
        }
        return this;
    }

    public dragenter(): this;
    public dragenter(handle: (e: DragEvent) => void | Promise<void>): this;
    public dragenter(handle?: (e: DragEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("dragenter", async e => await handle(e as DragEvent));
        } else {
            this.trigger("dragenter");
        }
        return this;
    }

    public dragleave(): this;
    public dragleave(handle: (e: DragEvent) => void | Promise<void>): this;
    public dragleave(handle?: (e: DragEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("dragleave", async e => await handle(e as DragEvent));
        } else {
            this.trigger("dragleave");
        }
        return this;
    }

    public drop(): this;
    public drop(handle: (e: DragEvent) => void | Promise<void>): this;
    public drop(handle?: (e: DragEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("drop", async e => await handle(e as DragEvent));
        } else {
            this.trigger("drop");
        }
        return this;
    }

    public drag(): this;
    public drag(handle: (e: DragEvent) => void | Promise<void>): this;
    public drag(handle?: (e: DragEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("drag", async e => await handle(e as DragEvent));
        } else {
            this.trigger("drag");
        }
        return this;
    }

    public removed(handle: ((e: Event) => void | Promise<void>)): this {
        this.element.addEventListener("removed", async e => await handle(e));
        return this;
    }

    //#endregion



    //#region Keyboard Events

    public keydown(): this;
    public keydown(handle: (e: KeyboardEvent) => void | Promise<void>): this;
    public keydown(handle?: (e: KeyboardEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("keydown", async e => await handle(e as KeyboardEvent));
        } else {
            this.trigger("keydown");
        }
        return this;
    }

    public keyup(): this;
    public keyup(handle: (e: KeyboardEvent) => void | Promise<void>): this;
    public keyup(handle?: (e: KeyboardEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("keyup", async e => await handle(e as KeyboardEvent));
        } else {
            this.trigger("keyup");
        }
        return this;
    }

    public keypress(): this;
    public keypress(handle: (e: KeyboardEvent) => void | Promise<void>): this;
    public keypress(handle?: (e: KeyboardEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("keypress", async e => await handle(e as KeyboardEvent));
        } else {
            this.trigger("keypress");
        }
        return this;
    }

    //#endregion


    //#region Input Control Events

    public change(): this;
    public change(handle: (e: Event) => void | Promise<void>): this;
    public change(handle?: (e: Event) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("change", async e => await handle(e));
        } else {
            this.trigger("change");
        }
        return this;
    }

    public input(): this;
    public input(handle: (e: Event) => void | Promise<void>): this;
    public input(handle?: (e: Event) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("input", async e => await handle(e));
        } else {
            this.trigger("input");
        }
        return this;
    }

    //#endregion


    //#region View and Control Evnet

    private static _intersectionObserver: IntersectionObserver | null = null;
    public static get intersectionObserver(): IntersectionObserver {
        return CotomyElement._intersectionObserver = CotomyElement._intersectionObserver
                ?? new IntersectionObserver(entries => {
                    entries.filter(entry => entry.isIntersecting).forEach(
                            entry => entry.target.dispatchEvent(new Event("inview")));
                    entries.filter(entry => !entry.isIntersecting).forEach(
                            entry => entry.target.dispatchEvent(new Event("outview")));
                });
    }

    public inview(): this;
    public inview(handle: (e: Event) => void | Promise<void>): this;
    public inview(handle?: (e: Event) => void | Promise<void>): this {
        if (handle) {
            CotomyElement.intersectionObserver.observe(this.element);
            this.element.addEventListener("inview", async e => await handle(e));
        } else {
            this.trigger("inview");
        }
        return this;
    }

    public outview(): this;
    public outview(handle: (e: Event) => void | Promise<void>): this;
    public outview(handle?: (e: Event) => void | Promise<void>): this {
        if (handle) {
            CotomyElement.intersectionObserver.observe(this.element);
            this.element.addEventListener("outview", async e => await handle(e));
        } else {
            this.trigger("outview");
        }
        return this;
    }

    public focus(): this;
    public focus(handle: (e: FocusEvent) => void | Promise<void>): this;
    public focus(handle?: (e: FocusEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("focus", async e => await handle(e as FocusEvent));
        } else {
            this.trigger("focus");
        }
        return this;
    }

    public blur(): this;
    public blur(handle: (e: FocusEvent) => void | Promise<void>): this;
    public blur(handle?: (e: FocusEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("blur", async e => await handle(e as FocusEvent));
        } else {
            this.trigger("blur");
        }
        return this;
    }

    public focusin(): this;
    public focusin(handle: (e: FocusEvent) => void | Promise<void>): this;
    public focusin(handle?: (e: FocusEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("focusin", async e => await handle(e as FocusEvent));
        } else {
            this.trigger("focusin");
        }
        return this;
    }

    public focusout(): this;
    public focusout(handle: (e: FocusEvent) => void | Promise<void>): this;
    public focusout(handle?: (e: FocusEvent) => void | Promise<void>): this {
        if (handle) {
            this.element.addEventListener("focusout", async e => await handle(e as FocusEvent));
        } else {
            this.trigger("focusout");
        }
        return this;
    }

    public filedrop(handle: (files: File[]) => void | Promise<void>): this {
        this.element.addEventListener("drop", async e => {
            e.preventDefault();
            const dt = e.dataTransfer;
            if (dt && dt.files) {
                await handle(Array.from(dt.files));
            }
        });
        return this;
    }

    //#endregion



    //#region Layout Events
    public resize(): this;
    public resize(handle: (e: Event) => void | Promise<void>): this;
    public resize(handle?: (e: Event) => void | Promise<void>): this {
        this.listenLayoutEvents();
        if (handle) {
            this.element.addEventListener("cotomy:resize", async e => await handle(e));
        } else {
            this.trigger("cotomy:resize");
        }
        return this;
    }

    public scroll(): this;
    public scroll(handle: (e: Event) => void | Promise<void>): this;
    public scroll(handle?: (e: Event) => void | Promise<void>): this {
        this.listenLayoutEvents();
        if (handle) {
            this.element.addEventListener("cotomy:scroll", async e => await handle(e));
        } else {
            this.trigger("cotomy:scroll");
        }
        return this;
    }

    public changelayout(): this;
    public changelayout(handle: (e: Event) => void | Promise<void>): this;
    public changelayout(handle?: (e: Event) => void | Promise<void>): this {
        this.listenLayoutEvents();
        if (handle) {
            this.element.addEventListener("cotomy:changelayout", async e => await handle(e));
        } else {
            this.trigger("cotomy:changelayout");
        }
        return this;
    }
    //#endregion
    //#endregion
}

export class CotomyMetaElement extends CotomyElement {
    public static get(name: string): CotomyMetaElement {
        return CotomyElement.first<CotomyMetaElement>(`meta[name="${name}" i]`, CotomyMetaElement)
                ?? CotomyElement.empty<CotomyMetaElement>(CotomyMetaElement);
    }

    public get content(): string {
        return this.attribute("content") ?? "";
    }
}




export class CotomyWindow {
    private static _instance: CotomyWindow | null = null;

    public static get instance(): CotomyWindow {
        return CotomyWindow._instance ?? (CotomyWindow._instance = new CotomyWindow());
    }


    private _body: CotomyElement = CotomyElement.empty();
    private _mutationObserver: MutationObserver | null = null;
    private _reloading: boolean = false;
    private _eventHandlers: { [event: string]: Array<(e: Event) => void | Promise<void>> } = {};

    public get initialized(): boolean {
        return this._body.attached;
    }

    public initialize() {
        if (!this.initialized) {
            if (!document.body) {
                throw new Error("<body> element not found. DOM may not be ready.");
            }
            this._body = CotomyElement.first("body")!;

            const changeLayoutEvents = ["resize", "scroll", "orientationchange", "fullscreenchange", "cotomy:ready"];
            changeLayoutEvents.forEach(e => {
                window.addEventListener(e, () => {
                    const changeLayoutEvent = new CustomEvent("cotomy:changelayout");
                    window.dispatchEvent(changeLayoutEvent);
                }, { passive: true });
            });

            // documentにファイルがドラッグされた場合、開いてしまうことを防ぐ
            document.addEventListener("dragover", e => {
                e.stopPropagation();
                e.preventDefault();
            });

            this.resize(() => {
                document.querySelectorAll(`[${CotomyElement.LISTEN_LAYOUT_EVENTS_ATTRIBUTE}]`).forEach(e => {
                    e.dispatchEvent(new CustomEvent("cotomy:resize"));
                });
            });

            this.scroll(() => {
                document.querySelectorAll(`[${CotomyElement.LISTEN_LAYOUT_EVENTS_ATTRIBUTE}]`).forEach(e => {
                    e.dispatchEvent(new CustomEvent("cotomy:scroll"));
                });
            });

            this.changeLayout(() => {
                document.querySelectorAll(`[${CotomyElement.LISTEN_LAYOUT_EVENTS_ATTRIBUTE}]`).forEach(e => {
                    e.dispatchEvent(new CustomEvent("cotomy:changelayout"));
                });
            });


            // DOM要素の削除をトラップして、removedイベントを発生させる
            this._mutationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.removedNodes.forEach(node => {
                        if (typeof HTMLElement !== "undefined" && node instanceof HTMLElement) {
                            const element = new CotomyElement(node);
                            element.trigger("removed");
                        }
                    });
                });
            });
            this._mutationObserver.observe(this.body.element, { childList: true, subtree: true });
        }
    }

    public get reloading(): boolean {
        return this._reloading;
    }

    public reload() {
        this._reloading = true;
        location.reload();
    }



    public get body(): CotomyElement {
        return this._body;
    }

    public append(e: CotomyElement) {
        this._body.append(e);
    }

    public moveNext(focused: CotomyElement, shift: boolean = false) {
        const selector = "input, a, select, button, textarea";
        const focusableElements = Array.from(this.body.element.querySelectorAll(selector))
                .map(e => new CotomyElement(<HTMLElement>e))
                .filter(e => e.width > 0 && e.height > 0 && e.visible && e.enabled && !e.hasAttribute("readonly"));

        const focusedIndex = focusableElements.map(e => e.element).indexOf(focused.element);

        let nextIndex = focusedIndex + (shift ? -1 : 1);
        if (nextIndex >= focusableElements.length) {
            nextIndex = 0;
        } else if (nextIndex < 0) {
            nextIndex = focusableElements.length - 1;
        }

        // 次の要素が存在する場合、フォーカスを移動
        if (focusableElements[nextIndex]) {
            focusableElements[nextIndex].setFocus();
        }
    }

    public trigger(event: string) {
        window.dispatchEvent(new Event(event));
    }

    public on(event: string, handle: (e: Event) => void | Promise<void>) {
        if (!this._eventHandlers[event]) this._eventHandlers[event] = [];
        this._eventHandlers[event].push(handle);
        window.addEventListener(event, handle);
    }

    public off(event: string, handle?: (e: Event) => void | Promise<void>) {
        if (handle) {
            window.removeEventListener(event, handle);
            this._eventHandlers[event] = this._eventHandlers[event]?.filter(h => h !== handle) ?? [];
        } else {
            for (const h of this._eventHandlers[event] ?? []) {
                window.removeEventListener(event, h);
            }
            delete this._eventHandlers[event];
        }
    }

    public load(handle: (e: Event) => void | Promise<void>) {
        this.on("load", handle);
    }

    public ready(handle: ((e: Event) => void | Promise<void>)) {
        this.on("cotomy:ready", handle);
    }

    public resize(): void;
    public resize(handle: (event: Event) => void | Promise<void>): void;
    public resize(handle?: (event: Event) => void | Promise<void>): void {
        if (handle) {
            this.on("resize", handle);
        } else {
            this.trigger("resize");
        }
    }

    public scroll(): void;
    public scroll(handle: (event: Event) => void | Promise<void>): void;
    public scroll(handle?: (event: Event) => void | Promise<void>): void {
        if (handle) {
            this.on("scroll", handle);
        } else {
            this.trigger("scroll");
        }
    }

    public changeLayout(): void;
    public changeLayout(handle: (event: Event) => void | Promise<void>): void;
    public changeLayout(handle?: (event: Event) => void | Promise<void>): void {
        if (handle) {
            this.on("cotomy:changelayout", handle);
        } else {
            this.trigger("cotomy:changelayout");
        }
    }

    public pageshow(): void;
    public pageshow(handle: (event: PageTransitionEvent) => void | Promise<void>): void;
    public pageshow(handle?: (event: PageTransitionEvent) => void | Promise<void>): void {
        if (handle) {
            this.on("pageshow", handle as (e: Event) => void | Promise<void>);
        } else {
            this.trigger("pageshow");
        }
    }

    public get scrollTop(): number {
        return window.scrollY || document.documentElement.scrollTop;
    }

    public get scrollLeft(): number {
        return window.scrollX || document.documentElement.scrollLeft;
    }

    public get width(): number {
        return window.innerWidth;
    }

    public get height(): number {
        return window.innerHeight;
    }

    public get documentWidth(): number {
        return document.documentElement.scrollWidth;
    }

    public get documentHeight(): number {
        return document.documentElement.scrollHeight;
    }
}
