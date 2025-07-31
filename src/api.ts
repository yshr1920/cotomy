import dayjs from 'dayjs';
import { StatusCodes } from "http-status-codes";
import LocaleCurrency from 'locale-currency';
import { CotomyDebugFeature, CotomyDebugSettings } from './debug';
import { CotomyElement } from "./view";



//#region 例外クラス

export class CotomyApiException extends Error {
    constructor(public readonly status: number, public readonly message: string,
            public readonly response: CotomyApiResponse, public readonly bodyText: string = "") {
        super(message);
        this.name = "CotomyApiException";
    }
}

export class CotomyHttpClientError extends CotomyApiException {
  constructor(status: number, message: string, response: CotomyApiResponse, body = "") {
    super(status, message, response, body);
    this.name = "CotomyHttpClientError";
  }
}

export class CotomyUnauthorizedException extends CotomyHttpClientError {
    constructor(status: number, message: string, response: CotomyApiResponse, body = "") {
        super(status, message, response, body);
        this.name = "CotomyUnauthorizedException";
    }
}

export class CotomyForbiddenException extends CotomyHttpClientError {
    constructor(status: number, message: string, response: CotomyApiResponse, body = "") {
        super(status, message, response, body);
        this.name = "CotomyForbiddenException";
    }
}

export class CotomyNotFoundException extends CotomyHttpClientError {
    constructor(status: number, message: string, response: CotomyApiResponse, body = "") {
        super(status, message, response, body);
        this.name = "CotomyNotFoundException";
    }
}

export class CotomyConflictException extends CotomyHttpClientError {
    constructor(status: number, message: string, response: CotomyApiResponse, body = "") {
        super(status, message, response, body);
        this.name = "CotomyConflictException";
    }
}

export class CotomyValidationException extends CotomyHttpClientError {
    constructor(status: number, message: string, response: CotomyApiResponse, body = "") {
        super(status, message, response, body);
        this.name = "CotomyValidationException";
    }
}

export class CotomyHttpServerError extends CotomyApiException {
  constructor(status: number, message: string, response: CotomyApiResponse, body = "") {
    super(status, message, response, body);
    this.name = "CotomyHttpServerError";
  }
}


export class CotomyResponseJsonParseException extends Error {
    public constructor(message: string = "Failed to parse JSON response.") {
        super(message);
        this.name = "ResponseJsonParseException";
    }
}

export class CotomyInvalidFormDataBodyException extends Error {
    public constructor(message: string = "Body must be an instance of FormData.") {
        super(message);
        this.name = "InvalidFormDataBodyException";
    }  
}

//#endregion 例外処理


//#region 定数定義

class Methods {
    public static readonly GET = 'GET';
    public static readonly POST = 'POST';
    public static readonly PUT = 'PUT';
    public static readonly PATCH = 'PATCH';
    public static readonly DELETE = 'DELETE';
    public static readonly HEAD = 'HEAD';
    public static readonly OPTIONS = 'OPTIONS';
    public static readonly TRACE = 'TRACE';
    public static readonly CONNECT = 'CONNECT';
}

class ResponseMessages {
    private static readonly _responseMessages: { [key: number]: string } = {
        [StatusCodes.BAD_REQUEST]: "There is an error in the input. Please check and try again.",
        [StatusCodes.UNAUTHORIZED]: "You are not authenticated. Please log in again.",
        [StatusCodes.FORBIDDEN]: "You do not have permission to use this feature. If necessary, please contact the administrator.",
        [StatusCodes.NOT_FOUND]: "The specified information could not be found. It may have been deleted. Please start over or contact the administrator.",
        [StatusCodes.METHOD_NOT_ALLOWED]: "This operation is currently prohibited on the server.",
        [StatusCodes.NOT_ACCEPTABLE]: "The request cannot be accepted. Processing has been stopped.",
        [StatusCodes.PROXY_AUTHENTICATION_REQUIRED]: "Proxy authentication is required for internet access.",
        [StatusCodes.REQUEST_TIMEOUT]: "The request timed out. Please try again.",
        [StatusCodes.CONFLICT]: "The identifier you are trying to register already exists. Please check the content and try again.",
        [StatusCodes.PAYMENT_REQUIRED]: "Payment is required for this operation. Please check.",
        [StatusCodes.GONE]: "The requested resource is no longer available.",
        [StatusCodes.LENGTH_REQUIRED]: "The Content-Length header field is required for the request.",
        [StatusCodes.PRECONDITION_FAILED]: "The request failed because the precondition was not met.",
        [StatusCodes.UNSUPPORTED_MEDIA_TYPE]: "The requested media type is not supported.",
        [StatusCodes.EXPECTATION_FAILED]: "The server cannot meet the Expect header of the request.",
        [StatusCodes.MISDIRECTED_REQUEST]: "The server cannot appropriately process this request.",
        [StatusCodes.UNPROCESSABLE_ENTITY]: "There is an error in the request content.",
        [StatusCodes.LOCKED]: "The requested resource is locked.",
        [StatusCodes.FAILED_DEPENDENCY]: "The request failed due to dependency on a previous failed request.",
        [StatusCodes.UPGRADE_REQUIRED]: "A protocol upgrade is required to perform this operation.",
        [StatusCodes.PRECONDITION_REQUIRED]: "This request requires a precondition.",
        [StatusCodes.TOO_MANY_REQUESTS]: "Too many requests have been sent in a short time. Please wait and try again.",
        [StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE]: "The request headers are too large.",
        [StatusCodes.INTERNAL_SERVER_ERROR]: "An unexpected error occurred. Please try again later.",
        [StatusCodes.BAD_GATEWAY]: "The server is currently overloaded. Please wait and try again later.",
        [StatusCodes.SERVICE_UNAVAILABLE]: "The service is temporarily unavailable. Please try again later.",
        [StatusCodes.GATEWAY_TIMEOUT]: "The communication timed out. Please try again.",
        [StatusCodes.HTTP_VERSION_NOT_SUPPORTED]: "The current communication method is not supported.",
        [StatusCodes.NOT_IMPLEMENTED]: "The server does not support the requested functionality.",
        [StatusCodes.INSUFFICIENT_STORAGE]: "The server has insufficient storage.",
        [StatusCodes.NETWORK_AUTHENTICATION_REQUIRED]: "Network authentication is required.",
        413: "The payload of the request is too large. Please check the size.", // PAYLOAD_TOO_LARGE
        414: "The request URI is too long.", // URI_TOO_LONG
        416: "The requested range is invalid.", // RANGE_NOT_SATISFIABLE
        508: "The server detected a loop.", // LOOP_DETECTED
        510: "The request does not include the required extensions.", // NOT_EXTENDED
    };

    public static getMessage(status: number): string {
        return this._responseMessages[status] || `Unexpected error: ${status}`;
    }
}

//#endregion 定数定義







//#region APIレスポンスクラス

export class CotomyApiResponse {
    private _json: any | null = null;
    private _map: Record<string, any> | null = null;

    public constructor(private readonly _response?: Response | null) {
    }

    public get available(): boolean {
        return !!this._response;
    }

    public get empty(): boolean {
        return !this._response || this._response.status === 0;
    }

    public get ok(): boolean {
        return this._response?.ok ?? false;
    }

    public get status(): number {
        return this._response?.status ?? 0;
    }

    public get statusText(): string {
        return this._response?.statusText ?? '';
    }

    public get headers(): Headers {
        return this._response?.headers ?? new Headers();
    }

    public async textAsync(): Promise<string> {
        return await this._response?.text() || "";
    }

    public async blobAsync(): Promise<Blob> {
        return await this._response?.blob() || new Blob;
    }

    /**
     * Centralized helper to ensure response JSON is parsed exactly once.
     */
    private async _ensureJsonParsedAsync(defaultValue: any): Promise<any> {
        if (this._response && this._json === null) {
            try {
                const text = await this._response.text();
                if (!text) {
                    this._json = defaultValue;
                } else {
                    this._json = JSON.parse(text);
                }
            } catch (error) {
                throw new CotomyResponseJsonParseException(
                    `Failed to parse JSON response: ${error instanceof Error ? error.message : String(error)}`
                );
            }
        }
        return this._json ?? defaultValue;
    }

    public async objectAsync<T = any>(defaultValue: T = {} as T): Promise<T> {
        return await this._ensureJsonParsedAsync(defaultValue);
    }

    public async arrayAsync<T = any>(defaultValue: T[] = []): Promise<T[]> {
        const parsed = await this._ensureJsonParsedAsync(defaultValue);
        return Array.isArray(parsed) ? parsed : defaultValue;
    }
}

//#endregion APIレスポンスクラス




//#region APIから取得したデータの展開

export class CotomyViewRenderer {
    private _locale: string | null = null;
    private _currency: string | null = null;

    private _renderers: { [key: string]: (element: CotomyElement, value: any) => void } = {};

    private _builded: boolean = false;
    

    public constructor(private readonly element: CotomyElement) {
    }

    protected get locale(): string {
        return this._locale = this._locale || navigator.language || 'en-US';
    }
    
    protected get currency(): string {
        return this._currency = this._currency || LocaleCurrency.getCurrency(this.locale) || 'USD';
    }

    public renderer(type: string, callback: (element: CotomyElement, value: any) => void): this {
        this._renderers[type] = callback;
        return this;
    }

    public get initialized(): boolean {
        return this._builded;
    }

    protected initialize(): this {
        if (!this.initialized) {
            this.renderer("mail", (element, value) => {
                element.clear();
                if (value) {
                    new CotomyElement(/* html */`<a href="mailto:${value}">${value}</a>`).appendTo(element);
                }
            });

            this.renderer("tel", (element, value) => {
                element.clear();
                if (value) {
                    new CotomyElement(/* html */`<a href="tel:${value}">${value}</a>`).appendTo(element);
                }
            });
            
            this.renderer("url", (element, value) => {
                element.clear();
                if (value) {
                    new CotomyElement(/* html */`<a href="${value}" target="_blank">${value}</a>`).appendTo(element);
                }
            });

            this.renderer("number", (element, value) => {
                element.clear();
                if (value) {
                    element.text = new Intl.NumberFormat(navigator.language || this.locale).format(value);
                }
            });

            this.renderer("currency", (element, value) => {
                element.clear();
                if (value) {
                    element.text = new Intl.NumberFormat(navigator.language || this.locale, { style: "currency", currency: this.currency }).format(value);
                }
            });

            this.renderer("utc", (element, value) => {
                element.clear();
                if (value) {
                    const hasOffset = /[+-]\d{2}:\d{2}$/.test(value);
                    const date = hasOffset ? new Date(value) : new Date(`${value}Z`);
                    if (!isNaN(date.getTime())) {
                        const format = element.attribute("data-cotomy-format") ?? "YYYY/MM/DD HH:mm";
                        element.text = dayjs(date).format(format);
                    }
                }
            });
        }
        return this;
    }

    public async applyAsync(respose: CotomyApiResponse): Promise<this> {
        if (!this.initialized) {
            this.initialize();
        }

        if (!respose.available) {
            throw new Error("Response is not available.");
        }

        for (const [key, value] of Object.entries(await respose.objectAsync())) {
            this.element.find(`[data-cotomy-bind="${key}" i]`).forEach(element => {
                if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.Bind)) {
                    console.debug(`Binding data to element [data-cotomy-bind="${key}"]:`, value);
                }
                const type = element.attribute("data-cotomy-bindtype")?.toLowerCase();
                if (type && this._renderers[type]) {
                    this._renderers[type](element, value);
                } else {
                    element.text = String(value ?? "");
                }
            });
        }

        return this;
    }
}

//#endregion



//#region インターフェース定義

export interface ICotomyApiOptions {
    baseUrl?: string | null;
    headers?: Record<string, string> | null;
    credentials?: RequestCredentials | null;
    redirect?: RequestRedirect | null;
    cache?: RequestCache | null;
    referrerPolicy?: ReferrerPolicy | null;
    mode?: RequestMode | null;
    keepalive?: boolean | null;
    integrity?: string | null;
}

export interface ICotomyRestSubmitForm {
    method: string;
    action: string;
    body: globalThis.FormData | Record<string, string> | any;
}

//#endregion インターフェース定義




export class CotomyApi {
    private readonly _abortController: AbortController = new AbortController();

    public constructor(private readonly _options: ICotomyApiOptions = {
            baseUrl: null, headers: null, credentials: null, redirect: null,
            cache: null, referrerPolicy: null, mode: null, keepalive: true,
            integrity: '', }) {
    }

    public get baseUrl(): string {
        return this._options.baseUrl || '';
    }

    public get headers(): Record<string, string> {
        return this._options.headers || {};
    }

    public get credentials(): RequestCredentials {
        return this._options.credentials || 'same-origin';
    }

    public get redirect(): RequestRedirect {
        return this._options.redirect || 'follow';
    }

    public get cache(): RequestCache {
        return this._options.cache || 'no-cache';
    }

    public get referrerPolicy(): ReferrerPolicy {
        return this._options.referrerPolicy || 'no-referrer';
    }

    public get mode(): RequestMode {
        return this._options.mode || 'cors';
    }

    public get keepalive(): boolean {
        return this._options.keepalive || true;
    }

    public get integrity(): string {
        return this._options.integrity || '';
    }

    public get abortController(): AbortController {
        return this._abortController;
    }


    private async requestAsync<T extends CotomyApiResponse = CotomyApiResponse>(method: string, path: string, body?: globalThis.FormData | Record<string, string> | any, signal?: AbortSignal, responseType?: new (response?: Response | null) => T): Promise<T> {
        if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.Api)) {
            console.debug(`API request: ${method} ${path}`, { body, headers: this.headers });
        }

        //#region Content-Type毎のbody変換処理

        const bodyTransformers: { [key: string]: (body: globalThis.FormData | Record<string, string> | any) => any } = {
            "application/json": (body) => JSON.stringify(body),
            "application/x-www-form-urlencoded": (body) => {
                if (body instanceof globalThis.FormData) {
                    let params = new URLSearchParams();
                    body.forEach((value, key) => {
                        params.append(key, String(value));
                    });
                    return params.toString();
                } else {
                    return new URLSearchParams(body).toString();
                }
            },
            "multipart/form-data": (body) => {
                if (body instanceof globalThis.FormData) {
                    return body;
                }
                const formData = new globalThis.FormData();
                for (const [key, value] of Object.entries(body)) {
                    formData.append(key, String(value));
                }
                return formData;
            }        
        };

        //#endregion


        // 先頭がアルファベットの場合は絶対または相対URLとみなす
        // それ以外はベースURLを使用して組み立てる
        const url = /^[a-zA-Z]/.test(path) ? path
                : `${(this.baseUrl || '').replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
        const headers = new Headers(this.headers);

        if (headers.has('Content-Type') &&  headers.get("Content-Type") === "multipart/form-data") {
            // multipart/form-dataの場合はbodyをFormDataとして送信するため、Content-Typeヘッダーを削除する
            headers.delete('Content-Type');
        }

        const ct = headers.get('Content-Type') || "multipart/form-data";
        const responseClass = responseType ?? CotomyApiResponse as new (response?: Response | null) => T;
        const response = new responseClass(await fetch(url, {
            method,
            headers,
            credentials: this.credentials,
            body: body ? (bodyTransformers[ct] ? bodyTransformers[ct](body) : body) : undefined,
            signal: signal ?? this._abortController.signal,
            redirect: this.redirect,
            cache: this.cache,
            referrerPolicy: this.referrerPolicy,
            mode: this.mode,
            keepalive: this.keepalive,
            integrity: this.integrity,
        }));

        // 400番台と500番台のエラーハンドリング
        if (response.status >= 400 && response.status < 600) {
            const errorBody = await response.textAsync().catch(() => 'No response body available');
            const errorMessage = response.statusText || ResponseMessages.getMessage(response.status) || `Unexpected error: ${response.status}`;
            if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.Api)) {
                console.error(`API request failed: ${errorMessage}`, response, errorBody);
            }
            switch (response.status) {
                case StatusCodes.BAD_REQUEST:
                case StatusCodes.UNPROCESSABLE_ENTITY:
                    throw new CotomyValidationException(response.status, errorMessage, response, errorBody);
                case StatusCodes.UNAUTHORIZED:
                    throw new CotomyUnauthorizedException(response.status, errorMessage, response, errorBody);
                case StatusCodes.FORBIDDEN:
                    throw new CotomyForbiddenException(response.status, errorMessage, response, errorBody);
                case StatusCodes.NOT_FOUND:
                    throw new CotomyNotFoundException(response.status, errorMessage, response, errorBody);
                case StatusCodes.CONFLICT:
                case StatusCodes.GONE:
                    throw new CotomyConflictException(response.status, errorMessage, response, errorBody);
                default:
                    if (response.status < 500) {
                        throw new CotomyHttpClientError(response.status, errorMessage, response, errorBody);
                    } else {
                        throw new CotomyHttpServerError(response.status, errorMessage, response, errorBody);
                    }
            }
        }

        return response as T;
    }


    //#region HTTPメソッド

    public async getAsync(path: string, parameters?: globalThis.FormData | Record<string, string | number>): Promise<CotomyApiResponse> {
        let queryString = '';
        if (parameters instanceof globalThis.FormData) {
            let params = new URLSearchParams();
            parameters.forEach((value, key) => {
                params.append(key, String(value));
            });
            queryString = params.toString();
        } else if (parameters) {
            queryString = new URLSearchParams(
                Object.fromEntries(
                    Object.entries(parameters).map(([key, value]) => [key, String(value)])
                )
            ).toString();
        }
        const fullUrl = queryString ? `${path}?${queryString}` : path;
        if (CotomyDebugSettings.isEnabled(CotomyDebugFeature.Api)) {
            console.debug(`GET request to: ${fullUrl}`);
        }
        return this.requestAsync(Methods.GET, fullUrl);
    }

    public async postAsync(path: string, body: globalThis.FormData | Record<string, string | number> | any): Promise<CotomyApiResponse> {
        return this.requestAsync(Methods.POST, path, body);
    }

    public async putAsync(path: string, body: globalThis.FormData | Record<string, string | number> | any): Promise<CotomyApiResponse> {
        return this.requestAsync(Methods.PUT, path, body);
    }

    public async patchAsync(path: string, body: globalThis.FormData | Record<string, string | number> | any): Promise<CotomyApiResponse> {
        return this.requestAsync(Methods.PATCH, path, body);
    }

    public async deleteAsync(path: string): Promise<CotomyApiResponse> {
        return this.requestAsync(Methods.DELETE, path);
    }

    public async headAsync(path: string): Promise<CotomyApiResponse> {
        return this.requestAsync(Methods.HEAD, path);
    }

    public async optionsAsync(path: string): Promise<CotomyApiResponse> {
        return this.requestAsync(Methods.OPTIONS, path);
    }

    public async traceAsync(path: string): Promise<CotomyApiResponse> {
        return this.requestAsync(Methods.TRACE, path);
    }

    public async connectAsync(path: string): Promise<CotomyApiResponse> {
        return this.requestAsync(Methods.CONNECT, path);
    }

    public async submitAsync(form: ICotomyRestSubmitForm): Promise<CotomyApiResponse> {
        return form.method.toUpperCase() === Methods.GET ? this.getAsync(form.action, form.body)
                : this.requestAsync(form.method.toUpperCase(), form.action, form.body);
    }

    //#endregion HTTPメソッド
}
