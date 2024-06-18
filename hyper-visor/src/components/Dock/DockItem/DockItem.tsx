import { NavLink } from "react-router-dom";
import styles from "./DockItem.module.scss";

export type DockItemData = {
    icon: React.ReactNode;
    path: string;
};

type Props = {
    item: DockItemData;
};

export const DockItem = ({ item }: Props) => {
    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                `${styles.dockItem} ${isActive ? styles.active : ""}`
            }
        >
            {item.icon}
        </NavLink>
    );
};
