

export enum CotomyDebugFeature {
    Api = "api",
    Fill = "fill",
    Bind = "bind",
    FormData = "formdata",
    Html = "html",
    Page = "page",
    FormLoad = "formload",
}

export class CotomyDebugSettings {
    private static readonly PREFIX = "cotomy:debug";

    public static isEnabled(key?: string | CotomyDebugFeature): boolean {
        const global = localStorage.getItem(this.PREFIX);
        if (key) {
            const specific = localStorage.getItem(`${this.PREFIX}:${String(key)}`);
            return specific === "true" || global === "true";
        }
        return global === "true";
    }

    public static enable(key: string | CotomyDebugFeature): void {
        localStorage.setItem(`${this.PREFIX}:${String(key)}`, "true");
    }

    public static disable(key: string | CotomyDebugFeature): void {
        localStorage.setItem(`${this.PREFIX}:${String(key)}`, "false");
    }

    public static enableAll(): void {
        localStorage.setItem(this.PREFIX, "true");
    }

    public static disableAll(): void {
        localStorage.setItem(this.PREFIX, "false");
    }

    public static clear(key?: string | CotomyDebugFeature): void {
        if (key) {
            localStorage.removeItem(`${this.PREFIX}:${String(key)}`);
        } else {
            localStorage.removeItem(this.PREFIX);
        }
    }
}