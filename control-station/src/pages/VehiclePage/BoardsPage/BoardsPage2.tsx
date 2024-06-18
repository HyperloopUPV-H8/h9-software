import styles from "./BoardsPage.module.scss";
import { LCU } from "../Boards/LCU/LCU";
import { DLIM } from "../Boards/DLIM/DLIM";
import { LSM } from "../Boards/LSM/LSM";
import { Messages } from "../Messages/Messages";

export const BoardsPage2 = () => {

    return (
        <div className={styles.boardsPage}>
            <LCU />

            <div className={styles.column}>
                <DLIM />
                <LSM />
            </div>
            
            <Messages />
        </div>
    );
};
