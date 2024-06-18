import { useWebRTC } from "common";
import styles from "./CamerasPage.module.scss";
import { Cameras } from "./Cameras/Cameras";

export const CamerasPage = () => {
    const [streams] = useWebRTC("ws://192.168.0.10:4040");

    return (
        <div className={styles.camerasPage}>
            {streams && <Cameras streams={streams} />}
        </div>
    );
};
