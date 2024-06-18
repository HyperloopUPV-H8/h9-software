import { TabItem, TabItemData } from "./TabItem/TabItem";
import styles from "./Tabs.module.scss";

type Props = {
    items: TabItemData[];
};

export const Tabs = ({ items }: Props) => {
    return (
        <div className={styles.tabs}>
            {items.map((item, index) => {
                return (
                    <TabItem
                        key={index}
                        item={item}
                    />
                );
            })}
        </div>
    );
};
