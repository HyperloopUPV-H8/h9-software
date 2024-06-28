import styles from './Data2Page.module.scss';
import { LCU } from '../Boards/LCU/LCU';
import { PCU } from '../Boards/PCU/PCU';
import { Orders, useOrders } from 'common';
import { Connections, Logger, MessagesContainer } from 'common';
import { Window } from 'components/Window/Window';
import { getHardcodedOrders } from './hardcodedOrders';

export const Data2Page = () => {
    const boardOrders = useOrders();

    return (
        <div className={styles.data2_page}>
            <div className={styles.column}>
                <LCU />
            </div>

            <div className={styles.column}>
                <PCU />
            </div>

            <div className={styles.column}>
                <Window title="Orders" className={styles.orders}>
                    <Orders orders={getHardcodedOrders(boardOrders)} />
                </Window>

                <Window title="Logger">
                    <Logger />
                </Window>
            </div>

            <div className={styles.column}>
                <Window title="Messages" className={styles.messages}>
                    <MessagesContainer />
                </Window>

                <Window title="Connections">
                    <Connections />
                </Window>
            </div>
        </div>
    );
};
