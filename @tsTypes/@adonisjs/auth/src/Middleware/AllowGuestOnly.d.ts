export = AllowGuestOnly;
declare class AllowGuestOnly {
    handle({ auth, request }: {
        auth: any;
        request: any;
    }, next: any): Promise<void>;
}
