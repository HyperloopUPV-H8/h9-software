import styles from 'components/Sidebar/SidebarItem/SidebarItem.module.scss';
import { NavLink } from 'react-router-dom';

export type SidebarItemData = {
    path: string;
    icon: React.ReactNode;
};

type Props = {
    item: SidebarItemData;
    isActive: boolean;
};

export const SidebarItem = ({ item, isActive }: Props) => {
    return (
        <NavLink
            to={item.path}
            className={`${styles.link} ${isActive && styles.active}`}
        >
            {item.icon}
        </NavLink>
    );
};
