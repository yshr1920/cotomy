import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { CotomyApi, CotomyApiException, CotomyApiResponse, CotomyNotFoundException, CotomyViewRenderer } from "./api";
import { CotomyDebugFeature, CotomyDebugSettings } from "./debug";
import { CotomyElement, CotomyWindow } from "./view";



export class CotomyActionEvent extends Event {
    public action: string;

    constructor(action: string) {
        super('cotomy:action', { bubbles: true, cancelable: true });
        this.action = action;
    }
}


export abstract class CotomyForm extends CotomyElement {
    public constructor(element: HTMLElement | { html: string; css?: string | null; } | string) {
        super(element);
    }


    //#region フォーム識別
    
    public get formId(): string {
        if (!this.hasAttribute("id")) {
            this.setAttribute("id", this.scopeId);
        }
        return this.attribute("id")!;
    }

    //#endregion



    //#region フォームの基本情報

    public method(): string {
        return this.attribute("method") ?? "get";
    }

    public actionUri(): string {
        return this.attribute("action") ?? location.pathname + location.search;
    }

    public get autoComplete(): boolean {
        return this.attribute("autocomplete") === "on";
    }

    public set autoComplete(value: boolean) {
        this.setAttribute("autocomplete", value ? "on" : "off");
    }

    //#endregion
    


    //#region フォームの再読み込み

    public reload(): void {
        CotomyWindow.instance.reload();
    }

    public get autoRestore(): boolean {
        return this.attribute("data-cotomy-restore") !== "false";
    }

    public set autoRestore(value: boolean) {
        if (value) {
            this.removeAttribute("data-cotomy-restore");
        } else {
            this.setAttribute("data-cotomy-restore", "false");
        }
    }

    public restore(): void {
        if (this.autoRestore) {
            this.reload();
        }
    }

    //#endregion



    //#region フォームの構築

    public get initialized(): boolean {
        return this.hasAttribute("data-cotomy-builded");
    }
    
    public initialize(): this {
        if (!this.initialized) {
            this.on("submit", async e => {
                await this.submitAsync(e);
            });
            
            CotomyWindow.instance.pageshow(e => {
                if (e.persisted && !CotomyWindow.instance.reloading) {
                    this.restore();
                }
            });

            this.find("button[type=button][data-cotomy-action]").forEach(e => {
                e.click(() => {
                    this.trigger("cotomy:action", new CotomyActionEvent(e.attribute("data-cotomy-action")!));
                })
            });

            this.setAttribute("data-cotomy-builded");
        }
        return this;
    }

    //#endregion



    //#region Submit

    public submit(): void {
        this.trigger("submit");
    }

    protected abstract submitAsync(e: Event): Promise<void>;

    //#endregion



    //#region Form Operations

    public action(handle: ((event: CotomyActionEvent) => void | Promise<void>) | string): this {
        if (typeof handle === "string") {
            this.trigger("cotomy:action", new CotomyActionEvent(handle));
        } else {
            this.element.addEventListener("cotomy:action", async e => {
                await handle(e as CotomyActionEvent);
            });
        }
        return this;
    }
    
    //#endregion
}



export class CotomyQueryForm extends CotomyForm {
    public constructor(element: HTMLElement | { html: string; css?: string | null; } | string | string) {
        super(element);
        this.autoComplete = true;
    }

    public method(): string {
        return "get";   // QueryFormはGETメソッドを使用することが前提
    }


    protected async submitAsync(e: Event): Promise<void> {
        e.preventDefault();
        e.stopPropagation();

        const uri = this.actionUri();

        // クエリパラメータを連想配列にする
        const queryParams: { [key: string]: string } = {};
        const queryString = uri.split("?")[1];
        if (queryString) {
            queryString.split("&").forEach(param => {
                const [key, value] = param.split("=");
                if (key && value) {
                    queryParams[key] = decodeURIComponent(value);
                }
            });
        }

        // フォームの入力値をクエリパラメータに追加
        this.find("[name]").forEach(input => {
            const name = input.attribute("name");
            if (name) {
                const value = input.value;
                if (value) {
                    queryParams[name] = encodeURIComponent(value);
                } else {
                    delete queryParams[name]; // 空の値は削除
                }
            }
        });

        // クエリパラメータを再構築
        const newQueryString = Object.entries(queryParams)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");

        location.href = `${uri.split("?")[0]}?${newQueryString}`;
    }
}


export class CotomyApiFailedEvent extends Event {
    public constructor(private _response: CotomyApiResponse) {
        super('cotomy:fail', { bubbles: true, cancelable: true });
    }

    public get response(): CotomyApiResponse {
        return this._response;
    }
}


export class CotomyApiForm extends CotomyForm {
    public constructor(element: HTMLElement | { html: string; css?: string | null; } | string) {
        super(element);
    }

    public apiClient(): CotomyApi {
        return new CotomyApi();
    }

    public actionUri(): string {
        return `${this.attribute("action")!}/${this.autoIncrement ? (this.attribute("data-cotomy-key") || "") : this.identifierString}`;
    }

    //#region データ識別

    public get identifier(): string | undefined {
        return this.attribute("data-cotomy-key") || undefined;
    }

    protected setIncrementedId(response: CotomyApiResponse) {
        const id = response.headers.get("Location")?.split("/").pop();
        this.setAttribute("data-cotomy-key", id);
    }

    public get identifierInputs(): CotomyElement[] {
        return this.find("[data-cotomy-keyindex]").sort((a, b) => {
            const aIndex = parseInt(a.attribute("data-cotomy-keyindex") ?? "0");
            const bIndex = parseInt(b.attribute("data-cotomy-keyindex") ?? "0");
            return aIndex - bIndex;
        });
    }

    public get identifierString(): string {
        return this.identifier ?? this.identifierInputs.map(e => e.value).join("/");
    }

    public get autoIncrement(): boolean {
        return !this.identifier && this.identifierInputs.length == 0;
    }

    //#endregion



    //#region API Submit

    public apiFailed(handle: ((event: CotomyApiFailedEvent) => void | Promise<void>)): this {
        this.element.addEventListener("cotomy:fail", async e => {
            await handle(e as CotomyApiFailedEvent);
        });
        return this;
    }

    protected triggerApiFailedEvent(response: CotomyApiResponse): void {
        this.trigger("cotomy:fail", new CotomyApiFailedEvent(response));
        if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.Api)) {
            console.error("API request failed:", response);
        }
    }

    public method(): string {
        return this.autoIncrement || !this.identifierInputs.every(e => e.readonly) ? "post" : "put";
    }

    public formData(): globalThis.FormData {
        const formElement = <HTMLFormElement>this.element;
        const formData = new globalThis.FormData(formElement);

        this.find("input[type=datetime-local][name]:not([disabled])").forEach(input => {
            const localDateTime = input.value;
            if (localDateTime) {
                const date = new Date(localDateTime);
                if (!isNaN(date.getTime())) {
                    formData.set(input.attribute("name")!, dayjs(date).format("YYYY-MM-DDTHH:mmZ"));
                }
            }
        });

        if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.FormData)) {
            console.debug("FormData:", Array.from(formData.entries()));
        }

        return formData;
    };

    protected async submitAsync(e: Event): Promise<void> {
        e.preventDefault();
        e.stopPropagation();

        const formData = this.formData();
        await this.submitToApiAsync(formData);
    }

    protected async submitToApiAsync(formData: globalThis.FormData): Promise<CotomyApiResponse> {
        const api = this.apiClient();

        try {
            const response = await api.submitAsync({
                method: this.method(),
                action: this.actionUri(),
                body: formData,
            });

            // APIのレスポンスからidを設定
            if (this.autoIncrement && response.status === StatusCodes.CREATED) {
                this.setIncrementedId(response);
            }

            // レスポンスのLocationヘッダーがあれば、リダイレクト
            const redirect = response.headers.get("Location");
            if (redirect) {
                location.href = redirect;
                return response;
            }

            return response;
        } catch (error) {
            if (error instanceof CotomyApiException) {
                this.triggerApiFailedEvent(error.response);
            }
            throw error;
        }
    }

    //#endregion
}


export class CotomyFillApiForm extends CotomyApiForm {
    private _fillers: { [key: string]: (input: CotomyElement, value: any) => void } = {};

    public constructor(element: HTMLElement | { html: string; css?: string | null; } | string) {
        super(element);
    }

    public filler(type: string, callback: (input: CotomyElement, value: any) => void): this {
        this._fillers[type] = callback;
        return this;
    }

    public initialize(): this {
        if (!this.initialized) {
            super.initialize();

            this.filler("datetime-local", (input, value) => {
                const hasOffset = /[+-]\d{2}:\d{2}$/.test(value);
                const date = hasOffset ? new Date(value) : new Date(`${value}Z`);
                if (!isNaN(date.getTime())) {
                    input.value = dayjs(date).format("YYYY-MM-DDTHH:mm");
                } else {
                    input.value = "";
                }
            });

            this.filler("checkbox", (input, value) => {
                input.removeAttribute("checked");
                if (value) {
                    input.setAttribute("checked");
                }
            });

            this.filler("radio", (input, value) => {
                input.removeAttribute("checked");
                if (input.value === value) {
                    input.setAttribute("checked");
                }
            });

            CotomyWindow.instance.ready(async () => {
                await this.loadAsync();
            });
        }
        return this;
    }


    protected async submitToApiAsync(formData: globalThis.FormData): Promise<CotomyApiResponse> {
        const response = await super.submitToApiAsync(formData);
        if (response.ok) {
            await this.fillAsync(response);
        }
        return response;
    }




    public reload(): void {
        this.loadAsync();
    }

    public loadActionUri(): string {
        return this.actionUri();
    }

    public renderer(): CotomyViewRenderer {
        return new CotomyViewRenderer(this);
    }

    public async loadAsync(): Promise<CotomyApiResponse> {
        if (this.autoIncrement || !this.identifierInputs.every(e => e.value)) return new CotomyApiResponse();
        const api = this.apiClient();
        try {
            const response = await api.getAsync(this.loadActionUri());
            await this.fillAsync(response);
            return response;
        } catch (error) {
            if (error instanceof CotomyApiException) {
                this.triggerApiFailedEvent(error.response);
            }
            if (error instanceof CotomyNotFoundException) {
                return error.response;
            }
            throw error;
        }
    }

    protected async fillAsync(response: CotomyApiResponse): Promise<void> {
        if (response.ok && response.available) {
            for (const [key, value] of Object.entries(await response.objectAsync())) {
                if (key.endsWith('[]')) {
                    continue;
                }

                this.find(`input[name="${key}" i]:not([data-cotomy-fill="false"]):not([multiple]),
                        textarea[name="${key}" i]:not([data-cotomy-fill="false"]), 
                        select[name="${key}" i]:not([data-cotomy-fill="false"]):not([multiple])`).forEach(input => {
                    if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.Fill)) {
                        console.debug(`Filling input[name="${key}"] with value:`, value);
                    }
                    const type = input.attribute("type")?.toLowerCase();
                    if (type && this._fillers[type]) {
                        this._fillers[type](input, value);
                    } else {
                        input.value = String(value || "");
                    }
                });
            }
            
            await this.renderer().applyAsync(response);
        }

        // 識別子の要素をreadonlyにする
        this.identifierInputs.forEach(e => e.setElementStyle("background-color", "#f0f0f0"));
        this.identifierInputs.forEach(e => e.setAttribute("readonly"));

        // textareaを自動リサイズ
        this.find("textarea").forEach(e => e.input());
    }
}

