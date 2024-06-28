import { useCallback, useEffect } from 'react';

export function useListenKey(
    key: string,
    callback: () => void,
    listen: boolean
) {
    const listener = useCallback(
        (ev: KeyboardEvent) => {
            if (ev.key == key) {
                ev.preventDefault();
                callback();
            }
        },
        [key, callback, listen]
    );

    useEffect(() => {
        if (listen) {
            document.addEventListener('keydown', listener);
        }

        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [listen, key, listener, callback]);
}
