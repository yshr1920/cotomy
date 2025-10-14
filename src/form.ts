import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { CotomyApi, CotomyApiException, CotomyApiResponse, CotomyBracketBindNameGenerator, CotomyNotFoundException, CotomyViewRenderer, ICotomyBindNameGenerator } from "./api";
import { CotomyDebugFeature, CotomyDebugSettings } from "./debug";
import { CotomyElement, CotomyWindow } from "./view";




export abstract class CotomyForm extends CotomyElement {
    public generateId(prefix: string = "__cotomy_form__"): this {
        return super.generateId(prefix);
    }


    //#region フォームの基本情報

    protected method(): string {
        return this.attribute("method") ?? "get";
    }

    public actionUrl(): string {
        return this.attribute("action") ?? location.pathname + location.search;
    }

    //#endregion
    


    //#region フォームの再読み込み

    public async reloadAsync(): Promise<void> {
        CotomyWindow.instance.reload();
    }

    public get autoReload(): boolean {
        return this.attribute("data-cotomy-autoreload") !== "false";
    }

    public set autoReload(value: boolean) {
        if (value) {
            this.attribute("data-cotomy-autoreload", null);
        } else {
            this.attribute("data-cotomy-autoreload", "false");
        }
    }

    //#endregion



    //#region フォームの構築

    public get initialized(): boolean {
        return this.hasAttribute("data-cotomy-initialized");
    }
    
    public initialize(): this {
        if (!this.initialized) {
            this.on("submit", async e => {
                e.preventDefault();
                e.stopPropagation();
                await this.submitAsync();
            });

            this.attribute("data-cotomy-initialized", "");
        }
        return this;
    }

    //#endregion



    //#region Submit

    public abstract submitAsync(): Promise<void>;

    //#endregion
}



export class CotomyQueryForm extends CotomyForm {
    protected method(): string {
        return "get";   // QueryFormはGETメソッドを使用することが前提
    }


    public async submitAsync(): Promise<void> {
        const url = this.actionUrl();

        // クエリパラメータを連想配列にする
        const queryParams: { [key: string]: string } = {};
        const queryString = url.split("?")[1];
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

        location.href = `${url.split("?")[0]}?${newQueryString}`;
    }
}


export class CotomyApiFailedEvent extends Event {
    public constructor(private _response: CotomyApiResponse, eventName: string = "cotomy:apifailed") {
        super(eventName, { bubbles: true, cancelable: true });
    }

    public get response(): CotomyApiResponse {
        return this._response;
    }
}


export class CotomyApiForm extends CotomyForm {
    public apiClient(): CotomyApi {
        return new CotomyApi();
    }

    public actionUrl(): string {
        return this.attribute("action")!;
    }



    //#region API Submit

    public apiFailed(handle: ((event: CotomyApiFailedEvent) => void | Promise<void>)): this {
        this.on("cotomy:apifailed", async e => {
            await handle(e as CotomyApiFailedEvent);
        });
        return this;
    }

    protected triggerApiFailedEvent(response: CotomyApiResponse): void {
        this.trigger("cotomy:apifailed", new CotomyApiFailedEvent(response));
        if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.Api)) {
            console.error("API request failed:", response);
        }
    }

    public submitFailed(handle: ((event: CotomyApiFailedEvent) => void | Promise<void>)): this {
        this.on("cotomy:submitfailed", async e => {
            await handle(e as CotomyApiFailedEvent);
        });
        return this;
    }

    protected triggerSubmitFailedEvent(response: CotomyApiResponse): void {
        this.trigger("cotomy:submitfailed", new CotomyApiFailedEvent(response, "cotomy:submitfailed"));
        if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.Api)) {
            console.error("Submit failed:", response);
        }
    }

    protected method(): string {
        return this.attribute("method") ?? "post";
    }

    public formData(): FormData {
        const formElement = <HTMLFormElement>this.element;
        const formData = new FormData(formElement);

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

    public async submitAsync(): Promise<void> {
        const formData = this.formData();
        await this.submitToApiAsync(formData);
    }

    protected async submitToApiAsync(formData: FormData): Promise<CotomyApiResponse> {
        const api = this.apiClient();

        try {
            const response = await api.submitAsync({
                method: this.method(),
                action: this.actionUrl(),
                body: formData,
            });

            return response;
        } catch (error) {
            if (error instanceof CotomyApiException) {
                this.triggerApiFailedEvent(error.response);
                this.triggerSubmitFailedEvent(error.response);
            }
            throw error;
        }
    }

    //#endregion
}



export class CotomyEntityApiForm extends CotomyApiForm {

    protected get entityKey(): string | undefined {
        return this.attribute("data-cotomy-entity-key") ?? undefined;
    }
    
    protected get requiresEntityKey(): boolean {
        return this.attribute("data-cotomy-identify") !== "false";
    }

    protected get hasEntityKey(): boolean {
        return !!this.entityKey;
    }

    public actionUrl(): string {
        const action = this.attribute("action")!;
        const normalized = action.replace(/\/+$/, "");

        if (!this.entityKey) {
            return action.endsWith("/") ? action : `${normalized}/`;
        }

        return `${normalized}/${encodeURIComponent(this.entityKey)}`;
    }

    protected method(): string {
        if (this.hasAttribute("method") && this.attribute("method") !== "") {
            return this.attribute("method")!;
        }

        return this.hasEntityKey ? "put" : "post";
    }


    //#region データ識別

    protected setEntityKey(response: CotomyApiResponse) {
        if (this.requiresEntityKey && response.status === StatusCodes.CREATED) {
            if (this.hasEntityKey) {
                if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.FormLoad)) {
                    console.warn("Entity key already exists, but server responded with 201 Created. Possible duplicate POST.");
                }
                return;
            }

            const location = response.headers.get("Location");
            if (!location) return;

            const normalize = (url: string) => {
                const s = url.replace(/[?#].*$/, "");
                return s.endsWith("/") ? s.slice(0, -1) : s;
            };

            const toPath = (u: string) => {
                try { return new URL(u, location).pathname; } catch { return u; }
            };
            
            const baseAction = normalize(toPath(this.attribute("action")!));
            const locPath    = normalize(toPath(location));
            const actionParts   = baseAction.split("/");
            const locationParts = locPath.split("/");
            const isPrefix = locationParts.length >= actionParts.length && actionParts.every((p, i) => p === locationParts[i]);
            if (!isPrefix) {
                throw new Error(`Location path does not start with action path. action="${baseAction}", location="${locPath}"`);
            }

            const addedParts = locationParts.slice(actionParts.length).filter(Boolean);
            if (addedParts.length === 1 && addedParts[0]) {
                this.attribute("data-cotomy-entity-key", addedParts[0]);
            } else {
                const msg = `Location does not contain a single entity key segment.
                action="${baseAction}", location="${locPath}", added=["${addedParts.join('","')}"]`;
                throw new Error(msg);
            }
        }
    }

    protected async submitToApiAsync(formData: FormData): Promise<CotomyApiResponse> {
        const response = await super.submitToApiAsync(formData);

        // APIのレスポンスからidを設定
        if (this.requiresEntityKey && response.status === StatusCodes.CREATED) {
            this.setEntityKey(response);
        }

        return response;
    }

    //#endregion
}



export class CotomyEntityFillApiForm extends CotomyEntityApiForm {
    private _fillers: { [key: string]: (input: CotomyElement, value: any) => void } = {};

    public filler(type: string, func: (input: CotomyElement, value: any) => void): this {
        this._fillers[type] = func;
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
                input.attribute("checked", null);
                if (value) {
                    input.attribute("checked", "");
                }
            });

            this.filler("radio", (input, value) => {
                input.attribute("checked", null);
                if (input.value === value) {
                    input.attribute("checked", "");
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




    public async reloadAsync(): Promise<void> {
        await this.loadAsync();
    }

    protected loadActionUrl(): string {
        return this.actionUrl();
    }

    protected bindNameGenerator(): ICotomyBindNameGenerator {
        return new CotomyBracketBindNameGenerator();
    }

    public renderer(): CotomyViewRenderer {
        return new CotomyViewRenderer(this, this.bindNameGenerator());
    }

    public loadable(): boolean {
        return this.hasEntityKey;
    }

    protected async loadAsync(): Promise<CotomyApiResponse> {
        if (!this.loadable()) {
            return new CotomyApiResponse();
        }

        const api = this.apiClient();
        try {
            const response = await api.getAsync(this.loadActionUrl());
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

    protected async fillObjectAsync(bindNameGenerator: ICotomyBindNameGenerator, target: any, propertyName: string | undefined = undefined): Promise<void> {
        for (const [key, value] of Object.entries(target)) {
            if (key.endsWith('[]')) {
                continue;
            }

            const pname = bindNameGenerator.create(key, propertyName);
            if (Array.isArray(value)) continue;
            if (value && typeof value === "object") {
                await this.fillObjectAsync(bindNameGenerator, value, pname);
                continue;
            }

            this.find(`input[name="${pname}" i]:not([data-cotomy-fill="false"]):not([multiple]),
                    textarea[name="${pname}" i]:not([data-cotomy-fill="false"]), 
                    select[name="${pname}" i]:not([data-cotomy-fill="false"]):not([multiple])`).forEach(input => {
                if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.Fill)) {
                    console.debug(`Filling input[name="${pname}"] with value:`, value);
                }
                const type = input.attribute("type")?.toLowerCase();
                if (type && this._fillers[type]) {
                    this._fillers[type](input, value);
                } else {
                    input.value = String(value || "");
                }
            });
        }
    }

    protected async fillAsync(response: CotomyApiResponse): Promise<void> {
        if (response.ok && response.available) {
            await this.fillObjectAsync(this.bindNameGenerator(), await response.objectAsync());
            await this.renderer().applyAsync(response);
        }

        // textareaを自動リサイズ
        this.find("textarea").forEach(e => e.input());
    }
}
