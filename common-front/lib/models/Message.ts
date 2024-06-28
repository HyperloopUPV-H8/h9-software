export type Message = ProtectionMessage | InfoMessage;

export type ProtectionMessage = FaultMessage | WarningMessage | OkMessage;

type AbstractMessage = {
    id: string; // React key
    count: number;
    board: string;
    name: string;
    timestamp: Timestamp;
};

type FaultMessage = AbstractMessage & {
    kind: 'fault';
    payload: Protection;
};

type WarningMessage = AbstractMessage & {
    kind: 'warning';
    payload: Protection;
};

type OkMessage = AbstractMessage & {
    kind: 'ok';
    payload: Protection;
};

export type InfoMessage = AbstractMessage & {
    kind: 'info';
    payload: string;
};

export type Protection =
    | OutOfBounds
    | UpperBound
    | LowerBound
    | Equals
    | NotEquals
    | Timelimit
    | Error
    | Warning;

type OutOfBounds = {
    kind: 'OUT_OF_BOUNDS';
    data: {
        bounds: [number, number];
        value: number;
    };
};

type UpperBound = {
    kind: 'UPPER_BOUND';
    data: {
        bound: number;
        value: number;
    };
};

type LowerBound = {
    kind: 'LOWER_BOUND';
    data: {
        bound: number;
        value: number;
    };
};

type Equals = {
    kind: 'EQUALS';
    data: {
        value: number;
    };
};

type NotEquals = {
    kind: 'NOT_EQUALS';
    data: {
        want: number;
        value: number;
    };
};

type Timelimit = {
    kind: 'TIME_ACCUMULATION';
    data: {
        value: number;
        bound: number;
        timelimit: number;
    };
};

type Error = {
    kind: 'ERROR_HANDLER';
    data: string;
};

type Warning = {
    kind: 'WARNING';
    data: string;
};

export type Timestamp = {
    counter: number;
    second: number;
    minute: number;
    hour: number;
    day: number;
    month: number;
    year: number;
};
