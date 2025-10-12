import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { CotomyDebugFeature, CotomyDebugSettings } from "./debug";
import { CotomyForm } from "./form";
import { CotomyElement, CotomyWindow } from "./view";

dayjs.extend(utc);
dayjs.extend(timezone);


export class CotomyUrl {
    public static location() {
        return new CotomyUrl();
    }

    private _url: URL;

    public constructor(url: string | null = null) {
        this._url = new URL(url ?? (location.pathname + location.search), location.origin);
    }

    public get url(): string {
        return this._url.pathname + this._url.search;
    }

    public get path(): string {
        return this._url.pathname;
    }

    public get segments(): string[] {
        return this._url.pathname.split("/").filter(s => s.length > 0);
    }

    public get query(): string {
        return this._url.search.replace(/^\?/, "");
    }

    public get parameters(): { [key: string]: string } {
        const dict: Record<string, string> = {};
        this._url.searchParams.forEach((value, key) => { dict[key] = value; });
        return dict;
    }

    public redirect() {
        window.location.href = this.url;
    }

    public replace(): void {
        window.location.replace(this.url);
    }

    public replaceState(state: any = null, title: string = ""): void {
        window.history.replaceState(state, title, this.url);
    }
}





export class CotomyPageController {
    private static _instance: CotomyPageController | null = null;

    public static set<T extends CotomyPageController = CotomyPageController>(type: new () => T): T {
        if (this._instance) {
            throw new Error("PageController is already initialized.");
        }
        this._instance = new type();
        CotomyWindow.instance.load(async () => {
            if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.Page)) {
                console.debug("CotomyPageController initialize.");
            }
            CotomyWindow.instance.initialize();
            await CotomyPageController._instance!.initializeAsync();
            CotomyWindow.instance.trigger("cotomy:ready");
        });
        return this._instance as T;
    }

    public static get<T extends CotomyPageController = CotomyPageController>(): T {
        if (!(this._instance instanceof CotomyPageController)) {
            throw new Error("PageController is not initialized. Use CotomyPageController.set() to initialize it.");
        }
        return this._instance as T;
    }


    private _forms: { [key: string]: CotomyForm } = {};

    protected setForm<T extends CotomyForm = CotomyForm>(form: T): T {
        if (!form.id) {
            form.generateId();
        }
        this._forms[form.id!] = form;
        form.removed(() => {
            delete this._forms[form.id!];
        });
        return form.initialize();
    }

    protected getForm<T extends CotomyForm = CotomyForm>(id: string, type?: { new(...args: any[]): T }): T | undefined {
        const form = this._forms[id];
        if (!form) return undefined;

        if (type && !(form instanceof type)) {
            throw new Error(`Form "${id}" is not instance of expected type.`);
        }

        return form as T;
    }

    protected forms(): CotomyForm[] {
        return Object.values(this._forms);
    }

    protected async restoreAsync(): Promise<void> {
        for (const f of this.forms()) {
            if (CotomyWindow.instance.reloading) {
                break;
            }
            if (f.autoReload) {
                await f.reloadAsync();
            }
        }
    }

    private isValidUtcDateString(value: string): boolean {
        return dayjs(value).isValid() && (value.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(value));
    }

    private initializeDateTimeElements() {
        CotomyWindow.instance.body.find("[data-cotomy-datetime]:not([data-cotomy-formatted])").forEach(e => {
            if (dayjs(e.text).isValid()) {
                const timezone = e.attribute("data-cotomy-timezone")
                        || e.closest("[data-cotomy-timezone]")?.attribute("data-cotomy-timezone");
                const format: string = e.attribute("data-cotomy-format") ?? "YYYY-MM-DD HH:mm";
                const lt = this.isValidUtcDateString(e.text) ? dayjs(e.text) : dayjs(`${dayjs(e.text).format("YYYY-MM-DDTHH:mm:ss")}Z`);
                const dt = e.attribute("data-cotomy-datetime") === "local" ? lt : lt.utc();
                e.text = (timezone && timezone.trim() !== "") ? dt.tz(timezone).format(format) : dt.format(format);
                e.attribute("data-cotomy-formatted", "");
            }
        });
    }


    protected async initializeAsync(): Promise<void> {
        this.initializeDateTimeElements();

        CotomyWindow.instance.pageshow(async e => {
            if (e.persisted) {
                await this.restoreAsync();
                if (CotomyWindow.instance.reloading) {
                    e.stopImmediatePropagation();
                }
            }
        });
    }

    public get body(): CotomyElement {
        return CotomyWindow.instance.body;
    }

    protected get url(): CotomyUrl {
        return new CotomyUrl();
    }
}

