export namespace csp {
    const directives: {};
    const reportOnly: boolean;
    const setAllHeaders: boolean;
    const disableAndroid: boolean;
}
export namespace xss {
    const enabled: boolean;
    const enableOnOldIE: boolean;
}
export const xframe: string;
export const nosniff: boolean;
export const noopen: boolean;
export namespace csrf {
    const enable: boolean;
    const methods: string[];
    const filterUris: never[];
    namespace cookieOptions {
        const httpOnly: boolean;
        const sameSite: boolean;
        const path: string;
        const maxAge: number;
    }
}
