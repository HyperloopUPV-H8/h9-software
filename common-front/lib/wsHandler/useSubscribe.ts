import { useEffect, useRef } from 'react';
import { HandlerMessages } from './HandlerMessages';
import { SubscriptionTopic } from './types';
import { useWsHandler } from '.';
import { nanoid } from 'nanoid';

export function useSubscribe<T extends SubscriptionTopic>(
    topic: T,
    cb: (v: HandlerMessages[T]['response']) => void
) {
    const handler = useWsHandler();

    useEffect(() => {
        const id = nanoid();
        handler.subscribe(topic, { id, cb });

        return () => {
            handler.unsubscribe(topic, id);
        };
    }, [topic]);
}
