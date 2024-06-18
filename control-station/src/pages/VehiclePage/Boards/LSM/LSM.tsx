import { Window } from "components/Window/Window";
import styles from "./LSM.module.scss";
import lsm from "assets/svg/LSM.svg";

export const LSM = () => {
    return (
        <Window title="LSM">
            <div className={styles.LSMWrapper}>
                <img 
                    src={lsm} 
                    alt="LSM"
                />

                <img 
                    src={lsm}
                    style={{
                        rotate: "180deg"
                    }} 
                    alt="LSM"
                />
            </div>
        </Window>
    )
}
