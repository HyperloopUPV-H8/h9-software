import styles from "./BoolBar.module.scss";
type Props = {
    isOn: boolean;
};

export const BoolBar = ({ isOn }: Props) => {
    return (
        <div className={`barWrapper ${isOn ? styles.on : styles.off}`}></div>
    );
};
