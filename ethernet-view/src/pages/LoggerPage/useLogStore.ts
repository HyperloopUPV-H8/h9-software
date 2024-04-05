import { create } from "zustand";
import zustymiddlewarets from "zustymiddlewarets";

export interface LogSession {
    name: string;
    measurementLogs: Map<string, { time: Date; value: number }[]>;
}
export type LogSessionCollection = LogSession[];

type LogStore = {
    logSessions: LogSessionCollection;
    openLogSession: string;
    setOpenLogSession: (logSession: string) => void;
    addLogSession: (log: LogSession) => void;
    clearLogSessions: () => void;
};


/*
    Zustand store for managing all the logger sessions uploaded.
    It is the nexo between the LogLoader and the LogsColumn components.
*/
export const useLogStore = create<LogStore>((set, get) => ({
    logSessions: [],
    openLogSession: "",
    setOpenLogSession: (logSession: string) => {
        set((state) => ({ ...state, openLogSession: logSession }));
    },
    addLogSession: (log: LogSession) => {
        if (get().logSessions.find((logSession) => logSession.name === log.name)) return;
        set((state) => ({ logSessions: [...state.logSessions, log] }));
    },
    clearLogSessions: () => set({ logSessions: [] }),
}));
