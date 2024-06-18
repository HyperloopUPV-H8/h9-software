import { NavLink } from "react-router-dom";
import styles from "./TabItem.module.scss";

export type TabItemData = {
    label: string;
    path: string;
};

type Props = {
    item: TabItemData;
};

export const TabItem = ({ item }: Props) => {
    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                `${styles.tabItem} ${isActive ? styles.active : ""}`
            }
        >
            {item.label}
        </NavLink>
    );
};
