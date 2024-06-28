import styles from './Orders.module.scss';
import { useOrders } from './useOrders';
import { BoardOrdersView } from './BoardOrdersView/BoardOrdersView';
import { BoardOrders, OrderDescription } from '../..';

type Props = {
    orders: BoardOrders[];
};

export const Orders = ({ orders }: Props) => {
    return (
        <div className={styles.orders}>
            {orders.map((board) => (
                <BoardOrdersView key={board.name} board={board} showName />
            ))}
        </div>
    );
};
