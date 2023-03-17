export const connection: any;
export namespace sqlite {
    export const client: string;
    export namespace connection_1 {
        const filename: any;
    }
    export { connection_1 as connection };
    export const useNullAsDefault: boolean;
    export const debug: any;
}
export namespace mysql {
    const client_1: string;
    export { client_1 as client };
    export namespace connection_2 {
        const host: any;
        const port: any;
        const user: any;
        const password: any;
        const database: any;
    }
    export { connection_2 as connection };
    const debug_1: any;
    export { debug_1 as debug };
}
export namespace pg {
    const client_2: string;
    export { client_2 as client };
    export namespace connection_3 {
        const host_1: any;
        export { host_1 as host };
        const port_1: any;
        export { port_1 as port };
        const user_1: any;
        export { user_1 as user };
        const password_1: any;
        export { password_1 as password };
        const database_1: any;
        export { database_1 as database };
    }
    export { connection_3 as connection };
    const debug_2: any;
    export { debug_2 as debug };
}
