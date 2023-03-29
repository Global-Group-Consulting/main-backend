export const connection: any;
export namespace smtp {
    const driver: string;
    const pool: boolean;
    const port: any;
    const host: any;
    const secure: boolean;
    namespace auth {
        const user: any;
        const pass: any;
    }
    const maxConnections: number;
    const maxMessages: number;
    const rateLimit: number;
}
export namespace sparkpost {
    const driver_1: string;
    export { driver_1 as driver };
    export const apiKey: any;
    export const extras: {};
}
export namespace mailgun {
    const driver_2: string;
    export { driver_2 as driver };
    export const domain: any;
    export const region: any;
    const apiKey_1: any;
    export { apiKey_1 as apiKey };
    const extras_1: {};
    export { extras_1 as extras };
}
export namespace ethereal {
    const driver_3: string;
    export { driver_3 as driver };
}
