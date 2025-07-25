import { CotomyDebugFeature, CotomyDebugSettings } from "./debug";
import { CotomyForm } from "./form";
import { CotomyElement, CotomyWindow } from "./view";


export class CotomyUrl {
    public static location() {
        return new CotomyUrl();
    }


    private _url: string;

    public constructor(url: string | null = null) {
        this._url = url ?? this.current();
    }


    private current(): string {
        const { pathname, search } = location;
        return `${pathname}${search}`;
    }

    public get url(): string {
        return this._url;
    }

    public get path(): string {
        return this._url.split("?")[0];
    }

    public get segments(): string[] {
        const segments = this.path.split("/").filter(segment => segment.length > 0);
        return segments.filter(segment => segment.length > 0);
    }

    public get query(): string {
        return this._url.split("?")[1] ?? "";
    }

    public get parameters(): { [ key: string ]: string } {
        const search = this._url.split("?")[1] ?? "";
        const parameters = search.split("&").map(parameter => parameter.split("="));
        const dictionary: { [ key: string ]: string } = {};
        parameters.forEach(([ key, value ]) => dictionary[key] = value);
        return dictionary;
    }

    public redirect() {
        window.location.href = this.url;
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


    private _forms: { [ key: string ]: CotomyForm } = {};

    protected setForm<T extends CotomyForm = CotomyForm>(form: T): T {
        this._forms[form.formId] = form;
        form.removed(() => {
            delete this._forms[form.formId];
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


    protected async initializeAsync(): Promise<void> {
        this.body.convertUtcToLocal();
    }

    public get body(): CotomyElement {
        return CotomyWindow.instance.body;
    }

    protected get uri(): CotomyUrl {
        return new CotomyUrl();
    }
}

