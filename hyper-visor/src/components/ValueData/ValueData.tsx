import styles from "components/ValueData/ValueData.module.scss";
import { Value } from "components/ValueData/Value/Value";

type Props = {
    name: string;
    getUpdate: () => number;
    units: string;
};

export const ValueData = ({ name, getUpdate, units }: Props) => {
    return (
        <div className={styles.valueDataWrapper}>
            <span className={styles.name}>{name}</span>
            <Value 
                getUpdate={getUpdate}
                units={units}
            />
        </div>
    );
};
