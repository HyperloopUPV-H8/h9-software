import { Order } from '../..';
import { createContext } from 'react';

export const OrderContext = createContext<(order: Order) => void>(() => {});
