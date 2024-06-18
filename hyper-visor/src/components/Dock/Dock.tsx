import styles from "./Dock.module.scss";
import { DockItem, DockItemData } from "./DockItem/DockItem";

type Props = {
    items: DockItemData[];
};

export const Dock = ({ items }: Props) => {
    return (
        <div className={styles.dock}>
            {items.map((item, index) => (
                <DockItem
                    key={index}
                    item={item}
                />
            ))}
        </div>
    );
};
