import { Tabs } from "components/Tabs/Tabs";
import styles from "./Vehicle.module.scss";
import { Outlet } from "react-router-dom";

export const Vehicle = () => {
    return (
        <div className={styles.vehicle}>
            <Tabs
                items={[
                    { label: "Levitation", path: "levitation" },
                    { label: "Propulsion", path: "propulsion" },
                    { label: "Power", path: "power" },
                ]}
            />
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};
