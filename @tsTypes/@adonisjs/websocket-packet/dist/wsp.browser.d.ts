declare const _exports: {
    codes: {
        OPEN: number;
        JOIN: number;
        LEAVE: number;
        JOIN_ACK: number;
        JOIN_ERROR: number;
        LEAVE_ACK: number;
        LEAVE_ERROR: number;
        EVENT: number;
        PING: number;
        PONG: number;
    };
} & {
    hasTopic(t: any): boolean;
    isValidJoinPacket: (t: any) => boolean;
    isValidLeavePacket: (t: any) => boolean;
    isValidEventPacket: (t: any) => boolean;
    joinPacket(t: any): {
        t: any;
        d: any;
    };
    leavePacket(t: any): {
        t: any;
        d: any;
    };
    joinAckPacket(t: any): {
        t: any;
        d: any;
    };
    joinErrorPacket(t: any, n: any): {
        t: any;
        d: any;
    };
    leaveAckPacket(t: any): {
        t: any;
        d: any;
    };
    leaveErrorPacket(t: any, n: any): {
        t: any;
        d: any;
    };
    eventPacket(t: any, n: any, i: any): {
        t: any;
        d: any;
    };
    pingPacket(): {
        t: number;
    };
    pongPacket(): {
        t: number;
    };
};
export = _exports;
