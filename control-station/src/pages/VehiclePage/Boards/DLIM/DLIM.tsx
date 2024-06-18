import { Window } from "components/Window/Window"
import styles from "./DLIM.module.scss"
import dlim from "assets/svg/DLIM.svg"

export const DLIM = () => {
    return (
        <Window title="DLIM">
            <div className={styles.DLIMWrapper}>
                <img 
                    src={dlim} 
                    alt="DLIM" 
                />

                <img 
                    src={dlim} 
                    style={{
                        rotate: "180deg"
                    }}
                    alt="DLIM" 
                />
            </div>
        </Window>
    )
}
